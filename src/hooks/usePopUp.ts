import { useContext } from 'react'
import { PopUpContext} from '@/store/PopUpContext'
import { PopUpInstanceContext } from '@/store/PopUpInstanceContext'


/**
 * Access PopUp React Context API.
 * 
 * @returns An object containing the PopUp general React Context and the PopUp single instance React Context.
 */
export const usePopUp = () => ( {
	/** PopUp general React Context. */
	context: useContext( PopUpContext ),
	/** PopUp single instance React Context. */
	instance: useContext( PopUpInstanceContext ),
} )