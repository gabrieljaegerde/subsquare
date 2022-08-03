import Row from "next-common/components/listInfo/row";
import Anchor from "next-common/components/styled/anchor";
import { toPrecision } from "next-common/utils";
import Tag from "next-common/components/tags/state/tag";
import Accordion from "next-common/components/listInfo/accordion";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import FlexBetween from "next-common/components/styled/flexBetween";
import Divider from "next-common/components/styled/layout/divider";
import businessCategory from "next-common/utils/consts/business/category";

const ChildBountyWrapper = styled.div`
  > div:first-child {
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
`;

const ChildBounty = styled(FlexBetween)`
  flex-grow: 1;

  a {
    flex-basis: 392px;
    font-weight: 400;
    white-space: pre-wrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${(props) => props.theme.textPrimary};
  }

  > div {
    flex-basis: 240px;
  }
  > div > span {
    flex-basis: 120px;
    text-align: right;
  }
`;

const ChildBountyMobile = styled(Flex)`
  display: none;
  @media screen and (max-width: 768px) {
    display: flex;
  }
  flex-wrap: wrap;
  padding: 12px 0;

  a {
    flex-basis: 100%;
    padding-right: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  > div {
    width: 100%;
  }
`;

const SemiBold = styled.span`
  font-weight: 500;
`;

const DividerWrapper = styled(FlexBetween)`
  flex-wrap: wrap;

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 12px;
      color: ${(props) => props.theme.textTertiary};
      margin: 0 8px;
    }
  }
`;

const Accessory = styled.span`
  color: ${(props) => props.theme.textTertiary};
`;

const DomesticLink = styled.a`
  margin-top: 16px;
  display: block;
  width: 60px;
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => props.theme.primaryPurple500};
  cursor: pointer;
`;

function ChildBountiesTable({ childBounties, decimals, symbol }) {
  if (!childBounties?.items || !childBounties?.items?.length) {
    return null;
  }
  return (
    <Accordion title="Child Bounties">
      {childBounties.items.map((bounty, index) => {
        return (
          <ChildBountyWrapper key={index}>
            <Row
              row={[
                `#${bounty.index}`,
                // eslint-disable-next-line react/jsx-key
                <ChildBounty>
                  <Anchor
                    href={`/treasury/child-bounty/${bounty.parentBountyId}_${bounty.index}`}
                    title={bounty.title}
                  >
                    {bounty.title}
                  </Anchor>
                  <FlexBetween style={{ height: 20 }}>
                    <SemiBold>
                      {toPrecision(bounty.onchainData?.value, decimals)}{" "}
                      <Accessory>{symbol}</Accessory>
                    </SemiBold>
                    <Tag
                      state={bounty.onchainData?.state?.state}
                      category={businessCategory.treasuryChildBounties}
                    />
                  </FlexBetween>
                </ChildBounty>,
              ]}
            />

            <ChildBountyMobile key={index}>
              <Anchor
                href={`/treasury/child-bounty/${bounty.parentBountyId}_${bounty.index}`}
                title={bounty.title}
              >
                {bounty.title}
              </Anchor>
              <Divider margin={8} />
              <FlexBetween>
                <DividerWrapper>
                  <SemiBold>#{bounty.index}</SemiBold>
                  <span>
                    {" "}
                    <SemiBold>
                      {" "}
                      {toPrecision(bounty.onchainData?.value, decimals)}
                    </SemiBold>{" "}
                    <Accessory>{symbol}</Accessory>
                  </span>
                </DividerWrapper>
                <Tag
                  state={bounty.onchainData?.state?.state}
                  category={businessCategory.treasuryChildBounties}
                />
              </FlexBetween>
            </ChildBountyMobile>
          </ChildBountyWrapper>
        );
      })}

      {childBounties.total > 5 && (
        <DomesticLink
          href={`/treasury/child-bounties?parentBountyId=${childBounties.items[0].parentBountyId}`}
        >
          View all
        </DomesticLink>
      )}
    </Accordion>
  );
}

export default ChildBountiesTable;
