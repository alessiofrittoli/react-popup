import { useContext } from 'react'
import { PopUpContext} from '@/internals/context'
import { PopUpInstanceContext } from '@/internals/instance-context'
import type { PopUp } from '@/lib/types'


interface UsePopUpReturnType
{
	/** PopUp general React Context. */
	readonly context: PopUp.Ctx
	/** PopUp single instance React Context. */
	readonly instance: PopUp.InstanceCtx
}


/**
 * Access PopUp React Context API.
 * 
 * @throws A new Error if trying to access `PopUpContext` outside the `PopUpProvider`.
 * @throws A new Error if trying to access `PopUpInstanceContext` outside the `PopUpInstanceContext.Provider`.
 * 
 * @returns An object containing the PopUp general React Context and the PopUp single instance React Context.
 */
export const usePopUp = (): UsePopUpReturnType => {

	const context	= useContext( PopUpContext )
	const instance	= useContext( PopUpInstanceContext )

	if ( ! context ) {
		throw new Error(
			'PopUpContext is not defined. `usePopUp` is only available inside the PopUpProvider Component. Please wrap the application within the PopUpProvider Component.'
		)
	}

	const result = {
		/** PopUp general React Context. */
		context,
		/** PopUp single instance React Context. */
		get instance()
		{
			if ( ! instance ) {
				throw new Error(
					'PopUpInstanceContext is not defined. This may be happen if you try to access instance context outside the PopUp.'
				)
			}
			return instance
		},
	}

	return result
}