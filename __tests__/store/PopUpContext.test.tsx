import { render } from '@testing-library/react'
import { PopUpContext, initialPopUpContext } from '@/store/PopUpContext'
import type { PopUp } from '@/types'


describe( 'PopUpContext', () => {

	it( 'has the correct displayName', () => {
		
		expect( PopUpContext.displayName ).toBe( 'PopUpContext' )

	} )


	it( 'has the correct initial context values', () => {

		expect( initialPopUpContext.groups ).toEqual( new Map() )
		expect( initialPopUpContext.groups.size ).toBe( 0 )

	} )


	it( 'initialises as undefined outside the PopUpContext.Provider', () => {

		let contextValue: PopUp.Ctx | undefined

		render(
			<PopUpContext.Consumer>
				{ value => {
					contextValue = value
					return null
				} }
			</PopUpContext.Consumer>
		)
		
		expect( contextValue ).toBeUndefined()

	} )

} )