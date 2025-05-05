import type { TypedMap } from '@alessiofrittoli/web-utils'


export namespace PopUp
{
	/** The PopUp type. */
	export enum Type
	{
		UNKNOWN	= 'unknown',
		TOAST	= 'toast',
		MODAL	= 'modal',
		DRAWER	= 'drawer',
	}


	/** The PopUp.Id. */
	export type Id = string
	/** An object of PopUps indexed by PopUp.Id. */
	export type Map = Record<PopUp.Id, React.ReactNode>
	/** A Map of PopUps indexed by PopUp.Id. */
	export type GroupMap = TypedMap<PopUp.Map>

	/** An object of PopUps indexed by PopUp.Type. */
	export type GroupsMap = Record<PopUp.Type, PopUp.GroupMap>
	/** A Map of PopUps indexed by PopUp.Type. */
	export type TypedGroupsMap = TypedMap<PopUp.GroupsMap>

	export type ComponentProps<P> = { id: PopUp.Id } & P
	export type Component<P> = React.ReactNode | React.ComponentType<P>

	export interface ShowHandlerOptions<U, P extends PopUp.ComponentProps<U> = PopUp.ComponentProps<U>>
	{
		/** The PopUp Component. Could be a `React.ReactNode` or a `React.ComponentType`. */
		PopUp: PopUp.Component<P>
		/** A custom PopUp Id. If none is provided, a random UUID is generated. */
		id?: PopUp.Id
		/** Custom `props` passed to `PopUp` if given `PopUp` is a `React.ComponentType` */
		props?: Omit<P, 'id'>
		/** If set to `true`, other popups will be closed regardless of `PopUp.Type`. Default: `false`. */
		single?: boolean
		/** If set to `true`, other popups with the same `PopUp.Type` will be closed. Default: `false`. */
		singleType?: boolean
		/** The PopUp type. */
		type?: PopUp.Type
	}


	/**
	 * Open PopUp handler.
	 * 
	 * @param options An object defining PopUp options. See {@link ShowHandlerOptions} for more informations.
	 * @returns The opened PopUp.Id.
	 */
	export type OpenHandler = <P>( options: ShowHandlerOptions<P> ) => PopUp.Id
	
	
	/**
	 * Close PopUp handler.
	 * 
	 * If no `popupIdOrType` is given, all active popups will be closed.
	 * 
	 * @param popupIdOrType (Optional) The PopUp.Id or PopUp.Type to close.
	 */
	export type CloseHandler = ( popupId?: PopUp.Id | PopUp.Type ) => void


	/**
	 * Check if a PopUp with the given `id` and eventually with the given `type` is open.
	 * 
	 * @param id	The PopUp.Id to look for.
	 * @param type	(Optional) The PopUp.Type. If given, the PopUp is looked for the given `type` only.
	 */
	export type IsPopUpOpenHandler = ( id: PopUp.Id, type?: PopUp.Type ) => boolean
	

	/**
	 * The PopUp React Context API.
	 * 
	 */
	export interface Ctx
	{
		/** A Map of PopUps indexed by PopUp.Type. */
		groups: PopUp.TypedGroupsMap
		/**
		 * Open PopUp handler.
		 * 
		 * @param options An object defining PopUp options. See {@link ShowHandlerOptions} for more informations.
		 * @returns The opened PopUp.Id.
		 */
		openPopUp: OpenHandler
		/**
		 * Close PopUp handler.
		 * 
		 * If no `popupIdOrType` is given, all active popups will be closed.
		 * 
		 * @param popupIdOrType (Optional) The PopUp.Id or PopUp.Type to close.
		 */
		closePopUp: CloseHandler
		/**
		 * Check if a PopUp with the given `id` and eventually with the given `type` is open.
		 * 
		 * @param id	The PopUp.Id to look for.
		 * @param type	(Optional) The PopUp.Type. If given, the PopUp is looked for the given `type` only.
		 */
		isPopUpOpen: IsPopUpOpenHandler
	}
	

	/**
	 * The PopUp single instance React Context API.
	 * 
	 */
	export interface InstanceCtx
	{
		/** The PopUp Id. */
		popupId: PopUp.Id
		/** Close the current PopUp. */
		closePopUp: () => void
	}
}