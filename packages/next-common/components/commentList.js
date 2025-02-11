import React from "react";
import styled from "styled-components";
import Pagination from "next-common/components/pagination/index.js";
import { TitleContainer } from "./styled/containers/titleContainer";
import CommentSimple from "./commentSimple.js";
import MaybeEmpty from "./emptyList";
import { pageHomeLayoutMainContentWidth } from "../utils/constants";

const Wrapper = styled.div`
  max-width: ${pageHomeLayoutMainContentWidth}px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
  margin: auto;

  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 768px) {
    margin-left: 16px;
    margin-right: 16px;
  }
`;

export default function CommentList({
  category,
  items,
  pagination,
  create = null,
  summary,
}) {
  return (
    <Wrapper>
      <TitleContainer>
        {category}
        {create}
      </TitleContainer>
      {summary}
      <MaybeEmpty items={items} type={category}>
        {items.map((item, index) => (
          <CommentSimple key={index} data={item} type={category} />
        ))}
      </MaybeEmpty>
      {pagination && <Pagination {...pagination} />}
    </Wrapper>
  );
}
