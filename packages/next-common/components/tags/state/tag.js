import React from "react";
import businessCategory, {
  detailPageCategory,
} from "../../../utils/consts/business/category";
import { TreasuryTag, TipTag, BountyTag, ChildBountyTag } from "./treasury";
import { ClosedTag, MotionTag } from "./styled";
import { CollectiveTag } from "./collective";
import {
  DemocracyExternalTag,
  DemocracyProposalTag,
  DemocracyReferendumTag,
} from "./democracy";
import { Gov2ReferendaTag } from "./gov2";

const categoryTagMap = {
  [businessCategory.treasuryProposals]: TreasuryTag,
  [detailPageCategory.TREASURY_PROPOSAL]: TreasuryTag,

  [businessCategory.treasuryTips]: TipTag,
  [detailPageCategory.TREASURY_TIP]: TipTag,

  [businessCategory.treasuryBounties]: BountyTag,
  [detailPageCategory.TREASURY_BOUNTY]: BountyTag,
  [businessCategory.treasuryChildBounties]: ChildBountyTag,
  [detailPageCategory.TREASURY_CHILD_BOUNTY]: ChildBountyTag,

  [businessCategory.councilMotions]: CollectiveTag,
  [detailPageCategory.COUNCIL_MOTION]: CollectiveTag,
  [businessCategory.tcProposals]: CollectiveTag,
  [detailPageCategory.TECH_COMM_MOTION]: CollectiveTag,
  [businessCategory.collective]: CollectiveTag,

  [businessCategory.democracyProposals]: DemocracyProposalTag,
  [detailPageCategory.DEMOCRACY_PROPOSAL]: DemocracyProposalTag,

  [businessCategory.democracyExternals]: DemocracyExternalTag,
  [detailPageCategory.DEMOCRACY_EXTERNAL]: DemocracyExternalTag,

  [businessCategory.democracyReferenda]: DemocracyReferendumTag,
  [detailPageCategory.DEMOCRACY_REFERENDUM]: DemocracyReferendumTag,

  gov2: Gov2ReferendaTag,
  [detailPageCategory.GOV2_REFERENDUM]: Gov2ReferendaTag,
  [detailPageCategory.FELLOWSHIP_REFERENDUM]: Gov2ReferendaTag,
};

export default function Tag({ category, state, link, args, data }) {
  let element = state;
  if (link) {
    element = <a href={link}>{state}</a>;
    return <MotionTag>{element}</MotionTag>;
  }

  const Tag = categoryTagMap[category];
  if (Tag) {
    return <Tag state={element} args={args} data={data} />;
  }
  return <ClosedTag>{element}</ClosedTag>;
}
