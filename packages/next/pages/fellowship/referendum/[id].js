import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  getFellowshipReferendumCommentsUrl,
  getFellowshipReferendumUrl,
} from "next-common/services/url";
import { to404 } from "next-common/utils/serverSideUtil";
import { EmptyList } from "next-common/components/emptyList";
import { PostProvider } from "next-common/context/post";
import { getBannerUrl } from "next-common/utils/banner";
import DetailWithRightLayout from "next-common/components/layout/detailWithRightLayout";
import getMetaDesc from "next-common/utils/post/getMetaDesc";
import FellowshipBreadcrumb from "next-common/components/fellowship/breadcrumb";
import DetailItem from "../../../components/detailItem";
import useUniversalComments from "../../../components/universalComments";
import Gov2ReferendumMetadata from "next-common/components/gov2/referendum/metadata";
import Timeline from "../../../components/gov2/timeline";
import FellowshipReferendumSideBar from "../../../components/fellowship/referendum/sidebar";

export default withLoginUserRedux(({ detail, comments }) => {
  const { CommentComponent, focusEditor } = useUniversalComments({
    detail,
    comments,
  });

  return (
    <PostProvider post={detail}>
      <DetailWithRightLayout
        seoInfo={{
          title: detail?.title,
          desc: getMetaDesc(detail),
          ogImage: getBannerUrl(detail?.bannerCid),
        }}
      >
        <FellowshipBreadcrumb />
        <DetailItem onReply={focusEditor} />

        <FellowshipReferendumSideBar />

        <Gov2ReferendumMetadata detail={detail} />
        <Timeline trackInfo={detail?.onchainData?.trackInfo} />
        {CommentComponent}
      </DetailWithRightLayout>
    </PostProvider>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id, page, page_size } = context.query;
  const pageSize = Math.min(page_size ?? 50, 100);

  const { result: detail } = await ssrNextApi.fetch(
    getFellowshipReferendumUrl(id)
  );
  if (!detail) {
    return to404(context);
  }

  const postId = detail?._id;
  const { result: comments } = await ssrNextApi.fetch(
    getFellowshipReferendumCommentsUrl(postId),
    {
      page: page ?? "last",
      pageSize,
    }
  );

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
    },
  };
});
