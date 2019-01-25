import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default [
  // browser-friendly UMD build
  // {
  // 	input: 'src/index.js',
  // 	output: {
  // 		name: 'nodeCovenantSQL',
  // 		file: pkg.browser,
  // 		format: 'umd'
  // 	},
  // 	plugins: [
  // 		resolve(), // so Rollup can find `ms`
  // 		commonjs(), // so Rollup can convert `ms` to an ES module
  // 		json()
  // 	]
  // },
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.ts',
    external: ['fs', 'sqlstring', 'request-promise'],
    watch: {
      include: 'src/**',
    },
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [
      // Allow json resolution
      json(),
      // Compile TypeScript files
      typescript({ useTsconfigDeclarationDir: true }),
      // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
      commonjs(),
      // Allow node_modules resolution, so you can use 'external' to control
      // which external modules to include in the bundle
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
      resolve(),
    ],
  },
]
