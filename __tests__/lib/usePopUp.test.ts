import { describe, expect, it, vi, type Mock } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useContext as _useContext } from 'react'
import { usePopUp } from '@/lib/usePopUp'

vi.mock('react', async importActual => ({
	...(await importActual()),
	useContext: vi.fn(),
}))

const useContext = _useContext as Mock<typeof _useContext>

describe('usePopUp', () => {
	it('returns context and instance when both contexts are provided', () => {
		const mockPopUpContextValue = { someKey: 'someValue' }
		const mockPopUpInstanceContextValue = { someKey: 'someValue' }

		useContext
			.mockImplementationOnce(() => mockPopUpContextValue)
			.mockImplementationOnce(() => mockPopUpInstanceContextValue)

		const { result } = renderHook(() => usePopUp())

		expect(result.current.context).toBe(mockPopUpContextValue)
		expect(result.current.instance).toBe(mockPopUpInstanceContextValue)
	})

	it('throws a new Error if trying to access PopUpContext outside the PopUpProvider', () => {
		expect(() => renderHook(() => usePopUp())).toThrow(
			'PopUpContext is not defined. `usePopUp` is only available inside the PopUpProvider Component. Please wrap the application within the PopUpProvider Component.',
		)
	})

	it('throws a new Error if trying to access PopUpInstanceContext outside the PopUpInstanceContext.Provider', () => {
		useContext.mockImplementationOnce(() => ({ someKey: 'someValue' }))

		const { result } = renderHook(() => usePopUp())

		expect(() => result.current.instance).toThrow(
			'PopUpInstanceContext is not defined. This may be happen if you try to access instance context outside the PopUp.',
		)
	})
})
