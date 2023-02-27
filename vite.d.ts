import { Plugin } from 'vite';
import { FileNameOptions } from './rollup';

export type Style9VitePlguinOptions = Partial<FileNameOptions>;

export default function style9Plugin(options?: Style9VitePlguinOptions): Plugin;
