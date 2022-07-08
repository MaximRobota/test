import path from 'path'
import { BuildOptions } from 'esbuild'
import { CleanPlugin } from './plugins/CleanPlugin';
import { HTMLPlugin } from "./plugins/HTMLPlugin";

const mode = process.env.MODE || 'development';
const isDev = mode === 'development';
const isProd = mode === 'production';
const resolveRoot = (...segments: string[]) => path.resolve(__dirname, '..', '..', ...segments);

const config: BuildOptions = {
    allowOverwrite: true,
    bundle: true,
    entryNames: '[dir]/bundle.[name]-[hash]',
    entryPoints: [resolveRoot( 'src', 'index.js')],
    metafile: true,
    minify: isProd,
    outdir: resolveRoot('build'),
    sourcemap: isDev,
    tsconfig: resolveRoot('tsconfig.json'),
    loader: {
        '.png': 'file',
        '.svg': 'file',
        '.jpg': 'file',
    },
    plugins: [
        CleanPlugin,
        HTMLPlugin({})
    ],
}

export default config;

