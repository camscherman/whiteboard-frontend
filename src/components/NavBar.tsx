import * as React from 'react';
import styled from 'styled-components';

const NavbarWrapper = styled.nav`
  background-color: black;
  font-family: 'Avenir Next';
  position: fixed;
  width: 100%;
  height: 2.77778rem;
  font-size: 0.833333rem;
  font-weight: 500;
  color: white;
`;

const NavBarMain = styled.div`
  display: flex;
  margin-right: 25px;
  margin-left: 25px;
  padding: 5px;
  align-items: center;
`;

const NavLeft = styled.div`
  margin-right: auto;
`;

const NavRight = styled.div`
  margin-left: auto;
`;
const NavLink = styled.a`
  margin: 0px 5px 0px 5px;
  color: white;
  text-decoration: none;
  font-size: ${props => (props.className === 'nav-right' ? '1.2rem' : '1.5rem')};
  font-weight: ${props => (props.className === 'nav-right' ? 250 : 500)};
  &:hover {
    color: gray;
    transition-property: color;
    transition-duration: 1s;
  }
`;

export default function NavBar() {
  return (
    <NavbarWrapper>
      <NavBarMain>
        <NavLeft>
          <NavLink>Test 1</NavLink>
          <NavLink>Test 2</NavLink>
        </NavLeft>
        <NavRight>
          <NavLink className={'nav-right'} href={'#'}>
            Test 3
          </NavLink>
          <NavLink className={'nav-right'} href={'#'}>
            Test 4
          </NavLink>
        </NavRight>
      </NavBarMain>
    </NavbarWrapper>
  );
}
