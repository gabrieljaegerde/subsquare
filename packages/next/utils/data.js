export const OverviewData = [
  {
    category: "Referenda",
    items: [
      {
        index: 12,
        time: "0d 6h 0m",
        comments: 5,
        title:
          "Consectetur fermentum interdum volutpat id a consectetur elementum pulvinar.",
        author: "Sed accumsan",
        type: "Council",
        status: "Started",
      },
    ],
  },
  {
    category: "Proposals",
    items: [
      {
        index: 50,
        comments: 5,
        title:
          "Turpis pellentesque sed nunc, adipiscing sed orci lectus sed lacus. Luctus eget pretium vivamus cras sapien diam egestas.",
        author: "Mauris fermentum",
        type: "Treasury",
        status: "Started",
      },
    ],
  },
  {
    category: "Tips",
    items: [
      {
        index: 77,
        comments: 5,
        title:
          "Et odio praesent mattis vivamus in. Felis, posuere sit enim luctus luctus in.",
        author: "Mi lorem",
        type: "Council",
        status: "Started",
      },
    ],
  },
  {
    category: "Discussions",
    items: [
      {
        time: "6d",
        comments: 10,
        title:
          "Et odio praesent mattis vivamus in. Felis, posuere sit enim luctus luctus in.",
        author: "Mi lorem",
        status: "Started",
      },
    ],
  },
];

export const discussionData = {
  category: "Proposals",
  items: [
    {
      time: "6d",
      comments: 5,
      title:
        "Turpis pellentesque sed nunc, adipiscing sed orci lectus sed lacus. Luctus eget pretium vivamus cras sapien diam egestas.",
      author: "Mauris fermentum",
      status: "Started",
    },
    {
      time: "6d",
      comments: 5,
      title:
        "Pharetra enim tristique odio massa turpis quis amet. Nascetur pellentesque eu pellentesque cursus.",
      author: "Adipiscing hendrerit",
      status: "Started",
    },
    {
      time: "6d",
      comments: 5,
      title:
        "Nisi urna, scelerisque porttitor nisi, leo. Scelerisque hac sollicitudin mauris amet in elit est aliquet volutpat.",
      author: "Porttitor imperdiet",
      status: "Started",
    },
    {
      time: "6d",
      comments: 5,
      title: "Sit sit nisl, purus egestas vulputate fringilla volutpat nunc.",
      author: "Diam amet",
      status: "Started",
    },
  ],
};

export const detailData = {
  index: 12,
  comments: 5,
  title:
    "Malesuada placerat vestibulum adipiscing vestibulum facilisis mauris. Lectus praesent in egestas dictumst ligula in est.",
  author: "Sed accumsan",
  type: "Council",
  status: "Propose Bounty",
};

export const timelineData = [
  {
    time: "2020-12-12 09:43:41",
    status: { value: "Propose Bounty", color: "#2196F3" },
    data: {
      Proposer: { name: "Sed accumsan", type: "account" },
      Value: "50.00 KSM",
      Title: "Eget at quisque nibh tellus id vulputate laoreet ornare in.",
    },
  },
  [
    {
      time: "2020-12-12 09:43:41",
      status: { value: "Motion #289", color: "#6848FF" },
      voting: {
        proposeCurator: "Kathryn",
        curator: "Jaco",
        fee: "22.22 KSM",
        total: 12,
        votes: [
          true,
          true,
          true,
          false,
          false,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
      },
    },
    {
      time: "2020-12-12 09:43:41",
      status: { value: "Vote", color: "#6848FF" },
      voteResult: {
        name: "Huntch",
        value: true,
      },
    },
    {
      time: "2020-12-12 09:43:41",
      status: { value: "Vote", color: "#6848FF" },
      voteResult: {
        name: "Kathryn",
        value: false,
      },
    },
    {
      time: "2020-12-12 09:43:41",
      status: { value: "Vote", color: "#6848FF" },
      data: { Approved: "" },
    },
  ],
  // {
  //   time: "2020-12-12 09:43:41",
  //   status: { value: "Bounty Rejected", color: "#F44336" },
  //   data: {
  //     "Closed by": { name: "OpenSquare", type: "account" },
  //     "Proposer slashed": "50.00 KSM",
  //   },
  // },
];
