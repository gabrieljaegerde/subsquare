import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { toReferendaListItem } from "utils/viewfuncs";
import DemocracySummary from "next-common/components/summary/democracySummary";
import businessCategory from "next-common/utils/consts/business/category";
import HomeLayout from "next-common/components/layout/HomeLayout";
import DemocracySummaryDelegation from "next-common/components/summary/democracySummaryDelegation";

export default withLoginUserRedux(({ posts, chain }) => {
  const items = (posts.items || []).map((item) =>
    toReferendaListItem(chain, item)
  );
  const category = businessCategory.democracyReferenda;
  const seoInfo = { title: `Democracy Referenda`, desc: `Democracy Referenda` };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <PostList
        category={category}
        create={null}
        items={items}
        pagination={{
          page: posts.page,
          pageSize: posts.pageSize,
          total: posts.total,
        }}
        summary={<DemocracySummary footer={<DemocracySummaryDelegation />} />}
      />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { page, page_size: pageSize } = context.query;

  const [{ result: posts }] = await Promise.all([
    nextApi.fetch(`democracy/referendums`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      chain,
      posts: posts ?? EmptyList,
    },
  };
});
