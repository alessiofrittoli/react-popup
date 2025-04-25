import React from 'react'
import { renderHook } from '@testing-library/react'
import { usePopUp } from '@/hooks/usePopUp'


describe( 'usePopUp', () => {

	it( 'should return context and instance when both contexts are provided', () => {

		const mockPopUpContextValue = { someKey: 'someValue' }
		const mockPopUpInstanceContextValue = { someKey: 'someValue' }

		jest.spyOn( React, 'useContext' )
			.mockImplementationOnce( () => mockPopUpContextValue )
			.mockImplementationOnce( () => mockPopUpInstanceContextValue )

		const { result } = renderHook( () => usePopUp() )

		expect( result.current.context ).toBe( mockPopUpContextValue )
		expect( result.current.instance ).toBe( mockPopUpInstanceContextValue )

	} )


	it( 'throws a new Error if trying to access PopUpContext outside the PopUpProvider', () => {
	
		expect( () => renderHook( () => usePopUp() ) )
			.toThrow(
				'PopUpContext is not defined. `usePopUp` is only available inside the PopUpProvider Component. Please wrap the application within the PopUpProvider Component.'
			)
		
	} )


	it( 'throws a new Error if trying to access PopUpInstanceContext outside the PopUpInstanceContext.Provider', () => {

		jest.spyOn( React, 'useContext' )
			.mockImplementationOnce( () => ( { someKey: 'someValue' } ) )
		
		const { result } = renderHook( () => usePopUp() )

		expect( () => result.current.instance )
			.toThrow(
				'PopUpInstanceContext is not defined. This may be happen if you try to access instance context outside the PopUp.'
			)
		
	} )

} )