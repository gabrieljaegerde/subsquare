import polkadot from "./polkadot";
import kusama from "./kusama";
import acala from "./acala";
import basilisk from "./basilisk";
import bifrost from "./bifrost";
import calamari from "./calamari";
import crab from "./crab";
import interlay from "./interlay";
import karura from "./karura";
import khala from "./khala";
import phala from "./phala";
import kintsugi from "./kintsugi";
import polkadex from "./polkadex";
import turing from "./turing";
import crust from "./crust";
import centrifuge from "./centrifuge";
import litmus from "./litmus";
import zeitgeist from "./zeitgeist";
import altair from "./altair";
import hydradx from "./hydradx";
import development from "./development";
import rococo from "./rococo";

const settingsMap = {
  polkadot,
  kusama,
  acala,
  altair,
  basilisk,
  hydradx,
  bifrost,
  calamari,
  centrifuge,
  crab,
  crust,
  interlay,
  karura,
  khala,
  kintsugi,
  litmus,
  phala,
  polkadex,
  turing,
  zeitgeist,
  rococo,
  ...(process.env.NEXT_PUBLIC_DEVELOPMENT === "true" ? { development } : {}),
};

export default function getChainSettings(chain) {
  const settings = settingsMap[chain];
  if (!settings) {
    throw `can not get chain settings of ${chain}`;
  }

  return settings;
}
