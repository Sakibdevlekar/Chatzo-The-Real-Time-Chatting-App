import AdminLayout from "../../components/Layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachment",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      return <AvatarCard alt={params.row.name} src={params.row.avatar} />;
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
        <Stack>
          <Avatar
            sx={{ margin: "0.3rem" }}
            alt={params.row.sender.name}
            src={params.row.sender.avatar}
          />
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
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];
const MessageManagement = () => {
  return (
    <AdminLayout>
      <div>MessageManagement</div>
    </AdminLayout>
  );
};

export default MessageManagement;
