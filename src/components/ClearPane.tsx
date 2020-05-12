import * as React from 'react';
import styled from 'styled-components';

const ClearPaneDiv = styled.div`
  background-color: purple;
  opacity: 10%;
  height: 100vh;
  flex-grow: 1;
`;

export default function ClearPane() {
  return <ClearPaneDiv></ClearPaneDiv>;
}
