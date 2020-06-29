import * as React from 'react';
import styled from 'styled-components';

const VerticalClearPaneDiv = styled.div`
  width: 100vw;
  flex-grow: 1;
`;
export default function VerticalClearPane() {
  return <VerticalClearPaneDiv />;
}
