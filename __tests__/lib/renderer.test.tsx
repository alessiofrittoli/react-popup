import { usePopUp as _usePopUp, type UsePopUpReturnType } from '@/lib/usePopUp'
import { describe, it, expect, vi, type Mock } from 'vitest'
import { getTypedMap } from '@alessiofrittoli/typed-map'
import { render, screen } from '@testing-library/react'
import { PopUpRenderer } from '@/lib/renderer'
import { PopUp } from '@/types'

vi.mock('@/lib/usePopUp')

const usePopUp = _usePopUp as Mock<typeof _usePopUp>

describe('PopUpRenderer', () => {
	it('renders all active popups', () => {
		const mockGroups = getTypedMap<PopUp.GroupsMap>([
			[
				PopUp.Type.MODAL,
				getTypedMap<PopUp.Map>([
					['popup-1', <div key='popup-1'>Popup 1</div>],
					['popup-2', <div key='popup-2'>Popup 2</div>],
				]),
			],
			[
				PopUp.Type.TOAST,
				getTypedMap<PopUp.Map>([
					['popup-3', <div key='popup-3'>Popup 3</div>],
					['popup-4', <div key='popup-4'>Popup 4</div>],
				]),
			],
		])

		usePopUp.mockReturnValue({
			context: {
				groups: mockGroups,
			},
		} as UsePopUpReturnType<string>)

		render(<PopUpRenderer />)

		expect(screen.getByText('Popup 1')).toBeInTheDocument()
		expect(screen.getByText('Popup 2')).toBeInTheDocument()
		expect(screen.getByText('Popup 3')).toBeInTheDocument()
	})

	it('renders nothing if there are no active popups', () => {
		usePopUp.mockReturnValue({
			context: {
				groups: new Map(),
			},
		} as UsePopUpReturnType<string>)

		const { container } = render(<PopUpRenderer />)
		expect(container.firstChild).toBeNull()
	})
})
