import { Plugin } from 'rollup';
import { FilterPattern } from '@rollup/pluginutils';
import { ParserOptions } from '@babel/core';

interface BabelOptions {
  minifyProperties?: boolean;
  incrementalClassnames?: boolean;
}

interface CommonOptions extends BabelOptions {
  include?: FilterPattern;
  exclude?: FilterPattern;
  parserOptions?: ParserOptions;
}

interface FileNameOptions extends CommonOptions {
  fileName: string;
  name?: never;
}

interface NameOptions extends CommonOptions {
  name: string;
  fileName?: never;
}

type RollupOptions = FileNameOptions | NameOptions;

export default function style9Plugin(rollupOptions: RollupOptions): Plugin;
