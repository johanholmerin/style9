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
  strokeDasharray?: number | string | (number | string)[];
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
