import { defineConfig } from 'tsup'

export default defineConfig( {
	entry		: [ 'src/index.ts', 'src/client.ts', 'src/types.ts' ],
	format		: [ 'cjs', 'esm' ],
	dts			: true,
	splitting	: true,
	shims		: true,
	skipNodeModulesBundle: true,
	clean		: true,
	minify		: true,
	sourcemap	: true,
} )