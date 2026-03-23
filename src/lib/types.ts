import type { TypedMap } from '@alessiofrittoli/web-utils'


export namespace PopUp
{
	/**
	 * The PopUp type.
	 * 
	 */
	export const Type = {
		UNKNOWN	: 'unknown',
		TOAST	: 'toast',
		MODAL	: 'modal',
		DRAWER	: 'drawer',
	} as const


	/**
	 * The PopUp type.
	 * 
	 */
	export type Type = typeof PopUp.Type[ keyof typeof PopUp.Type ]


	/**
	 * The PopUp.Id.
	 * 
	 */
	export type Id = string


	/**
	 * An object of PopUps indexed by PopUp.Id.
	 * 
	 */
	export type Map = Record<PopUp.Id, React.ReactNode>


	/**
	 * A Map of PopUps indexed by PopUp.Id.
	 * 
	 */
	export type GroupMap = TypedMap<PopUp.Map>


	/**
	 * An object of PopUps indexed by PopUp.Type.
	 * 
	 * @template T Custom definition for PopUp type names.
	 */
	export type GroupsMap<T extends string = PopUp.Type> = Record<T, PopUp.GroupMap>


	/**
	 * A Map of PopUps indexed by PopUp.Type.
	 * 
	 * @template T Custom definition for PopUp type names.
	 */
	export type TypedGroupsMap<T extends string = PopUp.Type> = TypedMap<PopUp.GroupsMap<T>>

	
	/**
	 * PopUp Component Props.
	 * 
	 * @template P User defined Component Props.
	 */
	export type ComponentProps<P = unknown> = { id: PopUp.Id } & P


	/**
	 * PopUp Component Props.
	 * 
	 * @template P User defined Component Props.
	 */
	export type Component<P> = React.ReactNode | React.ComponentType<P>


	/**
	 * Represents options for opening a PopUp.
	 * 
	 * @template U User defined Component Props.
	 * @template T Custom definition for PopUp type names.
	 * @template P User defined Component Props + PopUp.ComponentProps.
	 */
	export interface OpenHandlerOptions<U, T extends string = PopUp.Type, P extends PopUp.ComponentProps<U> = PopUp.ComponentProps<U>>
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
		type?: T
	}


	/**
	 * Open PopUp handler.
	 * 
	 * @template T Custom definition for PopUp type names.
	 * @template P User defined Component Props.
	 * 
	 * @param options An object defining PopUp options. See {@link OpenHandlerOptions} for more informations.
	 * @returns The opened PopUp.Id.
	 */
	export type OpenHandler<T extends string = PopUp.Type> = <P>( options: OpenHandlerOptions<P, T> ) => PopUp.Id
	
	
	/**
	 * Close PopUp handler.
	 * 
	 * If no `popupIdOrType` is given, all active popups will be closed.
	 * 
	 * @template T Custom definition for PopUp type names.
	 * 
	 * @param popupIdOrType (Optional) The PopUp.Id or PopUp.Type to close.
	 */
	export type CloseHandler<T extends string = PopUp.Type> = ( popupId?: PopUp.Id | T ) => void


	/**
	 * Check if a PopUp with the given `id` and eventually with the given `type` is open.
	 * 
	 * @param id	The PopUp.Id to look for.
	 * @param type	(Optional) The PopUp.Type. If given, the PopUp is looked for the given `type` only.
	 * 
	 * @template T Custom definition for PopUp type names.
	 * 
	 * @returns `true` if PopUp is opened, `false` if not or no PopUp has been found matching the given criteria.
	 */
	export type IsPopUpOpenHandler<T extends string = PopUp.Type> = ( id: PopUp.Id, type?: T ) => boolean
	

	/**
	 * The PopUp React Context API.
	 * 
	 * @template T Custom definition for PopUp type names.
	 */
	export interface Ctx<T extends string = PopUp.Type>
	{
		/**
		 * A Map of PopUps indexed by PopUp.Type.
		 * 
		 */
		groups: PopUp.TypedGroupsMap<T>
		/**
		 * Open PopUp handler.
		 * 
		 * @template T Custom definition for PopUp type names.
		 * @template P User defined Component Props.
		 * 
		 * @param options An object defining PopUp options. See {@link OpenHandlerOptions} for more informations.
		 * @returns The opened PopUp.Id.
		 */
		openPopUp: OpenHandler<T>
		/**
		 * Close PopUp handler.
		 * 
		 * If no `popupIdOrType` is given, all active popups will be closed.
		 * 
		 * @template T Custom definition for PopUp type names.
		 * 
		 * @param popupIdOrType (Optional) The PopUp.Id or PopUp.Type to close.
		 */
		closePopUp: CloseHandler<T>
		/**
		 * Check if a PopUp with the given `id` and eventually with the given `type` is open.
		 * 
		 * @param id	The PopUp.Id to look for.
		 * @param type	(Optional) The PopUp.Type. If given, the PopUp is looked for the given `type` only.
		 * 
		 * @template T Custom definition for PopUp type names.
		 * 
		 * @returns `true` if PopUp is opened, `false` if not or no PopUp has been found matching the given criteria.
		 */
		isPopUpOpen: IsPopUpOpenHandler<T>
	}


	export interface ProviderProps
	{
		/**
		 * Custom PopUp types.
		 * 
		 */
		types?: Record<string, string>
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