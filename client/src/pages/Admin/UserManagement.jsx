import { useFetchData } from "6pp";
import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";
import Table from "../../components/shared/Table";
import { server } from "../../constant/config";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";

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
  const { loading, data, error } = useFetchData(
    `${server}/admin/users`,
    "admin-users"
  );
  const userData = data?.data;

  // console.log(error);
  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  useEffect(() => {
    if (userData) {
      setRows(
        userData.map((user) => ({
          ...user,
          id: user._id,
          avatar: transformImage(user?.avatar, 3000),
        }))
      );
    }
  }, [userData]);

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table heading={"All Users"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default UserManagement;
