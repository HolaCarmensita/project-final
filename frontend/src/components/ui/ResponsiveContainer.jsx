import styled from 'styled-components';
import { responsiveContainer } from '../../styles/breakpoints';

// Reusable responsive container component
const ResponsiveContainer = styled.div`
  ${responsiveContainer}
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  height: 100vh;
`;

export default ResponsiveContainer;
