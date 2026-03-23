import { PopUp } from '@/lib/types'

/**
 * Check if the given `value` is a {@link PopUp.Type} or not.
 * 
 * @param value The value to check.
 * @returns `true` if the given `value` is a {@link PopUp.Type}, `false` otherwise.
 */
export const checkIsPopUpType = <T extends string = PopUp.Type>( value: PopUp.Id | T, types: Record<string, string> = PopUp.Type ): value is T => (
	Object.values( types ).includes( value )
)


/**
 * Check if there is a PopUp inside the given `groups` map matching the given `id` and `type`.
 * 
 * @param	groups	A Map of PopUps indexed by PopUp.Type.
 * @param	id		The PopUp.Id to check inside PopUp groups.
 * @param	type	(Optional) The PopUp.Type where to look in for.
 * 
 * @returns `true` if there is some PopUp in the given `groups`, `false` otherwise.
 */
export const checkIsPopUpOpen = <T extends string = PopUp.Type>( groups: PopUp.TypedGroupsMap, id: PopUp.Id, type?: T ) => (
	(
		! type
			? Array.from( groups.entries() )
			: Array.from( groups.entries() ).filter( ( [ popUpType ] ) => type === popUpType )
	).some( ( [, group ] ) => (
		!! Array.from( group.entries() )
			.find( ( [ popUpId ] ) => id === popUpId )
	) )
)