import styled from "styled-components";

const NavBarWrapper = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: #232323;
  border-radius: 12px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 48px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  z-index: 20;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 40px;
  cursor: pointer;
  outline: none;

  &.add {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #fff;
    color: #232323;
    font-size: 36px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const NavBar = ({ onAdd, onLeft, onRight }) => (
  <NavBarWrapper>
    <NavButton onClick={onLeft} aria-label="Previous">
      &lt;
    </NavButton>
    <NavButton className="add" onClick={onAdd} aria-label="Add">
      +
    </NavButton>
    <NavButton onClick={onRight} aria-label="Next">
      &gt;
    </NavButton>
  </NavBarWrapper>
);

export default NavBar;
