import { useSelector } from "react-redux";
import { votesSelector } from "next-common/store/reducers/gov2ReferendumSlice";
import AyeIcon from "../../../../../public/imgs/icons/aye.svg";
import { useTally } from "next-common/context/post/gov2/referendum";
import LoadingCount from "./loadingCount";
import SymbolValue from "./symbolValue";
import { BorderedRow } from "next-common/components/referenda/tally/styled";

export default function Aye() {
  const tally = useTally();
  const { allAye = [] } = useSelector(votesSelector);

  return (
    <BorderedRow>
      <LoadingCount count={allAye.length}>
        <AyeIcon />
        Aye
      </LoadingCount>
      <SymbolValue value={tally?.ayes} />
    </BorderedRow>
  );
}
