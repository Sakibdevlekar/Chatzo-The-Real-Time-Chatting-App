import {
  AppBar,
  Typography,
  Toolbar,
  Box,
  IconButton,
  Tooltip,
  Backdrop,
} from "@mui/material";
import colors from "../../constant/color";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Suspense, useState, lazy } from "react";
const SearchDialog = lazy(() => import("../specific/Search"));
const Notification = lazy(() => import("../specific/Notification"));
const NewGroup = lazy(() => import("../specific/NewGroup"));

function Header() {
  const [isSearch, setIsSearch] = useState(false);
  const [isNotifications, setIsNotifications] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);

  const Navigate = useNavigate();
  const handelMobile = () => {
    console.log("mobile");
  };
  const openSearchDialog = () => {
    setIsSearch((prev) => !prev);
  };

  const openNewGroup = () => {
    setIsNewGroup((prev) => !prev);
  };

  const navigateToGroups = () => {
    Navigate("/groups");
  };

  const handelNotificationOpen = () => {
    setIsNotifications((prev) => !prev);
  };

  const LogoutHandler = () => {
    console.log("logout");
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            backgroundColor: colors.orange, // Adjust this to your color property
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Chatly
            </Typography>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <IconButton color="inherit" onClick={handelMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
              }}
            />
            <Box>
              <IconBtn
                title={"Search"}
                icon={<SearchIcon />}
                onClick={openSearchDialog}
              />
              <IconBtn
                title={"New Group"}
                icon={<AddIcon />}
                onClick={openNewGroup}
              />
              <IconBtn
                title={"Manage Group"}
                icon={<GroupIcon />}
                onClick={navigateToGroups}
              />
              <IconBtn
                title={"Notifications"}
                icon={<NotificationsIcon />}
                onClick={handelNotificationOpen}
              />
              <IconBtn
                title={"Logout"}
                icon={<LogoutIcon />}
                onClick={LogoutHandler}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {isSearch && (
        <Suspense fallback={<Backdrop open={true} />}>
          <SearchDialog />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open={true} />}>
          <NewGroup />
        </Suspense>
      )}
      {isNotifications && (
        <Suspense fallback={<Backdrop open={true} />}>
          <Notification />
        </Suspense>
      )}
    </>
  );
}

// eslint-disable-next-line react/prop-types
const IconBtn = ({ title, icon, onClick }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
