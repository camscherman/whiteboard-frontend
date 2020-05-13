import * as React from 'react';

import styled, { ThemeProvider } from 'styled-components';

export default function VideoCanvas() {
  const Button = styled.button`
    color: 'blue';
  `;
  return (
    <div className="parent-container">
      <Button>Test</Button>
    </div>
  );
}
