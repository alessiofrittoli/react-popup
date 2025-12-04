'use client'

import { useCallback, useEffect, useState } from 'react'
import { randomUUID } from '@alessiofrittoli/math-utils'
import { getTypedMap } from '@alessiofrittoli/web-utils'
import { isComponentType, isReactNode } from '@alessiofrittoli/react-api'

import { PopUpContext } from '@/internals/context'
import { PopUpInstanceContext } from '@/internals/instance-context'
import { PopUp } from '@/lib/types'
import { checkIsPopUpOpen, checkIsPopUpType } from '@/lib/utils'


/**
 * The PopUp React Context Provider.
 * 
 * Wrap your application with this Component to be able to use popups related functions.
 */
export const PopUpProvider: React.FC<React.PropsWithChildren> = ( { children } ) => {

	const [ groups, setGroups ] = useState( getTypedMap<PopUp.GroupsMap>() )

	const closePopUp = useCallback<PopUp.CloseHandler>( popupIdOrType => {

		if ( ! popupIdOrType ) {
			/**
			 * Reset PopUp Map to its initial value.
			 * 
			 */
			return setGroups( groups => groups.size <= 0 ? groups : getTypedMap() )
		}

		setGroups( groups => {

			const isPopUpType = checkIsPopUpType( popupIdOrType )

			/**
			 * Do not alter state if user wants to close a specific popup with the given PopUp.Id and it is not open.
			 * 
			 */
			if ( ! isPopUpType && ! checkIsPopUpOpen( groups, popupIdOrType ) ) {
				return groups
			}

			/**
			 * Do not alter state if user wants to close all popups of given PopUp.Type and that group is empty.
			 * 
			 */
			if ( isPopUpType && ! groups.get( popupIdOrType )?.size ) {
				return groups
			}

			return (
				getTypedMap(
					Array.from( groups.entries() )
						.map( ( [ type, popups ] ) => {
							
							/**
							 * Remove the entire PopUp.Type group.
							 * 
							 */
							if ( isPopUpType && popupIdOrType === type ) {
								return null
							}

							/**
							 * Do not alter state if trying to close a popup that is not even in the group.
							 * 
							 */
							if ( ! popups.has( popupIdOrType ) ) {
								return [ type, popups ]
							}

							/**
							 * Remove the PopUp from the group.
							 *
							 */
							popups.delete( popupIdOrType )

							/**
							 * Ensure no empty Map of popups is added to a PopUp.Type group.
							 * 
							 */
							if ( popups.size <= 0 ) {
								return null
							}

							/**
							 * Update the state with the requested popup removed from the PopUp.Type group.
							 * 
							 */
							return [ type, getTypedMap<PopUp.Map>( popups ) ]
						} )
						/**
						 * Filter nullish returned value to ensure no empty Map is kept.
						 * 
						 */
						.filter( Boolean ) as [ PopUp.Type, PopUp.GroupMap ][]
				)
			)
		} )

	}, [] )


	const openPopUp = useCallback<PopUp.OpenHandler>(
		( {
			PopUp: PopUpComponent,
			id = randomUUID(),
			props,
			single,
			singleType,
			type = PopUp.Type.UNKNOWN,
		} ) => {			

			const PopUpNode = (
				isComponentType<{ id: PopUp.Id }>( PopUpComponent )
					? <PopUpComponent { ...props } id={ id }/>
					: ( isReactNode( PopUpComponent ) ? PopUpComponent : null )
			)

			if ( ! PopUpNode ) return id

			const ProxyedPopUpNode = (
				<PopUpInstanceContext.Provider value={ {
					popupId: id,
					closePopUp: () => closePopUp( id )
				} }>{ PopUpNode }</PopUpInstanceContext.Provider>
			)
			
			setGroups( groups => {

				if ( single ) {
					return (
						getTypedMap<PopUp.GroupsMap>()
							.set( type, getTypedMap<PopUp.Map>().set( id, ProxyedPopUpNode ) )
					)
				}
				
				if ( singleType ) {
					return (
						getTypedMap<PopUp.GroupsMap>( groups )
							.set( type,
								getTypedMap<PopUp.Map>()
									.set( id, ProxyedPopUpNode )
							)
					)
				}

				/**
				 * Do not alter state if PopUp is already open.
				 * 
				 */
				if ( checkIsPopUpOpen( groups, id, type ) ) return groups

				return (
					getTypedMap<PopUp.GroupsMap>( groups )
						.set( type,
							( groups.get( type ) || getTypedMap<PopUp.Map>() )
								.set( id, ProxyedPopUpNode )
						)
				)

			} )

			return id

		}, [ closePopUp ]
	)


	const isPopUpOpen = useCallback<PopUp.IsPopUpOpenHandler>( ( id, type ) => (
		checkIsPopUpOpen( groups, id, type )
	), [ groups ] )

	
	/** Close the latest popup when user hit `Escape` key. */
	useEffect( () => {

		const escCloseHandler = ( event: KeyboardEvent ) => {
			if ( event.code !== 'Escape' || event.key !== 'Escape' ) return

			const group = Array.from( groups.values() ).pop()
			if ( ! group ) return
			
			closePopUp( Array.from( group.keys() ).pop() )
		}

		document.addEventListener( 'keydown', escCloseHandler )
		
		return () => document.removeEventListener( 'keydown', escCloseHandler )

	}, [ groups, closePopUp ] )


	const context: PopUp.Ctx = {
		groups, openPopUp, closePopUp, isPopUpOpen,
	}

	
	return (
		<PopUpContext.Provider value={ context }>
			{ children }
		</PopUpContext.Provider>
	)

}