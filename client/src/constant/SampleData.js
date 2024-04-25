export const sampleChats = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "john doe",
    _id: 1,
    groupChat: false,
    index: 0,
    members: [1, 2],
  },
  {
    avatar: [
      "https://www.w3schools.com/howto/img_avatar2.png",
      "https://www.w3schools.com/howto/img_avatar.png",
      "https://www.w3schools.com/w3images/avatar6.png",
    ],
    name: "john boi",
    _id: 2,
    groupChat: true,
    index: 0,
    members: [1, 2],
  },
];

export const sampleUser = [
  {
    avatar: "https://www.w3schools.com/howto/img_avatar.png",
    name: "john doe",
    _id: 1,
  },
  {
    avatar: "https://www.w3schools.com/howto/img_avatar2.png",
    name: "john boi",
    _id: 2,
  },
  {
    avatar: "https://www.w3schools.com/howto/img_avatar.png",
    name: "john doe",
    _id: 3,
  },
  {
    avatar: "https://www.w3schools.com/howto/img_avatar2.png",
    name: "john boi",
    _id: 4,
  },
];

export const sampleNotification = [
  {
    sender: {
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      name: "john doe",
    },
    _id: 1,
  },
  {
    sender: {
      avatar: "https://www.w3schools.com/howto/img_avatar2.png",
      name: "john boi",
    },
    _id: 2,
  },
];

export const sampleMessage = [
  {
    attachments: [
      {
        public_id: "fdgcc",
        url: "https://www.w3schools.com/howto/img_avatar2.png",
      },
    ],
    content:
      "cd   xghdhuwgsdyfcvtsyfdycvsxgvtsdcfv j bxhghdv xghdhuwgsdyfcvtsyfdycvsxgvtsdcfv jbxhghdv   xghdhuwgsdyfcvtsyfdycvsxgvtsdcfv j bxhghdv xghdhuwgsdyfcvtsyfdycvsxgvtsdcfv jbxhghdv bxhghdv xghdhuwgsdyfcvtsyfdycvsxgvtsdcfv jbxhghdv   v bhjghjjg hhjghjgghjg hjghjhhj hhfjfhj hfhfhj ghfhjfhj ghfhj jhjghjj hjgyjj gtdvctdv",
    _id: "bsdgfcvrfgdf",
    sender: {
      _id: "user._id",
      name: "tetu",
    },
    chat: "chatId",
    createdAt: "2024-04-20T10:00:00Z",
  },
  {
    attachments: [
      {
        public_id: "fdgcc",
        url: "https://videos.pexels.com/video-files/20770858/20770858-hd_1080_1920_30fps.mp4",
      },
    ],
    content: "sdfghjxghjhcvhjsxcvh chbhc",
    _id: "bsdgfcvrfgdf",
    sender: {
      _id: "wertyuio",
      name: "tetu",
    },
    chat: "chatId",
    createdAt: "2024-04-20T10:00:00Z",
  },
  {
    attachments: [
      {
        public_id: "fdgcc",
        url: "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3",
      },
    ],
    content:
      "cd   xghdhuwgsdyfcvtsyfdycvsxgvtsdcfv j bxhghdv xghdhuwgsdyfcvtsyfdycvsxgvtsdcfv jbxhghdv   xghdhuwgsdyfcvtsyfdycvsxgvtsdcfv j bxhghdv xghdhuwgsdyfcvtsyfdycvsxgvtsdcfv jbxhghdv bxhghdv xghdhuwgsdyfcvtsyfdycvsxgvtsdcfv jbxhghdv   v bhjghjjg hhjghjgghjg hjghjhhj hhfjfhj hfhfhj ghfhjfhj ghfhj jhjghjj hjgyjj gtdvctdv",
    _id: "bsdgfcvrfgdf",
    sender: {
      _id: "user._id",
      name: "tetu",
    },
    chat: "chatId",
    createdAt: "2024-04-20T10:00:00Z",
  },
];

export const dashboardData = {
  users: [
    {
      _id: 1,
      name: "john doe",
      username: "john",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      friends: 20,
      groups: 5,
    },
    {
      _id: 2,
      name: "kajal patil",
      username: "kaju",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      friends: 100,
      groups: 2,
    },
  ],
  groups: [
    {
      _id: 1,
      name: "The Boys",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      groupChat: false,
      members: [
        "https://www.w3schools.com/howto/img_avatar2.png",
        "https://www.w3schools.com/howto/img_avatar.png",
        "https://www.w3schools.com/w3images/avatar6.png",
      ],
      totalMembers: 3,
      totalMessages: 40,
      creator: {
        name: "Sd",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
    },
    {
      _id: 2,
      name: "Electrets",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      groupChat: false,
      members: [
        "https://www.w3schools.com/howto/img_avatar2.png",
        "https://www.w3schools.com/howto/img_avatar.png",
        "https://www.w3schools.com/w3images/avatar6.png",
      ],
      totalMembers: 3,
      totalMessages: 20,
      creator: {
        name: "Sd",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
    },
  ],
};
