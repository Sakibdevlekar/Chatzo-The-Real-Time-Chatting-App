import { Avatar, Stack } from "@mui/material";
import AvatarCard from "../../components/shared/AvatarCard";

import { useEffect, useState } from "react";
import Table from "../../components/shared/Table";
import { transformImage } from "../../lib/features";
import { dashboardData } from "../../constant/SampleData";
import AdminLayout from "../../components/Layout/AdminLayout";

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
      return (
        <Avatar
          sx={{ margin: "0.3rem" }}
          alt={params.row.name}
          src={params.row.avatar}
        />
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
      return (
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
          <Avatar sx={{margin:"0.3rem"}} alt={params.row.name} src={params.row.avatar} />
          <span>{params.row.creator.name}</span>
        </Stack>
      );
    },
  },
];

const GroupManagement = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(
      dashboardData.groups.map((group) => ({
        ...group,
        id: group._id,
        // avatar: group.avatar.map((i) => transformImage(i, 50)),
      }))
    );
  }, []);

  return (
    <AdminLayout>
      {<Table heading={"All Groups"} columns={columns} rows={rows} />}
    </AdminLayout>
  );
};

export default GroupManagement;
