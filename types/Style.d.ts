import type {
  StandardShorthandProperties,
  StandardLonghandProperties,
  VendorShorthandProperties,
  SimplePseudos
} from 'csstype';

export type AtRules = '@media' | '@supports';

export type Falsy = false | null | undefined;

export type Style<Extra = {}> = StyleProperties &
  {
    [key in SimplePseudos]?: Style<Extra>;
  } &
  {
    [key in AtRules]?: Record<string, Style<Extra>>;
  } &
  Extra;

export {};

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

interface ArrayProperties {
  fontVariant?:
    | FilteredStandardLonghandProperties['fontVariant']
    | Array<FilteredStandardLonghandProperties['fontVariant']>;
  textDecorationLine?:
    | FilteredStandardLonghandProperties['textDecorationLine']
    | Array<FilteredStandardLonghandProperties['textDecorationLine']>;
  transitionDuration?:
    | FilteredStandardLonghandProperties['transitionDuration']
    | Array<FilteredStandardLonghandProperties['transitionDuration']>;
  transitionTimingFunction?:
    | FilteredStandardLonghandProperties['transitionTimingFunction']
    | Array<FilteredStandardLonghandProperties['transitionTimingFunction']>;
  transitionDelay?:
    | FilteredStandardLonghandProperties['transitionDelay']
    | Array<FilteredStandardLonghandProperties['transitionDelay']>;
}

interface ArrayStandardLonghandProperties
  extends Omit<FilteredStandardLonghandProperties, keyof ArrayProperties>,
    ArrayProperties {}

interface SvgProperties {
  alignmentBaseline?:
    | 'auto'
    | 'baseline'
    | 'before-edge'
    | 'text-before-edge'
    | 'middle'
    | 'central'
    | 'after-edge'
    | 'text-after-edge'
    | 'ideographic'
    | 'alphabetic'
    | 'hanging'
    | 'mathematical';
  baselineShift?: number | string;
  color?: string;
  colorInterpolation?: 'auto' | 'sRGB' | 'linearRGB';
  colorRendering?: 'auto' | 'optimizeSpeed' | 'optimizeQuality';
  dominantBaseline?:
    | 'auto'
    | 'text-bottom'
    | 'alphabetic'
    | 'ideographic'
    | 'middle'
    | 'central'
    | 'mathematical'
    | 'hanging'
    | 'text-top';
  fill?: string;
  fillOpacity?: string;
  fillRule?: 'nonzero' | 'evenodd';
  imageRendering?: 'auto' | 'optimizeSpeed' | 'optimizeQuality';
  shapeRendering?:
    | 'auto'
    | 'optimizeSpeed'
    | 'crispEdges'
    | 'geometricPrecision';
  stopColor?: string;
  stopOpacity?: number;
  stroke?: string;
  strokeDasharray?: number | string | Array<number | string>;
  strokeDashoffset?: number | string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  strokeMiterlimit?: number;
  strokeOpacity?: number | string;
  strokeWidth?: number | string;
  textAnchor?: 'start' | 'middle' | 'end';
  vectorEffect?: 'none' | 'non-scaling-stroke';
  writingMode?: 'lr-tb' | 'rl-tb' | 'tb-rl' | 'lr' | 'rl' | 'tb';
}

export interface CustomProperties {}

export interface StyleProperties
  extends StylePropertiesType,
    Partial<CustomProperties> {}

type StylePropertiesType = {
  [k in keyof StylePropertiesInternal]?:
    | `var(${keyof CustomProperties})`
    | StylePropertiesInternal[k];
};

interface StylePropertiesInternal
  extends ArrayStandardLonghandProperties,
    VendorShorthandProperties<string | number>,
    ExpandedShorthands,
    ExtendedStyleProperties,
    Omit<SvgProperties, keyof ArrayStandardLonghandProperties> {}

type ScrollSnapType = 'x' | 'y' | 'block' | 'inline' | 'both';
type ScrollSnapAlign = 'none' | 'start' | 'end' | 'center';

interface ExtendedStyleProperties {
  transitionProperty?:
    | StandardLonghandProperties['transitionProperty']
    | keyof StylePropertiesInternal
    | Array<keyof StylePropertiesInternal>;
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
  | 'borderRadius'
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
  | 'textDecoration'
  | 'overflow'
  // Incorrectly classified as longhand in csstype
  // | 'overscrollBehavior'
>;
