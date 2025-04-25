import { createContext } from 'react'
import { getTypedMap } from '@alessiofrittoli/web-utils'
import type { PopUp } from '@/types'


/**
 * The initial PopUp React Context API.
 * 
 */
export const initialPopUpContext: PopUp.Ctx = {
	groups		: getTypedMap<PopUp.GroupsMap>(),
	openPopUp	: () => '',
	closePopUp	: () => {},
}


/**
 * The PopUp React Context API.
 * 
 */
export const PopUpContext	= createContext<PopUp.Ctx>( initialPopUpContext )
PopUpContext.displayName	= 'PopUpContext'