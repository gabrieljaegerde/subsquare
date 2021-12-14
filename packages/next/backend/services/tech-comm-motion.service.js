const { ObjectId } = require("mongodb");
const { HttpError } = require("../exc");
const { ContentType } = require("../constants");
const { PostTitleLengthLimitation } = require("../constants");
const { safeHtml, extractMentions } = require("../utils/post");
const { toUserPublicInfo } = require("../utils/user");
const {
  getDb: getChainDb,
  getTechCommMotionCollection: getChainTechCommMotionCollection,
  getExternalCollection: getChainExternalCollection,
} = require("../mongo/chain");
const {
  getDb: getCommonDb,
  getUserCollection,
} = require("../mongo/common");
const {
  getDb: getBusinessDb,
  getDemocracyCollection,
  getTechCommMotionCollection,
} = require("../mongo/business");
const mailService = require("./mail.service");


async function findMotion(postId) {
  const q = {};
  if (ObjectId.isValid(postId)) {
    q._id = ObjectId(postId);
  } else if (/^\d+$/.test(postId)) {
    q.index = parseInt(postId);
  } else {
    const m = postId.match(/^(\d+)_(.+)$/);
    if (m) {
      q["indexer.blockHeight"] = parseInt(m[1]);
      q.hash = m[2];
    } else {
      q.hash = postId;
    }
  }

  const chainMotionCol = await getChainTechCommMotionCollection();
  return await chainMotionCol.findOne(q);
}

async function findMotionPost(chainMotion) {
  let postCol;
  let post;
  let postType;

  if (chainMotion.externalProposals?.length === 0) {
    const externalProposalHash = chainMotion.externalProposals[0].hash;

    postCol = await getDemocracyCollection();
    post = await postCol.findOne({ externalProposalHash });
    postType = "democracy";
  } else {
    const hash = chainMotion.hash;
    const height = chainMotion.indexer.blockHeight;

    postCol = await getTechCommMotionCollection();
    post = await postCol.findOne({ hash, height });
    postType = "techCommMotion";
  }

  return [postCol, post, postType];
}

async function loadPostForMotions(chainMotions) {
  const chain = process.env.CHAIN;
  for (const motion of chainMotions) {
    if (motion.externalProposals?.length === 1) {
      motion.externalProposalHash = motion.externalProposals[0].hash;
    }
  }

  const commonDb = await getCommonDb();
  const businessDb = await getBusinessDb();

  const [, democracyPosts, motionPosts] = await Promise.all(
    [
      commonDb.lookupOne({
        from: "user",
        for: chainMotions,
        as: "author",
        localField: "proposer",
        foreignField: `${chain}Address`,
        map: toUserPublicInfo,
      }),
      businessDb.lookupOne({
        from: "democracy",
        for: chainMotions,
        as: "democracyPost",
        localField: "externalProposalHash",
        foreignField: "externalProposalHash",
      }),
      businessDb.compoundLookupOne({
        from: "techCommMotion",
        for: chainMotions,
        as: "motionPost",
        compoundLocalFields: ["hash", "indexer.blockHeight"],
        compoundForeignFields: ["hash", "height"],
      }),
    ]
  );

  await Promise.all([
    businessDb.lookupCount({
      from: "comment",
      for: democracyPosts,
      as: "commentsCount",
      localField: "_id",
      foreignField: "democracy",
    }),
    businessDb.lookupCount({
      from: "comment",
      for: motionPosts,
      as: "commentsCount",
      localField: "_id",
      foreignField: "techCommMotion",
    }),
  ]);

  return chainMotions.map((motion) => {
    const post = {
      ...(motion.democracyPost ?? motion.motionPost),
    };
    motion.democracyPost = undefined;
    motion.motionPost = undefined;
    post._id = motion._id;
    post.proposer = motion.proposer;
    post.motionIndex = motion.index;
    post.hash = motion.hash;
    post.height = motion.indexer.blockHeight;
    post.indexer = motion.indexer;
    post.author = motion.author;
    post.onchainData = motion;
    post.state = motion.state?.state;
    return post;
  });
}

async function updatePost(postId, title, content, contentType, author) {
  const chain = process.env.CHAIN;

  const chainMotion = await findMotion(postId);
  if (!chainMotion) {
    throw new HttpError(403, "Motion is not found");
  }

  if (!chainMotion.authors.includes(author[`${chain}Address`])) {
    throw new HttpError(403, "You cannot edit");
  }

  if (title.length > PostTitleLengthLimitation) {
    throw new HttpError(400, {
      title: ["Title must be no more than %d characters"],
    });
  }

  const [postCol, post] = await findMotionPost(chainMotion);
  if (!post) {
    throw new HttpError(404, "Post does not exists");
  }

  const postObjId = post._id;
  const now = new Date();

  const result = await postCol.updateOne(
    { _id: postObjId },
    {
      $set: {
        title,
        content: contentType === ContentType.Html ? safeHtml(content) : content,
        contentType,
        contentVersion: post.contentVersion ?? "2",
        updatedAt: now,
        lastActivityAt: now,
      },
    }
  );

  if (!result.acknowledged) {
    throw new HttpError(500, "Failed to update post");
  }

  return true;
}

