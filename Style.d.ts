import type {
  StandardShorthandProperties,
  StandardLonghandProperties,
  VendorShorthandProperties,
  SimplePseudos
} from 'csstype';

type PropsAsArray<T, K extends keyof T> = T &
  {
    [k in K]: T[K] | T[K][];
  };

type Style = StyleProperties &
  {
    // Mixed keys not possible in TypeScript
    // https://github.com/microsoft/TypeScript/issues/17867
    // [key: string]: Style;
    [key in SimplePseudos]?: Style;
  };

export default Style;

type FilteredStandardLonghandProperties = Omit<
  StandardLonghandProperties<string | number>,
  // Not longhands
  | 'backgroundPosition'
  | 'inset'
  | 'insetBlock'
  | 'insetInline'
  | 'marginBlock'
  | 'marginInline'
  | 'overscrollBehavior'
  | 'paddingBlock'
  | 'paddingInline'
  | 'scrollMargin'
  | 'scrollMarginBlock'
  | 'scrollMarginInline'
  | 'scrollPadding'
  | 'scrollPaddingBlock'
  | 'scrollPaddingInline'
  | 'scrollMargin'
  // Custom definitions
  | keyof ExtendedStyleProperties
>;

type ArrayStandardLonghandProperties = PropsAsArray<
  FilteredStandardLonghandProperties,
  | 'fontVariant'
  | 'textDecorationLine'
  | 'transitionDuration'
  | 'transitionTimingFunction'
  | 'transitionDelay'
>;

export interface StyleProperties
  extends ArrayStandardLonghandProperties,
    VendorShorthandProperties<string | number>,
    ExpandedShorthands,
    ExtendedStyleProperties {}

type ScrollSnapType = 'x' | 'y' | 'block' | 'inline' | 'both';
type ScrollSnapAlign = 'none' | 'start' | 'end' | 'center';

interface ExtendedStyleProperties {
  transitionProperty?:
    | StandardLonghandProperties['transitionProperty']
    | keyof StyleProperties
    | (keyof StyleProperties)[];
  gridAutoFlow?:
    | StandardLonghandProperties['gridAutoFlow']
    | ['row', 'dense']
    | ['column', 'dense'];
  scrollSnapType?:
    | StandardLonghandProperties['scrollSnapType']
    | [ScrollSnapType, ('mandatory' | 'proximity')?];
  scrollSnapAlign?:
    | StandardLonghandProperties['scrollSnapAlign']
    | [ScrollSnapAlign, ScrollSnapAlign?];
}

type ExpandedShorthands = Pick<
  StandardShorthandProperties<string | number>,
  | 'borderColor'
  | 'borderRadius'
  | 'borderStyle'
  | 'borderWidth'
  | 'margin'
  | 'overflow'
  | 'padding'
  // Incorrectly classified as longhand in csstype
  // | 'overscrollBehavior'
>;
