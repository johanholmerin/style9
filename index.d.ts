import Style from './Style';

interface Styles {
  [key: string]: Style;
}

declare function style9(...names: Style[]): string;
declare namespace style9 {
  export function create<T extends Styles>(styles: T): T & (
    (...names: (
      | keyof T
      | boolean
      | undefined
      | null
      | { [key in keyof T]?: boolean | undefined | null }
    )[]) => string
  );
}

export default style9;
