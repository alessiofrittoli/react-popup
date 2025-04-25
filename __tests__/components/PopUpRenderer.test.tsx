import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { getTypedMap } from '@alessiofrittoli/web-utils'

import { PopUpRenderer } from '@/components/PopUpRenderer'
import { usePopUp as use_PopUp } from '@/hooks/usePopUp'
import { PopUp } from '@/types'


jest.mock( '@/hooks/usePopUp' )

const usePopUp = use_PopUp as jest.Mock

describe( 'PopUpRenderer', () => {

	afterEach( () => {
		jest.resetAllMocks().resetModules()
	} )


	it( 'renders all active popups', () => {

		const mockGroups = getTypedMap<PopUp.GroupsMap>( [
			[ PopUp.Type.MODAL, getTypedMap<PopUp.Map>( [
				[ 'popup-1', <div key='popup-1'>Popup 1</div> ],
				[ 'popup-2', <div key='popup-2'>Popup 2</div> ],
			] ) ],
			[ PopUp.Type.TOAST, getTypedMap<PopUp.Map>( [
				[ 'popup-3', <div key='popup-3'>Popup 3</div> ],
				[ 'popup-4', <div key='popup-4'>Popup 4</div> ],
			] ) ],
		] )

		usePopUp.mockReturnValue( {
			context: {
				groups: mockGroups,
			},
		} )

		render( <PopUpRenderer /> )

		expect( screen.getByText( 'Popup 1' ) ).toBeInTheDocument()
		expect( screen.getByText( 'Popup 2') ).toBeInTheDocument()
		expect( screen.getByText( 'Popup 3' ) ).toBeInTheDocument()

	} )


	it( 'renders nothing if there are no active popups', () => {
		
		usePopUp.mockReturnValue( {
			context: {
				groups: new Map(),
			}
		} )

		const { container } = render( <PopUpRenderer /> )
		expect( container.firstChild ).toBeNull()

	} )

} )