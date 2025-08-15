import leftArrowIcon from "../assets/icons/arrow_back.svg";
import rightArrowIcon from "../assets/icons/arrow_forward.svg";
import plusIcon from "../assets/icons/plus_large.svg";
import styled from "styled-components";

const NavBarWrapper = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #232323;
  border-radius: 12px;
  padding: 8px 8px;
  display: flex;
  align-items: center;
  gap: 58px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  z-index: 20;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 32px;
  cursor: pointer;
  outline: none;

  &.add {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #fff;
    color: #232323;
    font-size: 28px;
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
      <img src={leftArrowIcon} alt="Left" style={{ width: 32, height: 32, filter: 'invert(1)' }} />
    </NavButton>
    <NavButton className="add" onClick={onAdd} aria-label="Add">
      <img src={plusIcon} alt="Add" style={{ width: 28, height: 28 }} />
    </NavButton>
    <NavButton onClick={onRight} aria-label="Next">
      <img src={rightArrowIcon} alt="Right" style={{ width: 32, height: 32, filter: 'invert(1)' }} />
    </NavButton>
  </NavBarWrapper>
);

export default NavBar;