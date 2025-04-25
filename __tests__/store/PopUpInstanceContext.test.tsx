import { render } from '@testing-library/react'
import { PopUpInstanceContext } from '@/store/PopUpInstanceContext'
import type { PopUp } from '@/types'


describe( 'PopUpInstanceContext', () => {

	it( 'has the correct displayName', () => {
		
		expect( PopUpInstanceContext.displayName ).toBe( 'PopUpInstanceContext' )

	} )


	it( 'initialises as undefined outside the PopUpInstanceContext.Provider', () => {

		let contextValue: PopUp.InstanceCtx | undefined

		render(
			<PopUpInstanceContext.Consumer>
				{ value => {
					contextValue = value
					return null
				} }
			</PopUpInstanceContext.Consumer>
		)
		
		expect( contextValue ).toBeUndefined()

	} )

} )