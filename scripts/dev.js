import minimist from 'minimist'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import esbuild from 'esbuild'
import { createRequire } from 'node:module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

const args = minimist(process.argv.slice(2))
const target = args._[0] || 'reactivity'
const format = args.f || 'iife'

// console.log('run dev', target, format)

const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)
const pkg = require(`../packages/${target}/package.json`)

esbuild
  .context({
    entryPoints: [entry],
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    bundle: true,
    platform: 'browser',
    sourcemap: true,
    format,
    globalName: pkg.buildOptions?.name,
    // watch: {
    //   onRebuild(error) {
    //     if (!error) console.log('rebuild')
    //   },
    // },
  })
  .then(ctx => {
    console.log('start dev')
    ctx.watch()
  })
