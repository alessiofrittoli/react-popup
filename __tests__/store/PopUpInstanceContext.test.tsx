import { render } from '@testing-library/react'
import { PopUpInstanceContext, initialPopUpInstanceContext } from '@/store/PopUpInstanceContext'
import type { PopUp } from '@/types'


describe( 'PopUpInstanceContext', () => {

	it( 'should have the correct displayName', () => {
		
		expect( PopUpInstanceContext.displayName ).toBe( 'PopUpInstanceContext' )

	} )

	
	it( 'should have the correct initial context values', () => {

		expect( typeof initialPopUpInstanceContext.popupId ).toBe( 'string' )
		expect( typeof initialPopUpInstanceContext.closePopUp ).toBe( 'function' )

	} )


	it( 'should provide the initial context values', () => {

		let contextValue: PopUp.InstanceCtx

		render(
			<PopUpInstanceContext.Consumer>
				{ value => {
					contextValue = value
					return null
				} }
			</PopUpInstanceContext.Consumer>
		)
		
		expect( contextValue! ).toEqual( initialPopUpInstanceContext )
		expect( contextValue!.popupId ).toBe( '' )
		expect( contextValue!.closePopUp() ).toBeUndefined()

	} )

} )