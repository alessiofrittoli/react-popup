import '@testing-library/jest-dom'
import { useEffect } from 'react'
import { render, act, fireEvent, screen } from '@testing-library/react'

import { PopUpProvider } from '@/lib/provider'
import { PopUpContext } from '@/internals/context'
import { PopUpRenderer } from '@/lib/renderer'
import { usePopUp } from '@/lib/usePopUp'
import { PopUp } from '@/lib/types'


describe( '<PopUpProvider />', () => {

	let contextValue: PopUp.Ctx
	let renderContainer: HTMLElement

	beforeEach( () => {
		const result = render(
			<PopUpProvider>
				<PopUpContext.Consumer>
					{ value => {
						contextValue = value!
						return <PopUpRenderer />
					} }
				</PopUpContext.Consumer>
			</PopUpProvider>
		)
		renderContainer = result.container
	} )


	it( 'provides the initial context values', () => {

		expect( contextValue ).toBeDefined()
		expect( contextValue.groups ).toEqual( new Map() )
		expect( typeof contextValue.openPopUp ).toBe( 'function' )
		expect( typeof contextValue.closePopUp ).toBe( 'function' )

	} )
	

	describe( 'openPopUp', () => {

		it( 'opens a popup and add it to the default group', () => {
	
			act( () => {
				contextValue.openPopUp( {
					PopUp: () => <div>Test PopUp</div>
				} )
			} )
	
			const defaultGroup = contextValue.groups.get( PopUp.Type.UNKNOWN )
	
			expect( defaultGroup ).toBeDefined()
			expect( defaultGroup?.size ).toBe( 1 )
	
		} )


		it( 'accepts a ReactNode as PopUp', () => {

			act( () => {
				contextValue.openPopUp( {
					PopUp: <div>Test PopUp</div>
				} )
			} )

			expect( contextValue.groups.get( PopUp.Type.UNKNOWN )?.size ).toBe( 1 )

		} )


		it( 'accepts a custom PopUp.Id', () => {

			act( () => {
				contextValue.openPopUp( {
					id		: 'custom-popup-id',
					PopUp	: <div>Test PopUp</div>,
				} )
			} )

			expect(
				contextValue.groups.get( PopUp.Type.UNKNOWN )
					?.has( 'custom-popup-id' )
			).toBe( true )

		} )


		it( 'passes the PopUp.Id to the given PopUp React Element', async () => {

			interface PopUpComponentProps
			{
				id: PopUp.Id
			}

			const PopUpComponent: React.FC<PopUpComponentProps> = ( { id } ) => (
				<div>PopUp Id: { id }</div>
			)

			let popUpId: PopUp.Id | undefined = undefined

			act( () => {
				contextValue.openPopUp( {
					id		: 'custom-popup-id',
					PopUp	: PopUpComponent,
				} )
				popUpId = contextValue.openPopUp( {
					PopUp: PopUpComponent
				} )
			} )

			expect( contextValue.groups.get( PopUp.Type.UNKNOWN )?.size ).toBe( 2 )
			expect( await screen.findByText( `PopUp Id: ${ popUpId }` ) ).toBeInTheDocument()
			expect( await screen.findByText( `PopUp Id: custom-popup-id` ) ).toBeInTheDocument()

		} )


		it( 'passes additional custom props to the given PopUp React Element', async () => {

			interface PopUpComponentProps
			{
				id: PopUp.Id
				className: string
			}

			const PopUpComponent: React.FC<PopUpComponentProps> = ( { id, className } ) => (
				<div className={ className }>PopUp Id: { id }</div>
			)

			let popUpId: PopUp.Id | undefined = undefined

			act( () => {
				popUpId = contextValue.openPopUp( {
					PopUp: PopUpComponent,
					props: { className: 'test-classname' },
				} )
			} )

			const popUp = renderContainer.querySelector( '.test-classname' )
			expect( popUp ).toBeInTheDocument()
			expect( popUp?.textContent ).toBe( `PopUp Id: ${ popUpId }` )
		} )


		it( 'wraps the given PopUp in a PopUpInstanceContext to expose instance methods', async () => {

			const PopUpComponent: React.FC = () => {

				// eslint-disable-next-line react-server-components/use-client
				const { popupId, closePopUp } = usePopUp().instance

				useEffect( () => {
					// add a way to close this popup for test purposes only.
					const escHideHandler = ( event: KeyboardEvent ) => {
						if ( event.key !== 'C' ) return
						closePopUp()
					}
			
					document.addEventListener( 'keydown', escHideHandler )
					
					return () => document.removeEventListener( 'keydown', escHideHandler )
			
				}, [ closePopUp ] )
				
				return <div>PopUp Id: { popupId }</div>
			}

			let popUpId: PopUp.Id | undefined = undefined

			act( () => {
				popUpId = contextValue.openPopUp( {
					PopUp: <PopUpComponent />
				} )
			} )

			expect( contextValue.groups.get( PopUp.Type.UNKNOWN )?.size ).toBe( 1 )
			expect( await screen.findByText( `PopUp Id: ${ popUpId }` ) ).toBeInTheDocument()

			act( () => {
				fireEvent( document, new KeyboardEvent( 'keydown', { key: 'C' } ) )
			} )

			expect( contextValue.groups.get( PopUp.Type.UNKNOWN ) ).toBeUndefined()
			expect( screen.queryByText( `PopUp Id: ${ popUpId }` ) ).not.toBeInTheDocument()

		} )


		it( 'closes all popups when `single` option is given', () => {

			act( () => {
				contextValue.openPopUp( {
					PopUp: () => <div>Test PopUp 1</div>,
				} )
				contextValue.openPopUp( {
					PopUp: () => <div>Test PopUp 2</div>,
				} )
				contextValue.openPopUp( {
					PopUp	: () => <div>Test Drawer 1</div>,
					type	: PopUp.Type.DRAWER,
				} )
			} )

			expect( contextValue.groups.get( PopUp.Type.UNKNOWN )?.size ).toBe( 2 )
			expect( contextValue.groups.get( PopUp.Type.DRAWER )?.size ).toBe( 1 )

			act( () => {
				contextValue.openPopUp( {
					PopUp	: () => <div>It&apos;s just me</div>,
					single	: true,
					type	: PopUp.Type.TOAST, // could be any PopUp.Type
				} )
			} )

			expect( contextValue.groups.get( PopUp.Type.UNKNOWN ) ).toBeUndefined()
			expect( contextValue.groups.get( PopUp.Type.DRAWER ) ).toBeUndefined()
			expect( contextValue.groups.get( PopUp.Type.TOAST )?.size ).toBe( 1 )

		} )
		
		
		it( 'closes all popups of the current type group when `singleType` option is given', () => {

			act( () => {
				contextValue.openPopUp( {
					PopUp: () => <div>Test PopUp 1</div>,
				} )
				contextValue.openPopUp( {
					PopUp: () => <div>Test PopUp 2</div>,
				} )
				contextValue.openPopUp( {
					PopUp	: () => <div>Test Drawer 1</div>,
					type	: PopUp.Type.DRAWER,
				} )
			} )

			expect( contextValue.groups.get( PopUp.Type.UNKNOWN )?.size ).toBe( 2 )
			expect( contextValue.groups.get( PopUp.Type.DRAWER )?.size ).toBe( 1 )

			act( () => {
				contextValue.openPopUp( {
					PopUp		: () => <div>It&apos;s just me</div>,
					singleType	: true,
				} )
			} )

			expect( contextValue.groups.get( PopUp.Type.UNKNOWN )?.size ).toBe( 1 )
			expect( contextValue.groups.get( PopUp.Type.DRAWER )?.size ).toBe( 1 )

		} )


		it( 'does nothing but return the PopUp.Id only if an invalid PopUp is given', () => {
			
			act( () => {
				contextValue.openPopUp( {
					// @ts-expect-error negative testing
					PopUp: {},
				} )
			} )

			expect( contextValue.groups.get( PopUp.Type.UNKNOWN ) ).toBeUndefined()

		} )


		it( 'doesn\'t update state if the given PopUp already exists', () => {

			let contextGroups = contextValue.groups

			act( () => {
				contextValue.openPopUp( {
					id		: 'uniqueId',
					PopUp	: () => <div>Test PopUp</div>,
				} )
			} )

			// just proof of the next expectation
			expect( contextGroups ).not.toBe( contextValue.groups )

			contextGroups = contextValue.groups

			act( () => {
				contextValue.openPopUp( {
					id		: 'uniqueId',
					PopUp	: () => <div>Test PopUp</div>,
				} )
			} )

			expect( contextGroups ).toBe( contextValue.groups )
	
			const defaultGroup = contextValue.groups.get( PopUp.Type.UNKNOWN )
	
			expect( defaultGroup?.size ).toBe( 1 )

		} )

	} )


	describe( 'closePopUp', () => {

		let popupId: PopUp.Id

		beforeEach( () => {

			act( () => {
				popupId = contextValue.openPopUp( {
					PopUp: () => <div>Test PopUp</div>,
				} )
			} )

			expect( contextValue.groups.get( PopUp.Type.UNKNOWN )?.size ).toBe( 1 )

		} )


		it( 'removes a popup by PopUp.Id', () => {
			act( () => {
				contextValue.closePopUp( popupId )
			} )
			expect( contextValue.groups.get( PopUp.Type.UNKNOWN ) ).toBeUndefined()
		} )
		
		
		it( 'removes all popups by PopUp.Type that belongs to the given PopUp.Type group', () => {
			
			act( () => {
				contextValue.openPopUp( {
					PopUp: () => <div>Test PopUp 2</div>,
				} )
				contextValue.openPopUp( {
					PopUp	: () => <div>Test Drawer</div>,
					type	: PopUp.Type.DRAWER,
				} )
			} )

			expect( contextValue.groups.get( PopUp.Type.UNKNOWN )?.size ).toBe( 2 )
			expect( contextValue.groups.get( PopUp.Type.DRAWER )?.size ).toBe( 1 )

			act( () => {
				contextValue.closePopUp( PopUp.Type.UNKNOWN )
			} )

			expect( contextValue.groups.get( PopUp.Type.UNKNOWN ) ).toBeUndefined()
			expect( contextValue.groups.get( PopUp.Type.DRAWER )?.size ).toBe( 1 )

		} )
		
		
		it( 'removes all active popups when no PopUp.Id or PopUp.Type is given', () => {
			
			act( () => {
				contextValue.openPopUp( {
					PopUp: () => <div>Test PopUp 2</div>,
				} )
				contextValue.openPopUp( {
					PopUp	: () => <div>Test Drawer</div>,
					type	: PopUp.Type.DRAWER,
				} )
			} )

			expect( contextValue.groups.get( PopUp.Type.UNKNOWN )?.size ).toBe( 2 )
			expect( contextValue.groups.get( PopUp.Type.DRAWER )?.size ).toBe( 1 )

			act( () => {
				contextValue.closePopUp()
			} )

			expect( contextValue.groups.get( PopUp.Type.UNKNOWN ) ).toBeUndefined()
			expect( contextValue.groups.get( PopUp.Type.DRAWER ) ).toBeUndefined()

		} )


		it( 'get called when `Escape` key is pressed to close the latest popup', () => {

			const event = new KeyboardEvent( 'keydown', { code: 'Escape', key: 'Escape' } )
	
			act( () => {	
				contextValue.openPopUp( {
					PopUp: () => <div>Test PopUp 2</div>,
				} )
				
				contextValue.openPopUp( {
					PopUp	: () => <div>Test Drawer 1</div>,
					type	: PopUp.Type.DRAWER,
				} )
			} )
	
			expect( contextValue!.groups.get( PopUp.Type.UNKNOWN )?.size ).toBe( 2 )
			expect( contextValue!.groups.get( PopUp.Type.DRAWER )?.size ).toBe( 1 )
	
			act( () => {
				// other keydown events should not be taken care of and the next expectations should be the same as above.
				fireEvent( document, new KeyboardEvent( 'keydown', { code: 'A' } ) )
			} )
	
			expect( contextValue!.groups.get( PopUp.Type.UNKNOWN )?.size ).toBe( 2 )
			expect( contextValue!.groups.get( PopUp.Type.DRAWER )?.size ).toBe( 1 )
	
	
			act( () => {
				fireEvent( document, event )
			} )
	
			expect( contextValue!.groups.get( PopUp.Type.UNKNOWN )?.size ).toBe( 2 )
			expect( contextValue!.groups.get( PopUp.Type.DRAWER ) ).toBeUndefined()
	
			act( () => {
				fireEvent( document, event )
			} )
	
			expect( contextValue!.groups.get( PopUp.Type.UNKNOWN )?.size ).toBe( 1 )
	
			act( () => {
				fireEvent( document, event )
			} )
	
			expect( contextValue!.groups.get( PopUp.Type.UNKNOWN ) ).toBeUndefined()


			// subsequent 'Escape' key press doesn't affect state anymore
			act( () => {
				fireEvent( document, event )
			} )

			expect( contextValue!.groups.size ).toBe( 0 )
	
		} )


		it( 'doesn\'t alter state if no PopUp.Id or PopUp.Type is given and there is no grup in the Map', () => {

			let contextGroups = contextValue.groups
			
			act( () => {
				contextValue.closePopUp()
			} )
			
			// just proof of the next expectation
			expect( contextGroups ).not.toBe( contextValue.groups )
			
			contextGroups = contextValue.groups

			act( () => {
				contextValue.closePopUp()
			} )

			expect( contextGroups ).toBe( contextValue.groups )

		} )


		it( 'doesn\'t alter state if a PopUp.Id is given and there is no PopUp in any group with the given PopUp.Id', () => {

			const contextGroups = contextValue.groups

			act( () => {
				contextValue.closePopUp( 'unexistingId' )
			} )

			expect( contextGroups ).toBe( contextValue.groups )

		} )


		it( 'doesn\'t alter state if a PopUp.Type is given and there is no group of that type or it is empty', () => {

			const contextGroups = contextValue.groups

			act( () => {
				contextValue.closePopUp( PopUp.Type.DRAWER )
			} )

			expect( contextGroups ).toBe( contextValue.groups )

		} )

	} )


	describe( 'isPopUpOpen', () => {

		it( 'checks if there is an opened PopUp with the given id', () => {

			act( () => {
				contextValue.openPopUp( {
					id		: 'custom-popup-id',
					PopUp	: <div>Test PopUp</div>,
				} )
			} )

			expect(
				contextValue.isPopUpOpen( 'custom-popup-id' )
			).toBe( true )
			
			expect(
				contextValue.isPopUpOpen( 'a-random-popup-id' )
			).toBe( false )

		} )
		
		
		it( 'checks if there is an opened PopUp with the given id and the given type', () => {

			act( () => {
				contextValue.openPopUp( {
					id		: 'custom-popup-id',
					PopUp	: <div>Test PopUp</div>,
					type	: PopUp.Type.MODAL,
				} )
			} )

			expect(
				contextValue.isPopUpOpen( 'custom-popup-id', PopUp.Type.MODAL )
			).toBe( true )
			
			expect(
				contextValue.isPopUpOpen( 'custom-popup-id', PopUp.Type.TOAST )
			).toBe( false )

		} )

	} )

} )