const { handleBusinessWhenMotionExecuted } = require("./hooks/executed");
const {
  TimelineItemTypes,
  CouncilEvents,
} = require("../../../common/constants");
const {
  updateMotionByHash,
} = require("../../../../mongo/service/onchain/motion");

async function handleExecuted(registry, event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash, dispatchResult] = eventData;

  const state = {
    state: CouncilEvents.Executed,
    data: eventData,
    indexer,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: CouncilEvents.Executed,
    args: {
      hash,
      dispatchResult,
    },
    indexer,
  };

  const updates = { state, isFinal: true };
  await updateMotionByHash(hash, updates, timelineItem);
  await handleBusinessWhenMotionExecuted(hash, indexer);
}

module.exports = {
  handleExecuted,
};
