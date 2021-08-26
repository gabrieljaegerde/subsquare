import styled, { css } from "styled-components";

import { timeDuration } from "utils";
import Markdown from "components/markdown";
import Edit from "components/edit";
import HtmlRender from "../post/htmlRender";
import nextApi from "services/nextApi";
import { useEffect, useState } from "react";
import ReplyIcon from "public/imgs/icons/reply.svg";
import ThumbUpIcon from "public/imgs/icons/thumb-up.svg";
import UnfoldIcon from "public/imgs/icons/unfold.svg";
import FoldIcon from "public/imgs/icons/fold.svg";
import { useDispatch } from "react-redux";
import { addToast } from "store/reducers/toastSlice";
import User from "components/user";
import EditInput from "components/editInput";
import { useRouter } from "next/router";

const Wrapper = styled.div`
  position: relative;
  padding: 16px 48px;
  margin: 0px -48px;

  :not(:last-child)::after {
    content: "";
    height: 1px;
    position: absolute;
    bottom: 0;
    left: 76px;
    width: calc(100% - 124px);
    background-color: #ebeef4;
  }

  :hover {
    .edit {
      display: block;
    }
  }

  ${(p) =>
    p.highlight &&
    css`
      background-color: #f6f7fa;
    `}
`;

const InfoWrapper = styled.div`
  display: flex;
  min-height: 28px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  > :last-child {
    font-size: 14px;
    color: #9da9bb;
  }
`;

const ContentWrapper = styled.div`
  margin: 8px 0 0 28px;
`;

const ActionWrapper = styled.div`
  display: flex;
  margin: 16px 0 0 28px;
  align-items: flex-start;
  height: 22px;
  flex-wrap: wrap;
`;

const ActionItem = styled.div`
  cursor: default;
  white-space: nowrap;

  ${(p) =>
    !p.noHover &&
    css`
      cursor: pointer;
      :hover {
        color: #506176;
        > svg {
          path {
            fill: #506176;
          }
        }
      }
    `}

  ${(p) =>
    p.highlight
      ? css`
          color: #506176;
          > svg {
            path {
              fill: #506176;
            }
          }
        `
      : css`
          color: #9da9bb;
          > svg {
            path {
              fill: #9da9bb;
            }
          }
        `}

  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 100%;

  :not(:first-child) {
    margin-left: 17px;
  }

  > svg {
    margin-right: 8px;
  }
`;

const UnfoldWrapper = styled(ActionItem)`
  margin-left: 7px !important;
`;

const SupporterWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  padding: 8px 12px;
  background: #f6f7fa;
  border-radius: 4px;
  margin: 16px 0 0 28px;
`;

const SupporterItem = styled.div`
  display: inline-block;
  margin-right: 12px;
  > .username {
    color: #506176;
  }
`;

const EditedLabel = styled.div`
  margin-top: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: #9da9bb;
`;

export default function Item({ user, data, chain, onReply }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [comment, setComment] = useState(data);
  const [thumbUpLoading, setThumbUpLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [showThumbsUpList, setShowThumbsUpList] = useState(false);

  useEffect(() => {
    if (window?.location?.hash === "") {
      return;
    }
    const height = parseInt(window.location.hash.substr(1));
    setHighlight(height === comment.height);
  }, [router]);

  const commentId = comment._id;
  const isLoggedIn = !!user;
  const ownComment = isLoggedIn && comment.author?.username === user.username;
  const thumbUp =
    isLoggedIn &&
    comment?.reactions?.findIndex((r) => r.user?.username === user.username) >
      -1;

  const updateComment = async () => {
    const { result: updatedComment } = await nextApi.fetch(
      `${chain}/comments/${comment._id}`
    );
    if (updatedComment) {
      setComment(updatedComment);
    }
  };

  const toggleThumbUp = async () => {
    if (isLoggedIn && !ownComment && !thumbUpLoading) {
      setThumbUpLoading(true);
      try {
        let result, error;

        if (thumbUp) {
          ({ result, error } = await nextApi.fetch(
            `${chain}/comments/${comment._id}/reaction`,
            {},
            {
              method: "DELETE",
            }
          ));
        } else {
          ({ result, error } = await nextApi.fetch(
            `${chain}/comments/${comment._id}/reaction`,
            {},
            {
              method: "PUT",
              body: JSON.stringify({ reaction: 1 }),
              headers: { "Content-Type": "application/json" },
            }
          ));
        }

        if (result) {
          await updateComment();
        }
        if (error) {
          dispatch(
            addToast({
              type: "error",
              message: error.message,
            })
          );
        }
      } finally {
        setThumbUpLoading(false);
      }
    }
  };

  const editComment = async (content, contentType) => {
    return await nextApi.fetch(
      `${chain}/comments/${commentId}`,
      {},
      {
        method: "PATCH",
        credentials: "same-origin",
        body: JSON.stringify({
          content,
          contentType,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
  };

  return (
    <Wrapper id={comment.height} highlight={highlight}>
      <InfoWrapper>
        <User user={comment.author} chain={chain} />
        <div>{timeDuration(comment.createdAt)}</div>
      </InfoWrapper>
      {!isEdit && (
        <>
          <ContentWrapper>
            {comment.contentType === "markdown" && (
              <Markdown md={comment.content} />
            )}
            {comment.contentType === "html" && (
              <HtmlRender html={comment.content} />
            )}
            {comment.createdAt !== comment.updatedAt && (
              <EditedLabel>Edited</EditedLabel>
            )}
          </ContentWrapper>
          <ActionWrapper>
            <ActionItem
              onClick={() => {
                if (isLoggedIn && !ownComment) {
                  onReply(comment.author?.username);
                }
              }}
              noHover={!isLoggedIn || ownComment}
            >
              <ReplyIcon />
              <div>Reply</div>
            </ActionItem>
            <ActionItem
              noHover={!isLoggedIn || ownComment}
              highlight={isLoggedIn && thumbUp}
              onClick={toggleThumbUp}
            >
              <ThumbUpIcon />
              <div>Up ({comment?.reactions?.length ?? 0})</div>
            </ActionItem>
            {comment?.reactions?.length > 0 && (
              <UnfoldWrapper
                onClick={() => setShowThumbsUpList(!showThumbsUpList)}
              >
                {showThumbsUpList ? <UnfoldIcon /> : <FoldIcon />}
              </UnfoldWrapper>
            )}
            {ownComment && <Edit edit={ownComment} setIsEdit={setIsEdit} />}
          </ActionWrapper>
          {showThumbsUpList && comment?.reactions?.length > 0 && (
            <SupporterWrapper>
              {comment.reactions
                .filter((r) => r.user)
                .map((r, index) => (
                  <SupporterItem key={index}>
                    <User user={r.user} chain={chain} showAvatar={false} />
                  </SupporterItem>
                ))}
            </SupporterWrapper>
          )}
        </>
      )}
      {isEdit && (
        <EditInput
          editContent={comment.content}
          editContentType={comment.contentType}
          onFinishedEdit={(reload) => {
            if (reload) {
              updateComment();
            }
            setIsEdit(false);
          }}
          update={editComment}
        />
      )}
    </Wrapper>
  );
}
