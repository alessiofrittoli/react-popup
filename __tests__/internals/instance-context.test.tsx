import { PopUpInstanceContext } from '@/internals/instance-context'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { PopUp } from '@/types'

describe('PopUpInstanceContext', () => {
	it('has the correct displayName', () => {
		expect(PopUpInstanceContext.displayName).toBe('PopUpInstanceContext')
	})

	it('initialises as undefined outside the PopUpInstanceContext.Provider', () => {
		let contextValue: PopUp.InstanceCtx | undefined

		render(
			<PopUpInstanceContext.Consumer>
				{value => {
					contextValue = value
					return null
				}}
			</PopUpInstanceContext.Consumer>,
		)

		expect(contextValue).toBeUndefined()
	})
})
