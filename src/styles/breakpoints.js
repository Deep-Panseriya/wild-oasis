// Breakpoint sizes in pixels
export const breakpoints = {
  xs: '320px',   // Extra small devices (phones)
  sm: '576px',   // Small devices (large phones, portrait tablets)
  md: '768px',   // Medium devices (tablets)
  lg: '992px',   // Large devices (laptops/desktops)
  xl: '1200px',  // Extra large devices (large laptops and desktops)
  xxl: '1400px', // Extra extra large devices (large desktops)
};

// Media Query strings for use in styled-components
export const deviceQueries = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  xxl: `(min-width: ${breakpoints.xxl})`,
};

// Media Query helper for styled-components
export const device = {
  xs: `@media ${deviceQueries.xs}`,
  sm: `@media ${deviceQueries.sm}`,
  md: `@media ${deviceQueries.md}`,
  lg: `@media ${deviceQueries.lg}`,
  xl: `@media ${deviceQueries.xl}`,
  xxl: `@media ${deviceQueries.xxl}`,
};

// Example usage:
/*
import { device } from '../styles/breakpoints';
import styled from 'styled-components';

const ResponsiveComponent = styled.div`
  font-size: 16px;
  padding: 1rem;

  ${device.sm} {
    font-size: 18px;
    padding: 1.5rem;
  }

  ${device.md} {
    font-size: 20px;
    padding: 2rem;
  }

  ${device.lg} {
    font-size: 22px;
    padding: 2.5rem;
  }
`;
*/ 