async function getActiveMotionsOverview() {
  const motionCol = await getChainTechCommMotionCollection();
  const motions = await motionCol
    .find({
      "state.state": { $nin: ["Approved", "Disapproved", "Executed"] },
    })
    .sort({ "indexer.blockHeight": -1 })
    .limit(3)
    .toArray();

  const result = await loadPostForMotions(motions);

  return result.filter((post) => post.lastActivityAt?.getTime() >= Date.now() - 7 * Day).slice(0, 3);
}

async function getMotionsByChain(page, pageSize) {
  const chainMotionCol = await getChainTechCommMotionCollection();
  const total = await chainMotionCol.countDocuments();

  if (page === "last") {
    const totalPages = Math.ceil(total / pageSize);
    page = Math.max(totalPages, 1);
  }

  const motions = await chainMotionCol
    .find({}, { projection: { timeline: 0 } })
    .sort({ index: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  const posts = await loadPostForMotions(motions);

  return {
    items: posts,
    total,
    page,
    pageSize,
  };
}

async function getMotionById(postId) {
  const chain = process.env.CHAIN;

  const chainMotion = await findMotion(postId);
  if (!chainMotion) {
    throw new HttpError(404, "Post not found");
  }

  const techCommMotionCol = await getTechCommMotionCollection();
  const democracyCol = await getDemocracyCollection();
  const reactionCol = await getReactionCollection();
  const userCol = await getUserCollection();
  const chainExternalCol = await getChainExternalCollection();

  let post;
  let reactions;

  if (chainMotion.externalProposals?.length === 1) {
    const externalProposalHash = chainMotion.externalProposals[0].hash;

    post = await democracyCol.findOne({ externalProposalHash });
    reactions = await reactionCol
      .find({ democracy: post._id })
      .toArray();
  } else {
    const hash = chainMotion.hash;
    const height = chainMotion.indexer.blockHeight;

    post = await techCommMotionCol.findOne({ hash, height });
    reactions = await reactionCol.find({ techCommMotion: post._id }).toArray();
  }

  const [, author, externalProposals] = await Promise.all([
    lookupUser({ for: reactions, localField: "user" }),
    userCol.findOne({ [`${chain}Address`]: chainMotion.proposer }),
    chainExternalCol
      .find({
        proposalHash: {
          $in: chainMotion.externalProposals.map((p) => p.proposalHash),
        },
      })
      .sort({ "indexer.blockHeight": 1 })
      .toArray(),
  ]);

  return {
    ...post,
    _id: chainMotion._id,
    proposer: chainMotion.proposer,
    motionIndex: chainMotion.index,
    hash: chainMotion.hash,
    height: chainMotion.indexer.blockHeight,
    indexer: chainMotion.indexer,
    onchainData: chainMotion,
    state: chainMotion.state?.state,
    author,
    externalProposals,
  };
}

async function processPostThumbsUpNotification(post, postType, reactionUser) {
  const userCol = await getUserCollection();
  const postAuthor = await userCol.findOne({ _id: post.author });

  if (!postAuthor) {
    return;
  }

  if (postAuthor.emailVerified && (postAuthor.notification?.thumbsUp ?? true)) {
    mailService.sendPostThumbsupEmail({
      email: postAuthor.email,
      postAuthor: postAuthor.username,
      postType,
      postUid: post.postUid,
      reactionUser: reactionUser.username,
    });
  }
}

async function setPostReaction(postId, reaction, user) {
  const chainMotion = await findMotion(postId);
  if (!chainMotion) {
    throw new HttpError(404, "Motion does not found");
  }

  const [, post, postType] = await findMotionPost(chainMotion);
  if (!post) {
    throw new HttpError(404, "Post does not found");
  }

  const postObjId = post._id;

  const reactionCol = await getReactionCollection();

  const now = new Date();
  const result = await reactionCol.updateOne(
    {
      [postType]: postObjId,
      user: user._id,
    },
    {
      $set: {
        reaction,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true }
  );

  if (!result.acknowledged) {
    throw new HttpError(500, "Db error, update reaction.");
  }

  processPostThumbsUpNotification(post, postType, user).catch(console.error);

  return true;
}

async function unsetPostReaction(postId, user) {
  const chainMotion = await findMotion(postId);
  if (!chainMotion) {
    throw new HttpError(404, "Motion does not found");
  }

  const [, post, postType] = await findMotionPost(chainMotion);
  if (!post) {
    throw new HttpError(404, "Post does not found");
  }

  const postObjId = post._id;

  const reactionCol = await getReactionCollection();

  const result = await reactionCol.deleteOne({
    [postType]: postObjId,
    user: user._id,
  });

  if (!result.acknowledged) {
    throw new HttpError(500, "Db error, clean reaction.");
  }

  if (result.modifiedCount === 0) {
    return false;
  }

  return true;
}

async function processCommentMentions({
  postType,
  postUid,
  content,
  contentType,
  author,
  commentHeight,
  mentions,
}) {
  if (mentions.size === 0) {
    return;
  }

  const userCol = await getUserCollection();
  const users = await userCol
    .find({
      username: {
        $in: Array.from(mentions),
      },
    })
    .toArray();

  for (const user of users) {
    if (user.emailVerified && (user.notification?.mention ?? true)) {
      mailService.sendCommentMentionEmail({
        email: user.email,
        postType,
        postUid,
        content,
        contentType,
        mentionedUser: user.username,
        author,
        commentHeight,
      });
    }
  }
}

async function postComment(postId, content, contentType, author) {
  const chainMotion = await findMotion(postId);
  if (!chainMotion) {
    throw new HttpError(404, "Motion does not found");
  }

  const [postCol, post, postType] = await findMotionPost(chainMotion);
  if (!post) {
    throw new HttpError(404, "Post does not found");
  }

  const postObjId = post._id;

  const userCol = await getUserCollection();
  const postAuthor = await userCol.findOne({ _id: post.author });
  post.author = postAuthor;

  const commentCol = await getCommentCollection();
  const height = await commentCol.countDocuments({ [postType]: postObjId });

  const now = new Date();

  const newComment = {
    [postType]: postObjId,
    content: contentType === ContentType.Html ? safeHtml(content) : content,
    contentType,
    contentVersion: "2",
    author: author._id,
    height: height + 1,
    createdAt: now,
    updatedAt: now,
  };
  const result = await commentCol.insertOne(newComment);

  if (!result.acknowledged) {
    throw new HttpError(500, "Failed to create comment");
  }

  const newCommentId = result.insertedId;

  const updatePostResult = await postCol.updateOne(
    { _id: postObjId },
    {
      $set: {
        lastActivityAt: new Date(),
      },
    }
  );

  if (!updatePostResult.acknowledged) {
    throw new HttpError(500, "Unable to udpate post last activity time");
  }

  const mentions = extractMentions(content, contentType);
  processCommentMentions({
    postType,
    postUid: post.postUid,
    content: newComment.content,
    contentType: newComment.contentType,
    author: author.username,
    commentHeight: newComment.height,
    mentions,
  }).catch(console.error);

  if (post.author && !author._id.equals(post.author._id)) {
    if (
      post.author.emailVerified &&
      (post.author.notification?.reply ?? true)
    ) {
      mailService.sendReplyEmail({
        email: post.author.email,
        replyToUser: post.author.username,
        postType,
        postUid: post.postUid,
        content: newComment.content,
        contentType: newComment.contentType,
        author: author.username,
        commentHeight: newComment.height,
      });
    }
  }

  return newCommentId;
}

async function getComments(postId, page, pageSize) {
  const chainMotion = await findMotion(postId);
  if (!chainMotion) {
    throw new HttpError(404, "Motion does not found");
  }

  const [, post, postType] = await findMotionPost(chainMotion);
  const q = { [postType]: post._id };

  const commentCol = await getCommentCollection();
  const total = await commentCol.count(q);

  if (page === "last") {
    const totalPages = Math.ceil(total / pageSize);
    page = Math.max(totalPages, 1);
  }

  const comments = await commentCol
    .find(q)
    .sort({ createdAt: 1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  const businessDb = await getBusinessDb();
  const reactions = await businessDb.lookupMany({
    from: "reaction",
    for: comments,
    as: "reactions",
    localField: "_id",
    foreignField: "comment",
  });

  await lookupUser([
    { for: comments, localField: "author" },
    { for: reactions, localField: "user" },
  ]);

  return {
    items: comments,
    total,
    page,
    pageSize,
  };
}

module.exports = {
  updatePost,
  getMotionsByChain,
  getMotionById,
  getActiveMotionsOverview,
  setPostReaction,
  unsetPostReaction,
  postComment,
  getComments,
};
