import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import * as _ from 'loadsh';

const YAML_COMMON_CONFIG_FILENAME = 'config.yml';

const filePath = join(__dirname, '../config', YAML_COMMON_CONFIG_FILENAME);

const commonConfig = yaml.load(readFileSync(filePath, 'utf8'));

const envPath = join(
  __dirname,
  '../config',
  `config.${process.env.NODE_ENV || 'development'}.yml`,
);

const envConfig = yaml.load(readFileSync(envPath, 'utf8'));

export default () => {
  return _.merge(commonConfig, envConfig);
};
