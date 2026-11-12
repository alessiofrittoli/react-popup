/// <reference types='vitest/config' />

import { viteConfig } from '@alessiofrittoli/package-configs/vite'

console.log(
	`
_____________________________________________________________________
        ____                  __     ____              __  __
       / __ \\___  ____ ______/ /_   / __ \\____  ____  / / / /___
      / /_/ / _ \\/ __ \\\`/___/ __/  / /_/ / __ \\/ __ \\/ / / / __ \\
     / _, _/  __/ /_/ / /__/ /_   / ____/ /_/ / /_/ / /_/ / /_/ /
    /_/ |_|\\___/\\__,_/\\___/\\__/  /_/    \\____/ .___/\\____/ .___/
                                            /_/         /_/   
_____________________________________________________________________
`,
)

export default viteConfig({
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: 'jsdom',
					environment: 'jsdom',
					include: ['__tests__/**/*.test.(ts|tsx)'],
					setupFiles: ['__tests__/jsdom-setup.ts'],
				},
			},
		],
	},
})
