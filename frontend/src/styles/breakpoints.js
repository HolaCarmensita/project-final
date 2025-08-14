// Responsive breakpoints
const breakpoints = {
  mobile: '768px',
  tablet: '1366px',
  desktop: '1367px',
};

// Media query helpers
export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tabletPortrait: `@media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}) and (orientation: portrait)`,
  tabletLandscape: `@media (min-width: ${breakpoints.mobile}) and (orientation: landscape)`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  tabletAndDesktop: `@media (min-width: ${breakpoints.mobile}) and (orientation: landscape), (min-width: ${breakpoints.desktop})`,
};

// Responsive width values
export const responsiveWidths = {
  mobile: '100vw',
  tabletPortrait: '50vw',
  tabletLandscape: '30vw',
  desktop: '30vw',
};

// Reusable responsive container styles
export const responsiveContainer = `
  width: 100vw;
  
  ${media.mobile} {
    width: ${responsiveWidths.mobile};
  }
  
  ${media.tabletPortrait} {
    width: ${responsiveWidths.tabletPortrait};
  }
  
  ${media.tabletAndDesktop} {
    width: ${responsiveWidths.tabletLandscape};
  }
`;

export default {
  breakpoints,
  media,
  responsiveWidths,
  responsiveContainer,
};
