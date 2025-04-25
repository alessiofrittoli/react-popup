import { createContext } from 'react'
import type { PopUp } from '@/types'


/**
 * The PopUp React Context API.
 * 
 */
export const PopUpContext	= createContext<PopUp.Ctx | undefined>( undefined )
PopUpContext.displayName	= 'PopUpContext'