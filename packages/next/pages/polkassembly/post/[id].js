import Back from "next-common/components/back";
import DetailItem from "components/polkassembly/detailItem";
import PolkassemblyComments from "components/polkassembly/comment";
import usePolkassemblyPostData from "components/polkassembly/usePolkassemblyPostData";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { to404 } from "next-common/utils/serverSideUtil";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import DetailLayout from "next-common/components/layout/DetailLayout";
import { getBannerUrl } from "next-common/utils/banner";
import { PostProvider } from "next-common/context/post";

export default withLoginUserRedux(({ detail }) => {
  const polkassemblyId = detail?.polkassemblyId;
  const { comments, postReactions, loadingComments } = usePolkassemblyPostData({
    polkassemblyId,
  });

  const desc = getMetaDesc(detail);
  return (
    <PostProvider post={detail}>
      <DetailLayout
        seoInfo={{
          title: detail?.title,
          desc,
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        <Back
          href={`/polkassembly/discussions`}
          text="Back to Polkassembly Discussions"
        />
        <DetailItem postReactions={postReactions} />
        <PolkassemblyComments
          isLoading={loadingComments}
          comments={comments}
          paId={polkassemblyId}
        />
      </DetailLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;
  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`polkassembly-discussions/${id}`),
  ]);

  if (!detail) {
    return to404(context);
  }

  return {
    props: {
      detail,
    },
  };
});
