/**
 * The MIT License (MIT)
 *
 * Copyright (c) Eloy Durán <https://github.com/alloy>
 * Copyright (c) HuHuanming <https://github.com/huhuanming>
 * Copyright (c) Kyle Roach <https://github.com/iRoachie>
 * Copyright (c) Simon Knott <https://github.com/skn0tt>
 * Copyright (c) Tim Wang <https://github.com/timwangdev>
 * Copyright (c) Kamal Mahyuddin <https://github.com/kamal>
 * Copyright (c) Alex Dunne <https://github.com/alexdunne>
 * Copyright (c) Manuel Alabor <https://github.com/swissmanu>
 * Copyright (c) Michele Bombardi <https://github.com/bm-software>
 * Copyright (c) Alexander T. <https://github.com/a-tarasyuk>
 * Copyright (c) Martin van Dam <https://github.com/mvdam>
 * Copyright (c) Kacper Wiszczuk <https://github.com/esemesek>
 * Copyright (c) Ryan Nickel <https://github.com/mrnickel>
 * Copyright (c) Souvik Ghosh <https://github.com/souvik-ghosh>
 * Copyright (c) Cheng Gibson <https://github.com/nossbigg>
 * Copyright (c) Saransh Kataria <https://github.com/saranshkataria>
 * Copyright (c) Francesco Moro <https://github.com/franzmoro>
 * Copyright (c) Wojciech Tyczynski <https://github.com/tykus160>
 * Copyright (c) Jake Bloom <https://github.com/jakebloom>
 * Copyright (c) Ceyhun Ozugur <https://github.com/ceyhun>
 * Copyright (c) Mike Martin <https://github.com/mcmar>
 * Copyright (c) Theo Henry de Villeneuve <https://github.com/theohdv>
 * Copyright (c) Eli White <https://github.com/TheSavior>
 * Copyright (c) Romain Faust <https://github.com/romain-faust>
 * Copyright (c) Be Birchall <https://github.com/bebebebebe>
 * Copyright (c) Jesse Katsumata <https://github.com/Naturalclar>
 * Copyright (c) Xianming Zhong <https://github.com/chinesedfan>
 * Copyright (c) Valentyn Tolochko <https://github.com/vtolochk>
 * Copyright (c) Sergey Sychev <https://github.com/SychevSP>
 * Copyright (c) Kelvin Chu <https://github.com/RageBill>
 * Copyright (c) Daiki Ihara <https://github.com/sasurau4>
 * Copyright (c) Johan Holmerin <https://github.com/johanholmerin>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

type PseudoElements = (
  | '::before'
  | '::after'
  | '::first-letter'
  | '::first-line'
  | '::-webkit-input-placeholder'
  | '::-webkit-scrollbar'
  | '::-ms-clear'
  | '::-webkit-search-cancel-button'
  | '::-webkit-search-results-button'
  | '::-webkit-search-results-decoration'
  | '::-webkit-search-decoration'
  | '::-webkit-inner-spin-button'
  | '::-webkit-outer-spin-button'
);

type PseudoClasses = (
  | ':focus-within'
  | ':first-child'
  | ':last-child'
  | ':odd-child'
  | ':even-child'
  | ':hover'
  | ':focus'
  | ':active'
  | ':visited'
  | ':disabled'
);

type Style = StyleProperties & {
  // Mixed keys not possible in TypeScript
  // https://github.com/microsoft/TypeScript/issues/17867
  // [key: string]: Style;
  [key in PseudoClasses | PseudoElements]?: Style;
};

export default Style;

export interface StyleProperties extends ViewStyle, TextStyle {}

type BorderStyle = 'solid' | 'dotted' | 'dashed';

type Appearance = (
  | 'none'
  | 'auto'
  | 'button'
  | 'textfield'
  | 'searchfield'
  | 'textarea'
  | 'push-button'
  | 'button-bevel'
  | 'slider-horizontal'
  | 'checkbox'
  | 'radio'
  | 'square-button'
  | 'menulist'
  | 'menulist-button'
  | 'listbox'
  | 'meter'
  | 'progress-bar'
);

type Cursor = (
  // global
  | 'inherit'
  | 'initial'
  | 'unset'
  // keyword
  | 'alias'
  | 'all-scroll'
  | 'auto'
  | 'cell'
  | 'col-resize'
  | 'context-menu'
  | 'copy'
  | 'crosshair'
  | 'default'
  | 'e-resize'
  | 'grab'
  | 'grabbing'
  | 'help'
  | 'move'
  | 'n-resize'
  | 'ne-resize'
  | 'nesw-resize'
  | 'no-drop'
  | 'none'
  | 'not-allowed'
  | 'nw-resize'
  | 'nwse-resize'
  | 'pointer'
  | 'progress'
  | 'row-resize'
  | 's-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'text'
  | 'vertical-text'
  | 'w-resize'
  | 'wait'
  | 'zoom-in'
  | 'zoom-out'
);

interface ViewStyle extends
  FlexStyle,
  TransformsStyle,
  TransitionStyle,
  AnimationStyle,
  SnapStyle,
  SvgStyle
{
  backfaceVisibility?: 'visible' | 'hidden';
  backgroundColor?: string;
  backgroundClip?: 'border-box' | 'padding-box' | 'content-box';
  borderBottomColor?: string;
  borderBottomLeftRadius?: number | string;
  borderBottomRightRadius?: number | string;
  borderBottomWidth?: number | string;
  borderColor?: string;
  borderLeftColor?: string;
  borderLeftWidth?: number | string;
  borderRadius?: number | string;
  borderRightColor?: string;
  borderRightWidth?: number | string;
  borderStyle?: 'none' | BorderStyle;
  borderTopStyle?: 'none' | BorderStyle;
  borderRightStyle?: 'none' | BorderStyle;
  borderBottomStyle?: 'none' | BorderStyle;
  borderLeftStyle?: 'none' | BorderStyle;
  borderTopColor?: string;
  borderTopLeftRadius?: number | string;
  borderTopRightRadius?: number | string;
  borderTopWidth?: number | string;
  borderWidth?: number | string;
  boxSizing?: 'content-box' | 'border-box';
  boxShadow?: string;
  opacity?: number | string;
  outlineColor?: string;
  outlineOffset?: number | string;
  outlineStyle?: 'none' | BorderStyle;
  outlineWidth?: number | string;
  clear?: 'none' | 'left' | 'right' | 'both';
  float?: 'none' | 'left' | 'right';
  appearance?: Appearance;
  filter?: string;
  WebkitTouchHighlightColor?: string;
  pointerEvents?: 'none' | 'auto';
  columnWidth?: number | string;
  columnCount?: number | 'auto';
  content?: string;
  cursor?: Cursor
}

type FlexAlignType = (
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'stretch'
  | 'baseline'
);

type DisplayOutside = 'block' | 'inline';
type DisplayInside = 'flow-root' | 'table' | 'flex' | 'grid';
type DisplayInternal = (
  | 'table-row-group'
  | 'table-header-group'
  | 'table-footer-group'
  | 'table-row'
  | 'table-cell'
  | 'table-column-group'
  | 'table-column'
  | 'table-caption'
);
type DisplayBox = 'contents' | 'none';
type DisplayLegacy = (
  | 'inline-block'
  | 'inline-table'
  | 'inline-flex'
  | 'inline-grid'
);

interface FlexStyle {
  alignContent?: (
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'stretch'
    | 'space-between'
    | 'space-around'
  );
  alignItems?: FlexAlignType;
  alignSelf?: 'auto' | FlexAlignType;
  aspectRatio?: number | 'auto';
  bottom?: number | string;
  display?: (
    | DisplayOutside
    | DisplayInside
    | DisplayInternal
    | DisplayBox
    | DisplayLegacy
  );
  flexBasis?: number | string;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexGrow?: number;
  flexShrink?: number;
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  height?: number | string;
  justifyContent?: (
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  );
  left?: number | string;
  margin?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;
  marginTop?: number | string;
  maxHeight?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;
  overflow?: 'visible' | 'hidden' | 'scroll';
  padding?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  paddingRight?: number | string;
  paddingTop?: number | string;
  position?: 'static' | 'absolute' | 'relative' | 'fixed' | 'sticky';
  right?: number | string;
  top?: number | string;
  width?: number | string;
  zIndex?: number;
  direction?: 'inherit' | 'ltr' | 'rtl';
  gridAutoColumns?: string;
  gridAutoFlow?: (
    | 'row'
    | 'column'
    | 'dense'
    | ['row', 'dense']
    | ['column', 'dense']
  );
  gridAutoRows?: string;
  gridColumnEnd?: string;
  gridColumnGap?: string;
  gridColumnStart?: string;
  gridRowEnd?: string;
  gridRowGap?: string;
  gridRowStart?: string;
  gridTemplateAreas?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
}

export interface TransformsStyle {
  transform?: string;
}

type FontVariant = (
  | 'small-caps'
  | 'oldstyle-nums'
  | 'lining-nums'
  | 'tabular-nums'
  | 'proportional-nums'
);

type TextDecorationLine = 'underline' | 'line-through' | 'overline';

interface TextStyle {
  color?: string;
  fontFamily?: string;
  fontSize?: number | string;
  fontStyle?: 'normal' | 'italic';
  fontVariant?: FontVariant[];
  fontWeight?: (
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
  );
  letterSpacing?: number | string;
  lineHeight?: number | string;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  textAlignLast?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  textDecorationLine?: 'none' | TextDecorationLine | TextDecorationLine[];
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed';
  textDecorationColor?: string;
  textOverflow?: 'clip' | 'ellipsis' | 'initial' | 'inherit';
  textShadow?: string;
  verticalAlign?: number | string;
  WebkitFontSmoothing?: (
    | 'none'
    | 'auto'
    | 'antialiased'
    | 'subpixel-antialiased'
  );
  MozOsxFontSmoothing?: 'auto' | 'grayscale';
  textRendering?: (
    | 'auto'
    | 'optimizeSpeed'
    | 'optimizeLegibility'
    | 'geometricPrecision'
  );
  visibility?: 'visible' | 'hidden' | 'collapse';
  whiteSpace?: (
    | 'normal'
    | 'pre'
    | 'nowrap'
    | 'pre-wrap'
    | 'pre-line'
    | 'break-spaces'
  );
  lineBreak?: 'auto' | 'loose' | 'normal' | 'strict' | 'anywhere';
  overflowWrap?: 'normal' | 'break-word' | 'anywhere';
  tabSize?: number | string;
  textIndent?: number | string | 'inherit';
  textJustify?: 'none' | 'auto' | 'inter-character' | 'inter-word';
  textTransform?: (
    | 'none'
    | 'capitalize'
    | 'uppercase'
    | 'lowercase'
    | 'full-width'
    | 'full-size-kana'
  );
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
  wordSpacing?: 'normal' | number | string;
}

interface TransitionStyle {
  transitionProperty?: keyof StyleProperties | (keyof StyleProperties)[];
  transitionDuration?: string | string[];
  transitionTimingFunction?: string | string[];
  transitionDelay?: string | string[];
}

interface AnimationStyle {
  animationName?: string;
  animationDuration?: string;
  animationTimingFunction?: string;
  animationDelay?: string;
  animationDirection?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  animationIterationCount?: 'infinite' | number;
  animationFillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  animationPlayState?: 'running' | 'paused';
}

type ScrollSnapType = 'none' | 'x' | 'y' | 'block' | 'inline' | 'both';

type ScrollSnapAlign = 'none' | 'start' | 'end' | 'center';

interface SnapStyle {
  scrollSnapType?: (
    | ScrollSnapType
    | [ScrollSnapType, ('mandatory' | 'proximity')?]
  );
  scrollSnapStop?: 'normal' | 'always';
  scrollPaddingTop?: number | string;
  scrollPaddingRight?: number | string;
  scrollPaddingBottom?: number | string;
  scrollPaddingLeft?: number | string;
  scrollMarginTop?: number | string;
  scrollMarginRight?: number | string;
  scrollMarginBottom?: number | string;
  scrollMarginLeft?: number | string;
  scrollSnapAlign?: ScrollSnapAlign | [ScrollSnapAlign, ScrollSnapAlign];
}

interface SvgStyle {
  alignmentBaseline?: (
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
    | 'mathematical'
  );
  baselineShift?: number | string;
  color?: string;
  colorInterpolation?: 'auto' | 'sRGB' | 'linearRGB';
  colorRendering?: 'auto' | 'optimizeSpeed' | 'optimizeQuality';
  cursor?: Cursor;
  dominantBaseline?: (
    | 'auto'
    | 'text-bottom'
    | 'alphabetic'
    | 'ideographic'
    | 'middle'
    | 'central'
    | 'mathematical'
    | 'hanging'
    | 'text-top'
  );
  fill?: string;
  fillOpacity?: string;
  fillRule?: 'nonzero' | 'evenodd';
  imageRendering?: 'auto' | 'optimizeSpeed' | 'optimizeQuality';
  shapeRendering?: (
    | 'auto'
    | 'optimizeSpeed'
    | 'crispEdges'
    | 'geometricPrecision'
  );
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
