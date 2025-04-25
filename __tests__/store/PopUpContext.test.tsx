import { render } from '@testing-library/react'
import { PopUpContext, initialPopUpContext } from '@/store/PopUpContext'
import type { PopUp } from '@/types'


describe( 'PopUpContext', () => {

	it( 'should have the correct displayName', () => {
		
		expect( PopUpContext.displayName ).toBe( 'PopUpContext' )

	} )


	it( 'should have the correct initial context values', () => {

		expect( initialPopUpContext.groups.size ).toBe( 0 )
		expect( typeof initialPopUpContext.openPopUp ).toBe( 'function' )
		expect( typeof initialPopUpContext.closePopUp ).toBe( 'function' )

	} )


	it( 'should provide the initial context values', () => {

		let contextValue: PopUp.Ctx

		render(
			<PopUpContext.Consumer>
				{ value => {
					contextValue = value
					return null
				} }
			</PopUpContext.Consumer>
		)
		
		expect( contextValue! ).toEqual( initialPopUpContext )
		expect( contextValue!.openPopUp( { PopUp: <></> } ) ).toBe( '' )
		expect( contextValue!.closePopUp() ).toBeUndefined()

	} )

} )