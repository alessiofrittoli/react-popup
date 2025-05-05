'use client'

import { useCallback, useEffect, useState } from 'react'
import { randomUUID } from '@alessiofrittoli/math-utils'
import { getTypedMap } from '@alessiofrittoli/web-utils'
import { isComponentType, isReactNode } from '@alessiofrittoli/react-api'

import { PopUpContext } from './PopUpContext'
import { PopUpInstanceContext } from './PopUpInstanceContext'
import { PopUp } from '@/types'
import { isPopUpType } from '@/utils'


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
			return setGroups( getTypedMap() )
		}

		setGroups( map => (
			getTypedMap(
				Array.from( map.entries() )
					.map( ( [ type, popupMap ] ) => {
						
						/**
						 * Remove the entire PopUp.Type group.
						 * 
						 */
						if ( isPopUpType( popupIdOrType ) && popupIdOrType === type ) {
							return null
						}

						/**
						 * Do not alter state if trying to close a popup that is not even in the group.
						 * 
						 */
						if ( ! popupMap.has( popupIdOrType ) ) {
							return [ type, popupMap ]
						}

						/**
						 * Remove the PopUp from the group.
						 *
						 */
						popupMap.delete( popupIdOrType )

						/**
						 * Ensure no empty Map of popups is added to a PopUp.Type group.
						 * 
						 */
						if ( popupMap.size <= 0 ) {
							return null
						}

						/**
						 * Update the state with the requested popup removed from the PopUp.Type group.
						 * 
						 */
						return [ type, getTypedMap<PopUp.Map>( popupMap ) ]
					} )
					/**
					 * Filter nullish returned value to ensure no empty Map is kept.
					 * 
					 */
					.filter( Boolean ) as [ PopUp.Type, PopUp.GroupMap ][]
			)
		) )

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
			
			setGroups( map => {

				if ( single ) {
					return (
						getTypedMap<PopUp.GroupsMap>()
							.set( type, getTypedMap<PopUp.Map>().set( id, ProxyedPopUpNode ) )
					)
				}
				
				if ( singleType ) {
					return (
						getTypedMap<PopUp.GroupsMap>( map )
							.set( type,
								getTypedMap<PopUp.Map>()
									.set( id, ProxyedPopUpNode )
							)
					)
				}

				return (
					getTypedMap<PopUp.GroupsMap>( map )
						.set( type,
							( map.get( type ) || getTypedMap<PopUp.Map>() )
								.set( id, ProxyedPopUpNode )
						)
				)

			} )

			return id

		}, [ closePopUp ]
	)


	const isPopUpOpen = useCallback<PopUp.IsPopUpOpenHandler>( ( id, type ) => (
		(
			! type
				? groups.entries()
				: groups.entries().filter( ( [ popUpType ] ) => type === popUpType )
		).some( ( [, group ] ) => (
			!! group.entries()
				.find( ( [ popUpId ] ) => id === popUpId )
		) )
	), [ groups ] )

	
	/** Close the latest popup when user hit `Escape` key. */
	useEffect( () => {

		const escHideHandler = ( event: KeyboardEvent ) => {
			if ( event.code !== 'Escape' || event.key !== 'Escape' ) return

			const group = Array.from( groups.values() ).pop()
			if ( ! group ) return
			
			closePopUp( Array.from( group.keys() ).pop() )
		}

		document.addEventListener( 'keydown', escHideHandler )
		
		return () => document.removeEventListener( 'keydown', escHideHandler )

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