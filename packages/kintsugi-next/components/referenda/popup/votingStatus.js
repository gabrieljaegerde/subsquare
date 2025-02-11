import PopupLabel from "next-common/components/popup/label";
import LoadingVotingStatus from "next-common/components/popup/loadingVotingStatus";
import NoDataStatusBox from "next-common/components/popup/noDataStatusBox";
import VoteStatus from "./voteStatus";

export default function VotingStatus({ addressVote, addressVoteIsLoading }) {
  return (
    <div>
      <PopupLabel text={"Voting status"} />
      {addressVoteIsLoading ? (
        <LoadingVotingStatus />
      ) : addressVote ? (
        <VoteStatus addressVote={addressVote} />
      ) : (
        <NoDataStatusBox text={"No voting record"} />
      )}
    </div>
  );
}
