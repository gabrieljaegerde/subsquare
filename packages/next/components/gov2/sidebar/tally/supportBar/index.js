import styled, { useTheme } from "styled-components";
import Progress from "next-common/components/progress";
import useSupportThreshold from "../threshold/useSupportThreshold";
import { useTally } from "next-common/context/post/gov2/referendum";
import { useEffect, useMemo, useState } from "react";
import ThresholdComponent from "../../../../referenda/threshold";
import Percentage from "./percentage";
import isNil from "lodash.isnil";
import TooltipOrigin from "next-common/components/tooltip";
import { p_12_medium } from "next-common/styles/componentCss";

const Wrapper = styled.div`
  margin-top: 21px;
  padding: 0 0 8px;

  font-size: 12px;
  line-height: 16px;

  position: relative;

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  ul {
    margin-top: 4px;
    display: flex;
    justify-content: space-between;

    font-weight: 500;
    color: ${(props) => props.theme.textPrimary};
    li {
      width: 33.3%;
      ${p_12_medium};
      &:last-child {
        text-align: right;
      }
      &:nth-child(2) {
        text-align: center;
      }
    }
  }

  p {
    margin: 0;
    text-align: center;
    color: ${(props) => props.theme.textSecondary};
    ${p_12_medium};
  }
`;

const Mark = styled(ThresholdComponent)`
  margin-top: 8px;
`;

const Tooltip = styled(TooltipOrigin)`
  display: block;
  z-index: 1;
`;

const ProgressBarWrapper = styled.div`
  padding: 8px 0;
`;

export default function SupportBar({ issuance }) {
  const supportThreshold = useSupportThreshold();
  // threshold in perbill
  const [threshold, setThreshold] = useState(null);
  // progress max value in perbill
  const [progressMax, setProgressMax] = useState(null);
  const { grey100Bg } = useTheme();
  // support percentage perbill value
  const [percentage, setPercentage] = useState(null);

  useEffect(() => {
    if (supportThreshold) {
      setThreshold(supportThreshold * Math.pow(10, 9));
    }
  }, [supportThreshold]);

  useEffect(() => {
    if (!isNil(threshold)) {
      setProgressMax((threshold / 4) * 5);
    }
  }, [threshold]);

  const tally = useTally();
  const support = tally?.support;

  const barPercentage = useMemo(() => {
    if (!issuance || isNil(progressMax)) {
      return 0;
    }

    // when the decision period reach end, we show 100% for support bar,
    // because support threshold require 0% at the end
    if (progressMax <= 0) {
      return 100;
    }

    const supportPercentage = (support / issuance) * Math.pow(10, 9);
    setPercentage(supportPercentage);

    return Number((supportPercentage / progressMax) * 100).toFixed(2);
  }, [issuance, support, progressMax]);

  return (
    <Wrapper>
      <ProgressBarWrapper>
        <Tooltip
          content={
            isNil(support) ? null : (
              <>
                Support:&nbsp;
                <Percentage perbill={percentage} />
              </>
            )
          }
        >
          <Progress percentage={barPercentage} bg={grey100Bg} />
        </Tooltip>
      </ProgressBarWrapper>
      <Mark threshold="80%" />
      <ul>
        <li>0.0%</li>
        <li>
          <Percentage perbill={threshold} />
        </li>
        <li>
          <Percentage perbill={progressMax} />
        </li>
      </ul>
      <p>Threshold</p>
    </Wrapper>
  );
}
