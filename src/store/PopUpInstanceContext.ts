import { createContext } from 'react'
import type { PopUp } from '@/types'


/**
 * The initial PopUp single instance React Context API.
 * 
 */
export const initialPopUpInstanceContext: PopUp.InstanceCtx = {
	popupId		: '',
	closePopUp	: () => {},
}

/**
 * The PopUp single instance React Context API.
 * 
 */
export const PopUpInstanceContext	= createContext<PopUp.InstanceCtx>( initialPopUpInstanceContext )
PopUpInstanceContext.displayName	= 'PopUpInstanceContext'