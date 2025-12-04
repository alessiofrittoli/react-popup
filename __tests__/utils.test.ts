import { isPopUpType } from '@/lib/utils'
import { PopUp } from '@/lib/types'

describe( 'isPopUpType', () => {

	it( 'reutns true for valid PopUp.Type values', () => {

		expect( isPopUpType( PopUp.Type.UNKNOWN ) ).toBe( true )
		expect( isPopUpType( PopUp.Type.TOAST ) ).toBe( true )
		expect( isPopUpType( PopUp.Type.MODAL ) ).toBe( true )
		expect( isPopUpType( PopUp.Type.DRAWER ) ).toBe( true )
	
	} )

	
	it( 'reutns false for invalid or PopUp.Id values', () => {

		expect( isPopUpType( 'popup-id' ) ).toBe( false )
		expect( isPopUpType( 'INVALID_TYPE' ) ).toBe( false )
		// @ts-expect-error negative testing
		expect( isPopUpType( 123 ) ).toBe( false )
		// @ts-expect-error negative testing
		expect( isPopUpType( null ) ).toBe( false )
		// @ts-expect-error negative testing
		expect( isPopUpType( undefined ) ).toBe( false )

	} )

} )