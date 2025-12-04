import { defineConfig } from 'tsup'

const enableSourcemap = process.env.NODE_ENV !== 'production'

export default defineConfig( {
	entry		: [ 'src/**/*.(ts|tsx)' ],
	format		: [ 'esm' ],
	dts			: true,
	splitting	: true,
	shims		: true,
	skipNodeModulesBundle: true,
	clean		: true,
	minify		: true,
	sourcemap	: enableSourcemap,
} )