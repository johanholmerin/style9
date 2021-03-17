import Style, { StyleProperties } from './Style';

interface StylePropertiesObject {
  [key: string]: StyleProperties;
}

declare function style9(...names: Style[]): string;
declare namespace style9 {
  export function create<T>(
    styles: { [key in keyof T]: Style }
  ): { [key in keyof T]: Style } &
    ((
      ...names: (
        | keyof T
        | boolean
        | undefined
        | null
        | { [key in keyof T]?: boolean | undefined | null }
      )[]
    ) => string);
  export function keyframes(rules: StylePropertiesObject): string;
  export function flush(): string;
}

export default style9;
