import { useFetchData } from "6pp";
import { Avatar, Skeleton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";
import Table from "../../components/shared/Table";
import { server } from "../../constant/config";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";
import colors from "../../constant/color";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 50,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 100,
    renderCell: (params) => {
      return <AvatarCard avatar={params.row.avatar} max={100} />;
    },
  },
  {
    field: "groupChat",
    headerName: "Group",
    headerClassName: "table-header",
    width: 100,
    renderCell: (params) => {
      const isGroupChat = params.row.groupChat;
      return (
        <Stack
          alignItems={"center"}
          justifyContent={"center"}
          marginTop={"0.5rem"}
        >
          {isGroupChat ? (
            <Typography
              style={{
                color: "#065e49",
                backgroundColor: colors.success,
                padding: "0.2rem 0.9rem",
                borderRadius: "5px%",
              }}
            >
              Yes
            </Typography>
          ) : (
            <Typography
              style={{
                color: "#003768",
                backgroundColor: "#cafdf5",
                padding: "0.2rem 0.9rem",
                borderRadius: "5px",
              }}
            >
              No
            </Typography>
          )}
        </Stack>
      );
    },
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      return <AvatarCard avatar={params.row.members} max={100} />;
    },
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => {
      console.log(params.row);
      return (
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
          <Avatar
            sx={{ margin: "0.3rem" }}
            alt={params.row.creator.name}
            src={params.row.creator.avatar}
          />
          <span>{params.row.creator.name}</span>
        </Stack>
      );
    },
  },
];

const GroupManagement = () => {
  const [rows, setRows] = useState([]);
  const { loading, data, error } = useFetchData(
    `${server}/admin/chats`,
    "users"
  );
  const chatData = data?.data;
  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  useEffect(() => {
    if (chatData) {
      setRows(
        chatData?.chats.map((group) => ({
          ...group,
          id: group._id,
          avatar: group.avatar.map((i) => transformImage(i, 3000)),
          members: group.members.map((i) => transformImage(i.avatar, 3000)),
          creator: {
            name: group.creator.name,
            avatar: transformImage(group.creator.avatar, 3000),
          },
        }))
      );
    }
  }, [chatData]);

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton />
      ) : (
        <Table heading={"All Chats"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default GroupManagement;
