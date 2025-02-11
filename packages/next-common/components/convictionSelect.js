import styled, { css } from "styled-components";
import React, { useState, useRef } from "react";

import useOnClickOutside from "next-common/utils/hooks/useOnClickOutside.js";
import Caret from "next-common/components/icons/caret";

const Wrapper = styled.div`
  position: relative;
  font-size: 14px;
  line-height: 100%;
`;

const Selector = styled.div`
  padding: 11px 15px;
  display: flex;
  align-items: center;
  border: 1px solid ${(p) => p.theme.grey300Border};
  border-radius: 4px;
  cursor: pointer;
  > div {
    flex-grow: 1;
  }
  ${(p) =>
    p.active &&
    css`
      border: 1px solid ${(props) => props.theme.grey400Border};
    `}
  ${(p) =>
    p.disabled &&
    css`
      background: ${(props) => props.theme.grey100Bg};
      pointer-events: none;
    `}
`;

const Options = styled.div`
  position: absolute;
  padding: 8px 0;
  background: ${(props) => props.theme.neutral};
  box-shadow: ${(props) => props.theme.shadow200};
  border-radius: 4px;
  left: 0;
  margin-top: 4px;
  width: 100%;
  z-index: 1;
`;

const Item = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  :hover {
    background: ${(props) => props.theme.grey100Bg};
  }
  ${(p) =>
    p.active &&
    css`
      background: ${(props) => props.theme.grey100Bg};
    `}
`;

const DEFAULT_OPTIONS = [
  {
    text: "0.1x, no lockup period",
    value: 0,
  },
  {
    text: "1x, locked for 1 enactment period(s)",
    value: 1,
  },
  {
    text: "2x, locked for 2 enactment period(s)",
    value: 2,
  },
  {
    text: "3x, locked for 4 enactment period(s)",
    value: 3,
  },
  {
    text: "4x, locked for 8 enactment period(s)",
    value: 4,
  },
  {
    text: "5x, locked for 16 enactment period(s)",
    value: 5,
  },
  {
    text: "6x, locked for 32 enactment period(s)",
    value: 6,
  },
];

export default function ConvictionSelect({
  value,
  setValue,
  options,
  disabled,
}) {
  const [show, setShow] = useState(false);
  const ref = useRef();

  useOnClickOutside(ref, () => setShow(false));

  return (
    <Wrapper ref={ref}>
      <Selector
        active={show}
        disabled={disabled}
        onClick={() => setShow(!show)}
      >
        <div>
          {
            (options || DEFAULT_OPTIONS).find((item) => item.value === value)
              ?.text
          }
        </div>
        <Caret down={!show} />
      </Selector>
      {show && !disabled && (
        <Options>
          {(options || DEFAULT_OPTIONS).map((item, index) => (
            <Item
              key={index}
              active={item.value === value}
              onClick={() => {
                setValue(item.value);
                setShow(false);
              }}
            >
              {item.text}
            </Item>
          ))}
        </Options>
      )}
    </Wrapper>
  );
}
