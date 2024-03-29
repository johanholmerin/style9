import { Style, StyleProperties, Falsy } from '../Style';

interface StylePropertiesObject {
  [key: string]: StyleProperties;
}

// Copied from ../index.d.ts, with modified Style type
declare function style9(...names: Array<Style | Falsy>): string;
declare namespace style9 {
  function create<T>(
    styles: { [key in keyof T]: Style }
  ): { [key in keyof T]: Style } &
    ((
      ...names: Array<
        keyof T | Falsy | { [key in keyof T]?: boolean | undefined | null }
      >
    ) => string);
  function keyframes(rules: StylePropertiesObject): string;
}

export default style9;
export * from '../Style';
