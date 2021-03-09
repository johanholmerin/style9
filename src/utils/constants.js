/**
 * The MIT License (MIT)
 *
 * Copyright (c) Johan Holmerin.
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 * Copyright (c) Robin Weser
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

// https://github.com/necolas/react-native-web/blob/36dacb2052efdab2a28655773dc76934157d9134/packages/react-native-web/src/modules/unitlessNumbers/index
const UNITLESS_NUMBERS = [
  'animationIterationCount',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'flex',
  'flexGrow',
  'flexOrder',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'fontWeight',
  'gridRowEnd',
  'gridRowSpan',
  'gridRowStart',
  'gridColumnEnd',
  'gridColumnSpan',
  'gridColumnStart',
  'lineClamp',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  'fillOpacity',
  'floodOpacity',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
  'scale',
  'scaleX',
  'scaleY',
  'scaleZ'
];

// https://github.com/robinweser/fela/blob/2c6c50bad8d0bcf704f1727a3dcf67bdf26fbb5c/packages/fela-enforce-longhands/src/index.js
const PROPERTY_PRIORITY = {
  'margin-left': 2,
  'margin-right': 2,
  'margin-top': 2,
  'margin-bottom': 2,
  'padding-left': 2,
  'padding-right': 2,
  'padding-bottom': 2,
  'padding-top': 2,
  'flex-wrap': 2,
  'flex-shrink': 2,
  'flex-basis': 2,
  'background-color': 2,
  'backgound-repeat': 2,
  'background-position': 2,
  'background-image': 2,
  'background-origin': 2,
  'background-clip': 2,
  'background-size': 2,
  'transition-property': 2,
  'transition-timing-function': 2,
  'transition-duration': 2,
  'transition-delay': 2,
  'animation-delay': 2,
  'animation-direction': 2,
  'animation-duration': 2,
  'animation-fill-mode': 2,
  'animation-iteration-count': 2,
  'animation-name': 2,
  'animation-play-state': 2,
  'animation-timing-function': 2,
  'border-width': 2,
  'border-style': 2,
  'border-color': 2,
  'border-top': 2,
  'border-right': 2,
  'border-bottom': 2,
  'border-left': 2,
  'border-top-width': 3,
  'border-top-style': 3,
  'border-top-color': 3,
  'border-right-width': 3,
  'border-right-style': 3,
  'border-right-color': 3,
  'border-bottom-width': 3,
  'border-bottom-style': 3,
  'border-bottom-color': 3,
  'border-left-width': 3,
  'border-left-style': 3,
  'border-left-color': 3,
  'border-bottom-left-radius': 2,
  'border-bottom-right-radius': 2,
  'border-top-left-radius': 2,
  'border-top-right-radius': 2,
  'border-image-outset': 2,
  'border-image-repeat': 2,
  'border-image-slice': 2,
  'border-image-source': 2,
  'border-image-width': 2,
  'column-width': 2,
  'column-count': 2,
  'list-style-image': 2,
  'list-style-position': 2,
  'list-style-type': 2,
  'outline-width': 2,
  'outline-style': 2,
  'outline-color': 2,
  'overflow-x': 2,
  'overflow-y': 2,
  'text-decoration-line': 2,
  'text-decoration-style': 2,
  'text-decoration-color': 2
};

// Defined in Style.d.ts
const COMMA_SEPARATED_LIST_PROPERTIES = [
  'transitionProperty',
  'transitionDuration',
  'transitionTimingFunction',
  'transitionDelay'
];

module.exports = {
  UNITLESS_NUMBERS,
  PROPERTY_PRIORITY,
  COMMA_SEPARATED_LIST_PROPERTIES
};
