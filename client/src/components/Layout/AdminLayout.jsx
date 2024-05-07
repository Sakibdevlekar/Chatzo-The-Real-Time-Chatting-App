import {
  Close as CloseIcon,
  ExitToApp as ExitToAppIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as LikeComponent, Navigate, useLocation } from "react-router-dom";
import { adminTabs } from "../../pages/Admin/AdminTabs";
import { adminLogout } from "../../redux/thunks/admin";

const Link = styled(LikeComponent)`
  text-decoration: none;
  border-radius: 2rem;
  color: black;
  padding: 1rem 2rem;
  &:hover {
    color: rgba(234, 112, 112, 1);
  }
`;

// eslint-disable-next-line react/prop-types
const SideBar = ({ w = "100%" }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(adminLogout());
  };

  return (
    <Stack width={w} direction={"column"} p={"1rem"} spacing={"3rem"}>
      <Typography variant="h5" textTransform={"uppercase"}>
        Admin
      </Typography>
      <Stack spacing={"1rem"}>
        {adminTabs.map((tab, index) => (
          <Link
            key={index}
            to={tab.path}
            sx={
              location.pathname === tab.path && {
                bgcolor: "#ea7070",
                color: "white",
                "&:hover": {
                  bgcolor: "#ea7070",
                  color: "white",
                },
              }
            }
          >
            <Stack direction={"row"} alignContent={"center"} spacing={"1rem"}>
              {tab.icon}
              <Typography fontWeight={700}>{tab.name}</Typography>
            </Stack>
          </Link>
        ))}
        <Link onClick={logoutHandler}>
          <Stack direction={"row"} alignContent={"center"} spacing={"1rem"}>
            <ExitToAppIcon />
            <Typography fontWeight={700}>Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};

// eslint-disable-next-line react/prop-types
const AdminLayout = ({ children }) => {
  const { isAdmin } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);

  const handleMobileView = () => setIsMobile(!isMobile);

  const handleDrawerClose = () => setIsMobile(false);
  if (!isAdmin) return <Navigate to={"/admin"} />;

  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        <IconButton onClick={handleMobileView}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
        <SideBar />
      </Grid>
      <Grid
        item
        xs={12}
        md={8}
        lg={9}
        sx={{
          bgcolor: "rgba(232, 236, 241)",
        }}
      >
        {children}
      </Grid>

      <Drawer open={isMobile} onClose={handleDrawerClose}>
        <SideBar w="50vw" />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
