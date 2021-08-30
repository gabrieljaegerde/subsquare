const { MongoClient } = require("mongodb");
const { currentChain, CHAINS } = require("../env");

function getDbName() {
  const chain = currentChain();

  if (CHAINS.KARURA === chain) {
    return process.env.MONGO_DB_CHAIN_DATA_KAR_NAME || "subsquare-kar";
  } else if (CHAINS.KUSAMA === chain) {
    return process.env.MONGO_DB_CHAIN_DATA_KSM_NAME || "subsquare-ksm";
  } else if (CHAINS.POLKADOT === chain) {
    return process.env.MONGO_DB_CHAIN_DATA_DOT_NAME || "subsquare-dot";
  } else {
    return process.env.MONGO_DB_CHAIN_DATA_KAR_NAME || "subsquare-kar";
  }
}

const statusCollectionName = "status";
const tipCollectionName = "tip";
const motionCollectionName = "motion";
const treasuryProposalCollectionName = "treasuryProposal";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

let statusCol = null;
let tipCol = null;
let motionCol = null;
let treasuryProposalCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(getDbName());
  statusCol = db.collection(statusCollectionName);
  tipCol = db.collection(tipCollectionName);
  motionCol = db.collection(motionCollectionName);
  treasuryProposalCol = db.collection(treasuryProposalCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  // TODO: create indexes for better query performance
}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
}

async function getStatusCollection() {
  await tryInit(statusCol);
  return statusCol;
}

async function getTipCollection() {
  await tryInit(tipCol);
  return tipCol;
}

async function getMotionCollection() {
  await tryInit(motionCol);
  return motionCol;
}

async function getTreasuryProposalCollection() {
  await tryInit(treasuryProposalCol);
  return treasuryProposalCol;
}

module.exports = {
  getStatusCollection,
  getTipCollection,
  getMotionCollection,
  getTreasuryProposalCollection,
};
