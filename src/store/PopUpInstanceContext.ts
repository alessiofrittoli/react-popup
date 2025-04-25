import { createContext } from 'react'
import type { PopUp } from '@/types'


/**
 * The PopUp single instance React Context API.
 * 
 */
export const PopUpInstanceContext	= createContext<PopUp.InstanceCtx | undefined>( undefined )
PopUpInstanceContext.displayName	= 'PopUpInstanceContext'