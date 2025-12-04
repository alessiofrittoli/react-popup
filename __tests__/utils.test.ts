import { checkIsPopUpType } from '@/lib/utils'
import { PopUp } from '@/lib/types'

describe( 'isPopUpType', () => {

	it( 'reutns true for valid PopUp.Type values', () => {

		expect( checkIsPopUpType( PopUp.Type.UNKNOWN ) ).toBe( true )
		expect( checkIsPopUpType( PopUp.Type.TOAST ) ).toBe( true )
		expect( checkIsPopUpType( PopUp.Type.MODAL ) ).toBe( true )
		expect( checkIsPopUpType( PopUp.Type.DRAWER ) ).toBe( true )
	
	} )

	
	it( 'reutns false for invalid or PopUp.Id values', () => {

		expect( checkIsPopUpType( 'popup-id' ) ).toBe( false )
		expect( checkIsPopUpType( 'INVALID_TYPE' ) ).toBe( false )
		// @ts-expect-error negative testing
		expect( checkIsPopUpType( 123 ) ).toBe( false )
		// @ts-expect-error negative testing
		expect( checkIsPopUpType( null ) ).toBe( false )
		// @ts-expect-error negative testing
		expect( checkIsPopUpType( undefined ) ).toBe( false )

	} )

} )