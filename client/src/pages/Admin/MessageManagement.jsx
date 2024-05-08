import { useFetchData } from "6pp";
import { Avatar, Box, Skeleton, Stack, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import RenderAttachment from "../../components/shared/RenderAttachment";
import Table from "../../components/shared/Table";
import colors from "../../constant/color";
import { server } from "../../constant/config";
import { useErrors } from "../../hooks/hook";
import { fileFormate, transformImage } from "../../lib/features";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const { attachments } = params.row;
      return attachments?.length > 0 ? (
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormate(url);
          return (
            <Box key={index} marginTop={"1.5rem"}>
              <a
                href={url}
                download
                target="_blank"
                style={{
                  color: colors.dark,
                }}
              >
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })
      ) : (
        <Typography fontWeight={"550"} margin={"5rem 2rem"}>
          No Attachments
        </Typography>
      );
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Send By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      return (
        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
          <Avatar sx={{width:"4rem"}} alt={params.row.sender.name} src={params.row.sender.avatar} />
          <span>{params.row.sender.name}</span>
        </Stack>
      );
    },
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
    renderCell: (params) => {
      const isGroupChat = params.row.groupChat;
      return (
        <Stack
          alignItems={"center"}
          justifyContent={"center"}
          marginTop={"5rem"}
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
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];
const MessageManagement = () => {
  const [rows, setRows] = useState([]);

  const { loading, data, error } = useFetchData(
    `${server}/admin/messages`,
    "dashboard-messages"
  );
  const messageData = data?.data;
  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);
  useEffect(() => {
    if (messageData) {
      setRows(
        messageData?.map((message) => ({
          ...message,
          id: message._id,
          sender: {
            name: message.sender.name,
            avatar: transformImage(message.sender.avatar, 3000),
          },
          createdAt: moment(message.createdAt).format(
            "MMMM Do YYYY, h:mm:ss a"
          ),
        }))
      );
    }
  }, [messageData]);

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton />
      ) : (
        <Table
          rowHeight={200}
          heading={"All Messages"}
          columns={columns}
          rows={rows}
        />
      )}
    </AdminLayout>
  );
};

export default MessageManagement;
