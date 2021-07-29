import styled, { css } from "styled-components";
import { useState } from "react";

import { menu } from "utils/constants";

const Wrapper = styled.div`
  padding-top: 42px;
  > :not(:first-child) {
    margin-top: 24px;
  }
`;

const Title = styled.div`
  padding: 0 12px 16px;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 0.16em;
  color: #9da9bb;
`;

const Item = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-radius: 4px;
  cursor: pointer;
  :hover {
    background: #ebeef4;
  }
  > img {
    filter: invert(33%) sepia(28%) saturate(431%) hue-rotate(173deg)
      brightness(100%) contrast(86%);
    flex: 0 0 20px;
  }
  > div {
    flex: 1 1 auto;
  }
  > :not(:first-child) {
    margin-left: 8px;
  }
  ${(p) =>
    p.active &&
    css`
      background: #ebeef4;
      color: #6848ff;
      > img {
        filter: invert(26%) sepia(72%) saturate(2255%) hue-rotate(237deg)
          brightness(109%) contrast(117%);
      }
    `}
`;

export default function Menu() {
  const [current, setCurrent] = useState("overview");

  return (
    <Wrapper>
      {menu.map((item, index) => (
        <div key={index}>
          {item.name && <Title>{item.name}</Title>}
          {item.items.map((item, index) => (
            <Item
              active={current === item.value}
              onClick={() => setCurrent(item.value)}
            >
              <img src={`/imgs/icons/${item.icon}`} />
              <div>{item.name}</div>
            </Item>
          ))}
        </div>
      ))}
    </Wrapper>
  );
}
