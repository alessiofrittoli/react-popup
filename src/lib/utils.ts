import { PopUp } from '@/lib/types'

/**
 * Check if the given `value` is a {@link PopUp.Type} or not.
 * 
 * @param value The value to check.
 * @returns `true` if the given `value` is a {@link PopUp.Type}, `false` otherwise.
 */
export const isPopUpType = ( value: PopUp.Id | PopUp.Type ): value is PopUp.Type => (
	Object.values( PopUp.Type ).includes( value as PopUp.Type )
)