import config from './esbuild-config';
import ESBuild from 'esbuild';

ESBuild.build(config)
    .catch(console.log)
