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

export default interface Style extends ViewStyle, TextStyle {}

type BorderStyle = 'solid' | 'dotted' | 'dashed';

interface ViewStyle extends FlexStyle, TransformsStyle, TransitionStyle {
  backfaceVisibility?: 'visible' | 'hidden';
  backgroundColor?: string;
  backgroundClip?: 'border-box' | 'padding-box' | 'content-box';
  borderBottomColor?: string;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderBottomWidth?: number;
  borderColor?: string;
  borderLeftColor?: string;
  borderLeftWidth?: number;
  borderRadius?: number;
  borderRightColor?: string;
  borderRightWidth?: number;
  borderStyle?: 'none' | BorderStyle;
  borderTopColor?: string;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderTopWidth?: number;
  borderWidth?: number;
  boxSizing?: 'content-box' | 'border-box';
  opacity?: number;
  outlineColor?: string;
  outlineOffset?: number | string;
  outlineStyle?: 'none' | BorderStyle;
  outlineWidth?: number;
  clear?: 'none' | 'left' | 'right' | 'both';
  float?: 'none' | 'left' | 'right';
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
  aspectRatio?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
  borderTopWidth?: number;
  borderWidth?: number;
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
  fontSize?: number;
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
  letterSpacing?: number;
  lineHeight?: number;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  textDecorationLine?: 'none' | TextDecorationLine | TextDecorationLine[];
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed';
  textDecorationColor?: string;
  textShadow?: string;
  verticalAlign?: (
    | 'baseline'
    | 'sub'
    | 'super'
    | 'text-top'
    | 'text-bottom'
    | 'middle'
    | 'top'
    | 'bottom'
    | number
  );
}

interface TransitionStyle {
  transitionProperty?: keyof Style;
  transitionDuration?: string;
  transitionTimingFunction?: string;
  transitionDelay?: string;
}
