import { createContext } from 'react'
import type { PopUp } from '@/types'


/**
 * The initial PopUp single entry Proxied React Context API.
 * 
 */
export const initialPopUpEntryContext: PopUp.EntryCtx = {
	popupId		: '',
	closePopUp	: () => {},
}

/**
 * The PopUp single entry Proxied React Context API.
 * 
 */
export const PopUpEntryContext	= createContext<PopUp.EntryCtx>( initialPopUpEntryContext )
PopUpEntryContext.displayName	= 'PopUpEntryContext'