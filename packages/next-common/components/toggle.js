import React from "react";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  position: relative;
  cursor: pointer;
  width: 38px;
  height: 22px;
  background: ${(props) => props.theme.grey400Border}; !important;
  border-radius: 16px;
  > div {
    width: 14px;
    height: 14px;
    position: absolute;
    top: 4px;
    left: 4px;
    background: ${(props) => props.theme.neutral}; !important;
    border-radius: 7px;
  }
  ${(p) =>
    p.disabled
      ? css`
          cursor: default;
          background: ${(props) => props.theme.grey100Bg};
          > div {
            left: auto;
            right: 4px;
          }
        `
      : p.active
      ? css`
          background: #6848ff !important;
          > div {
            left: auto;
            right: 4px;
          }
        `
      : null}
  ${(p) =>
    p.size === "small" &&
    css`
      width: 30px;
      height: 18px;
      > div {
        width: 12px;
        height: 12px;
        top: 3px;
        left: 3px;
        border-radius: 6px;
      }
      ${(p) =>
        p.active &&
        css`
          background: #6848ff !important;
          > div {
            left: auto;
            right: 3px;
          }
        `}
    `}
`;

export default function Toggle({ disabled, isOn, onToggle, size }) {
  return (
    <Wrapper
      disabled={disabled}
      active={isOn}
      onClick={() => onToggle(!isOn)}
      size={size}
    >
      <div />
    </Wrapper>
  );
}
