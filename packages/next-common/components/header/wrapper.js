import React, { memo } from "react";
import styled from "styled-components";
import useWindowSize from "../../utils/hooks/useWindowSize";
import { useChainSettings } from "../../context/chain";

const Wrapper = styled.header`
  padding-left: 32px;
  padding-right: 32px;
  @media screen and (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
  }
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: ${(props) =>
    props?.theme.isDark
      ? props.theme.neutral
      : props?.background || props.theme.neutral};
  box-shadow: ${(props) => props.theme.shadow100};
  height: 64px;
  border-bottom: 1px solid ${(props) => props.theme.grey200Border};
`;

function HeaderWrapper({ children }) {
  const setting = useChainSettings();
  let ChainWrapper = Wrapper;

  const { width } = useWindowSize();
  if (parseInt(width) <= 768) {
    return <ChainWrapper>{children}</ChainWrapper>;
  }

  return (
    <ChainWrapper background={setting.headerBackgroundColor}>
      {children}
    </ChainWrapper>
  );
}

export default memo(HeaderWrapper);
