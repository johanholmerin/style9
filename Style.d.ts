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

type AtRules = '@media' | '@supports';

type Style = StyleProperties &
  {
    [key in SimplePseudos]?: Style;
  } &
  {
    [key in AtRules]?: Record<string, Style>;
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

export interface CustomProperties {}

export interface StyleProperties
  extends StylePropertiesType,
    CustomProperties {}

type StylePropertiesType = {
  [k in keyof StylePropertiesInternal]?:
    | `var(${keyof CustomProperties})`
    | StylePropertiesInternal[k];
};

interface StylePropertiesInternal
  extends ArrayStandardLonghandProperties,
    VendorShorthandProperties<string | number>,
    ExpandedShorthands,
    ExtendedStyleProperties {}

type ScrollSnapType = 'x' | 'y' | 'block' | 'inline' | 'both';
type ScrollSnapAlign = 'none' | 'start' | 'end' | 'center';

interface ExtendedStyleProperties {
  transitionProperty?:
    | StandardLonghandProperties['transitionProperty']
    | keyof StylePropertiesInternal
    | (keyof StylePropertiesInternal)[];
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
  | 'border'
  | 'borderTop'
  | 'borderRight'
  | 'borderBottom'
  | 'borderLeft'
  | 'borderWidth'
  | 'borderStyle'
  | 'borderColor'
  | 'padding'
  | 'margin'
  | 'outline'
  | 'flex'
  // Incorrectly classified as longhand in csstype
  // | 'overscrollBehavior'
>;
