import PostList from "next-common/components/postList";
import { EmptyList } from "next-common/utils/constants";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { toFinancialMotionsListItem } from "utils/viewfuncs";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { useChain } from "next-common/context/chain";

export default withLoginUserRedux(({ motions }) => {
  const chain = useChain();
  const items = (motions.items || []).map((item) =>
    toFinancialMotionsListItem(chain, item)
  );
  const category = "Financial Motions";
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <PostList
        category={category}
        create={null}
        items={items}
        pagination={{
          page: motions.page,
          pageSize: motions.pageSize,
          total: motions.total,
        }}
      />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { page, page_size: pageSize } = context.query;

  const [{ result: motions }] = await Promise.all([
    nextApi.fetch(`financial-motions`, {
      page: page ?? 1,
      pageSize: pageSize ?? 50,
    }),
  ]);

  return {
    props: {
      motions: motions ?? EmptyList,
    },
  };
});
