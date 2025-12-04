import { checkIsPopUpOpen, checkIsPopUpType } from '@/lib/utils'
import { PopUp } from '@/lib/types'
import { getTypedMap } from '@alessiofrittoli/web-utils'

describe( 'isPopUpType', () => {

	it( 'returns true for valid PopUp.Type values', () => {

		expect( checkIsPopUpType( PopUp.Type.UNKNOWN ) ).toBe( true )
		expect( checkIsPopUpType( PopUp.Type.TOAST ) ).toBe( true )
		expect( checkIsPopUpType( PopUp.Type.MODAL ) ).toBe( true )
		expect( checkIsPopUpType( PopUp.Type.DRAWER ) ).toBe( true )
	
	} )

	
	it( 'returns false for invalid or PopUp.Id values', () => {

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


describe( 'checkIsPopUpOpen', () => {

	it( 'returns true if there is some in any group with the given id', () => {

		const id = 'someId'

		const groups = getTypedMap<PopUp.GroupsMap>( [
			[ PopUp.Type.UNKNOWN, getTypedMap<PopUp.Map>( [
				[ id, <div key={ id }></div> ]
			] ) ]
		] )

		expect( checkIsPopUpOpen( groups, id ) )
			.toBe( true )
	
	} )


	it( 'returns true if there is some in specified group with the given id', () => {

		const id = 'someId'
		const anotherId = 'anotherId'

		const groups = getTypedMap<PopUp.GroupsMap>( [
			[ PopUp.Type.DRAWER, getTypedMap<PopUp.Map>( [
				[ id, <div key={ id }></div> ]
			] ) ],
			[ PopUp.Type.MODAL, getTypedMap<PopUp.Map>( [
				[ anotherId, <div key={ id }></div> ]
			] ) ],
		] )

		expect( checkIsPopUpOpen( groups, id, PopUp.Type.DRAWER ) )
			.toBe( true )
	
		expect( checkIsPopUpOpen( groups, anotherId, PopUp.Type.DRAWER ) )
			.toBe( false )
		
		expect( checkIsPopUpOpen( groups, anotherId, PopUp.Type.MODAL ) )
			.toBe( true )
		
		expect( checkIsPopUpOpen( groups, id, PopUp.Type.MODAL ) )
			.toBe( false )
	
		
	} )

} )