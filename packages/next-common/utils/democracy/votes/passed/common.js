import BigNumber from "bignumber.js";
import { LOCKS } from "../consts";

export const emptyVotes = {
  allAye: [],
  allNay: [],
};

export function objectSpread(dest, ...sources) {
  for (let i = 0; i < sources.length; i++) {
    const src = sources[i];

    if (src) {
      Object.assign(dest, src);
    }
  }

  return dest;
}

export function sortVotes(votes = []) {
  return votes.sort((a, b) => {
    return new BigNumber(a.balance).gt(b.balance) ? -1 : 1;
  });
}

export function sortVotesWithConviction(votes = []) {
  return votes.sort((a, b) => {
    const ta = new BigNumber(a.balance)
      .multipliedBy(LOCKS[a.conviction])
      .div(10);
    const tb = new BigNumber(b.balance)
      .multipliedBy(LOCKS[b.conviction])
      .div(10);
    return new BigNumber(ta).gt(tb) ? -1 : 1;
  });
}

export function normalizeVotingOfEntry([storageKey, voting], blockApi) {
  let pubKeyU8a;
  if (storageKey.length === 72) {
    pubKeyU8a = storageKey.slice(40);
  }
  if (!pubKeyU8a) {
    throw new Error(`Unexpected storage key length ${storageKey.length}`);
  }

  const accountId = blockApi.registry.createType("AccountId", pubKeyU8a);
  const account = accountId.toString();
  return { account, voting };
}
