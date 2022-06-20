import MembersList from "next-common/components/membersList/techCommMembersList";
import Menu from "next-common/components/menu";
import { mainMenu } from "next-common/utils/constants";
import Layout from "next-common/components/layout";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";
import usePrime from "next-common/utils/hooks/usePrime";
import { TYPE_TECH_COMM_MOTION } from "next-common/utils/viewConstants";

export default withLoginUserRedux(({ loginUser, chain }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useApi(chain);
  const members = useCall(api?.derive.technicalCommittee.members, []);
  const prime = usePrime({ chain, type: TYPE_TECH_COMM_MOTION });
  useEffect(() => {
    if (members) {
      setData(members.toJSON() || []);
      setLoading(false);
    }
  }, [members]);
  const category = "Technical Committee Members";
  const seoInfo = { title: category, desc: category };

  return (
    <Layout
      user={loginUser}
      left={<Menu menu={mainMenu} chain={chain} />}
      chain={chain}
      seoInfo={seoInfo}
    >
      <MembersList
        chain={chain}
        prime={prime}
        category={category}
        items={data}
        loading={loading}
      />
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
    },
  };
});
