import React from "react";
import isNil from "lodash.isnil";
import CountDown from "next-common/components/_CountDown";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import styled, { useTheme } from "styled-components";
import Flex from "../../styled/flex";
import TimeDuration from "../../TimeDuration";

const Wrapper = styled(Flex)`
  svg {
    margin-right: 0;
  }
`;

export default function DecisionCountdown({ detail }) {
  const { secondaryBlue500, secondaryBlue100 } = useTheme();

  const latestHeight = useSelector(latestHeightSelector);
  const onchain = detail?.onchainData;
  const info = onchain?.info;
  const trackInfo = onchain?.trackInfo;

  const confirming = info?.deciding?.confirming;

  const decisionPeriod = trackInfo?.decisionPeriod;
  const decisionSince = info?.deciding?.since;
  const decisionEnd = Math.max(decisionSince + decisionPeriod, confirming || 0);

  const decisionRemaining = getDecisoinRemaining(
    latestHeight,
    decisionSince,
    decisionPeriod
  );

  const decisionPercentage = useMemo(() => {
    if (isNil(latestHeight)) {
      return 0;
    }
    if (latestHeight >= decisionEnd) {
      return 100;
    }

    const gone = latestHeight - decisionSince;
    return Number((gone / decisionPeriod) * 100).toFixed(2);
  }, [latestHeight]);

  return (
    <Wrapper>
      <CountDown
        denominator={100}
        numerator={decisionPercentage}
        foregroundColor={secondaryBlue500}
        backgroundColor={secondaryBlue100}
        tooltipContent={
          decisionRemaining > 0 && (
            <span>
              Deciding end in <TimeDuration blocks={decisionRemaining} />, #
              {decisionEnd.toLocaleString()}
            </span>
          )
        }
      />
    </Wrapper>
  );
}

function getDecisoinRemaining(latestHeight, decidingSince, decisionPeriod) {
  if (isNil(latestHeight)) {
    return 0;
  }

  const gone = latestHeight - decidingSince;
  if (gone > decisionPeriod) {
    return 0;
  } else {
    return decisionPeriod - gone;
  }
}
