// NOTE: still copy this file from "@osn/common"

// https://tailwindcss.com/docs/responsive-design
// but use `max-width`, means less than xxx

export const SM_SIZE = 768;
export const MD_SIZE = 1024;
export const LG_SIZE = 1280;

/**
 * @param {import("styled-components").ThemedCssFunction} css
 * @description less than 768
 */
export const smcss = (css) => makeResponsive(css, SM_SIZE);

/**
 * @param {import("styled-components").ThemedCssFunction} css
 * @description less than 1024
 */
export const mdcss = (css) => makeResponsive(css, MD_SIZE);

/**
 * @param {import("styled-components").ThemedCssFunction} css
 * @description less than 1280
 */
export const lgcss = (css) => makeResponsive(css, LG_SIZE);

function makeResponsive(css, breakpoint) {
  return `@media (max-width: ${breakpoint}px) {
    ${css}
  }`;
}
