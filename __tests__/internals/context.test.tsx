import { PopUpContext } from '@/internals/context'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { PopUp } from '@/types'

describe('PopUpContext', () => {
	it('has the correct displayName', () => {
		expect(PopUpContext.displayName).toBe('PopUpContext')
	})

	it('initialises as undefined outside the PopUpContext.Provider', () => {
		let contextValue: PopUp.Ctx | undefined

		render(
			<PopUpContext.Consumer>
				{value => {
					contextValue = value
					return null
				}}
			</PopUpContext.Consumer>,
		)

		expect(contextValue).toBeUndefined()
	})
})
