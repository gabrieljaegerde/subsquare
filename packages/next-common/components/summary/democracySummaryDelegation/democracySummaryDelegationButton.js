import React from "react";
import { useState } from "react";
import { Button } from "../styled";
import DelegatePopup from "next-common/components/democracy/delegatePopup";
import AddSVG from "next-common/assets/imgs/icons/add.svg";
import RemoveSVG from "next-common/assets/imgs/icons/remove.svg";
import UndelegatePopup from "./undelegatePopup";

export default function DemocracySummaryDelegationButton({
  delegating,
  onUndelegateInBlock,
  onDelegateInBlock,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDelegatePopup, setShowDelegatePopup] = useState(false);
  const [showUndelegatePopup, setShowUndelegatePopup] = useState(false);

  const addDelegationButton = (
    <Button onClick={() => setShowDelegatePopup(true)}>
      <AddSVG />
      Delegate
    </Button>
  );

  const removeDelegationButton = (
    <Button disabled={isLoading} onClick={() => setShowUndelegatePopup(true)}>
      <RemoveSVG />
      Remove
    </Button>
  );

  return (
    <>
      {delegating ? removeDelegationButton : addDelegationButton}
      {showDelegatePopup && (
        <DelegatePopup
          onInBlock={onDelegateInBlock}
          onClose={() => setShowDelegatePopup(false)}
        />
      )}
      {showUndelegatePopup && (
        <UndelegatePopup
          onInBlock={onUndelegateInBlock}
          onClose={() => setShowUndelegatePopup(false)}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
}
