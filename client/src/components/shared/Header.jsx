import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Suspense, lazy, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import colors from "../../constant/color";
import { server } from "../../constant/config";
import { userNotExists } from "../../redux/reducers/auth.reducer";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";
const SearchDialog = lazy(() => import("../specific/Search"));
const Notification = lazy(() => import("../specific/Notification"));
const NewGroup = lazy(() => import("../specific/NewGroup"));

function Header() {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);

  const handelMobile = () => {
    dispatch(setIsMobile(true));
  };
  const openSearchDialog = () => {
    dispatch(setIsSearch(true));
  };

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };

  const navigateToGroups = () => {
    Navigate("/groups");
  };

  const handelNotificationOpen = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const LogoutHandler = async () => {
    try {
      toast.loading("Please wait your request being processed", { id: 1 });
      const { data } = await axios.get(`${server}/user/logout`, {
        withCredentials: true,
      });
      if (data.statusCode === 200) {
        dispatch(userNotExists());
        toast.success(data.message, { id: 1 });
      } else {
        toast.error(data.message, { id: 1 });
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while trying to logout",
        { id: 1 }
      );
    }
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
              Chatzo
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
                value={notificationCount}
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
      {isNotification && (
        <Suspense fallback={<Backdrop open={true} />}>
          <Notification />
        </Suspense>
      )}
    </>
  );
}

// eslint-disable-next-line react/prop-types
const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? <Badge badgeContent={value} color="error"></Badge> : null}
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
