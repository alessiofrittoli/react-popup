import { render } from '@testing-library/react'
import { PopUpContext } from '@/store/PopUpContext'
import type { PopUp } from '@/types'


describe( 'PopUpContext', () => {

	it( 'has the correct displayName', () => {
		
		expect( PopUpContext.displayName ).toBe( 'PopUpContext' )

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