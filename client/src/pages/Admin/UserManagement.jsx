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
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => {
      return <AvatarCard alt={params.row.name} avatar={[params.row.avatar]} />;
    },
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "User Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 150,
  },
];

const UserManagement = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(
      dashboardData.users.map((user) => ({
        ...user,
        id: user._id,
        avatar: transformImage(user.avatar, 50),
      }))
    );
  }, []);

  return (
    <AdminLayout>
      {<Table heading={"All Users"} columns={columns} rows={rows} />}
    </AdminLayout>
  );
};

export default UserManagement;
