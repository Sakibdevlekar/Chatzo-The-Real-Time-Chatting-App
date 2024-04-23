import {
  Dashboard as DashboardIcon,
  ManageAccounts as ManageAccountsIcon,
  Groups as GroupsIcon,
  Forum as ForumIcon,
} from "@mui/icons-material";

export const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users-management",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Groups",
    path: "/admin/groups-management",
    icon: <GroupsIcon />,
  },
  {
    name: "Message",
    path: "/admin/message-management",
    icon: <ForumIcon />,
  },
];
