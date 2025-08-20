import common from './common';
import local from './local';
import dev from './dev';
import prod from './prod';
import * as yaml from 'js-yaml';
import {readFileSync} from 'fs';

const phase = process.env.NODE_ENV;

let conf = {};
if(phase === 'local'){
    conf = local;
} else if(phase === 'dev'){
    conf = dev;
} else if(phase === 'prod'){
    conf = prod;
}

const yamlConfig = yaml.load(
    readFileSync(`${process.cwd()}/src/envs/config.yaml`, 'utf-8')
) as Record<string, any>;

export default () => ({
    ...common,
    ...conf,
    ...yamlConfig,
});