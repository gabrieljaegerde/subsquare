import { useOnchainData, useTimelineData } from "../index";
import findLast from "lodash.findlast";
import findLastIndex from "lodash.findlastindex";

export function useDecidingSince() {
  const onchain = useOnchainData();
  return onchain.info?.deciding?.since;
}

export function useConfirming() {
  const onchain = useOnchainData();
  return onchain.info?.deciding?.confirming;
}

export function useTally() {
  const onchain = useOnchainData();
  return onchain?.info?.tally;
}

export function useConfirmingStarted() {
  const timeline = useTimelineData();
  const startedItem = findLast(
    timeline,
    (item) => item.name === "ConfirmStarted"
  );
  return startedItem?.indexer?.blockHeight;
}

export function useConfirmTimelineData() {
  const timeline = useTimelineData();
  return timeline.filter((item) => {
    return ["ConfirmStarted", "ConfirmAborted", "Confirmed"].includes(
      item.name
    );
  });
}

export function useConfirmTimelineFailPairs() {
  let pairs = [];

  const confirms = useConfirmTimelineData();
  const lastAbortedIndex = findLastIndex(
    confirms || [],
    (confirm) => confirm.name === "ConfirmAborted"
  );

  const arrStartedAndAborted = confirms.slice(
    0,
    lastAbortedIndex ? lastAbortedIndex + 1 : 0
  );

  pairs = arrStartedAndAborted.reduce((res, _value, idx, arr) => {
    if (idx % 2 === 0) {
      res.push(arr.slice(idx, idx + 2));
    }
    return res;
  }, []);

  return pairs;
}
