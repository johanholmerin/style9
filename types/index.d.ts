// Minimum TypeScript Version: 4.1
import { Style, StyleProperties, AtRules, Falsy } from './Style';

type AtRulesKey = `${AtRules}${string}`;

interface AtRulesProperties {
  [key: AtRulesKey]: StyleWithAtRules;
}

interface StylePropertiesObject {
  [key: string]: StyleProperties;
}

type StyleWithAtRules = Style<AtRulesProperties>;

// Should be kept in sync with ./4.3/index.d.ts
declare function style9(...names: Array<StyleWithAtRules | Falsy>): string;
declare namespace style9 {
  function create<T>(
    styles: { [key in keyof T]: StyleWithAtRules }
  ): { [key in keyof T]: StyleWithAtRules } &
    ((
      ...names: Array<
        keyof T | Falsy | { [key in keyof T]?: boolean | undefined | null }
      >
    ) => string);
  function keyframes(rules: StylePropertiesObject): string;
}

export default style9;
export * from './Style';
