const { findDecorated } = require("../../../../specs");
const { getApi } = require("../../../../api");

async function getReferendumInfoFromStorage(referendumIndex, indexer) {
  const decorated = await findDecorated(indexer.blockHeight);
  const key = [decorated.query.democracy.referendumInfoOf, referendumIndex];

  const api = await getApi();
  const raw = await api.rpc.state.getStorage(key, indexer.blockHash);
  return raw.toJSON();
}

async function getReferendumInfoByHeight(referendumIndex, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return getReferendumInfoFromStorage(referendumIndex, {
    blockHeight,
    blockHash,
  });
}

module.exports = {
  getReferendumInfoFromStorage,
  getReferendumInfoByHeight,
};
