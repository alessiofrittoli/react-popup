'use client'

import { Fragment } from 'react'
import { usePopUp } from '@/lib/usePopUp'


/**
 * Render all active popups.
 * 
 * ⚠️ If using `framer-motion` and Motion Components this will break `exit` animations.
 * In order to let exit animation work properly, you need to
 * manually iterate through the `PopUp.Ctx.groups` Map entries and wrap the result with `<AnimatePresence />` Component.
 */
export const PopUpRenderer: React.FC = () => (
	Array.from( usePopUp().context.groups.entries() ).map( ( [, group ] ) => (
		Array.from( group.entries() ).map( ( [ id, popup ] ) => (
			<Fragment key={ id }>{ popup }</Fragment>
		) )
	) )
)