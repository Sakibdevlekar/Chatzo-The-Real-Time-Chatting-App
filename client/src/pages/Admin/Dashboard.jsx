import { useFetchData } from "6pp";
import {
  AdminPanelSettings,
  Forum as ForumIcon,
  Group as GroupIcon,
  Notifications as NotificationIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import AdminLayout from "../../components/Layout/AdminLayout";
import {
  CurveButton,
  SearchFiled,
} from "../../components/Styles/StyledComponents";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import { server } from "../../constant/config";
import { useErrors } from "../../hooks/hook";
const AppBar = (
  <Paper
    elevation={3}
    sx={{ padding: "2rem", margin: "3.5rem 0", borderRadius: "1rem" }}
  >
    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
      <AdminPanelSettings sx={{ fontSize: "3rem" }} />
      <SearchFiled placeholder="Search" />
      <CurveButton>Search</CurveButton>
      <Box flexGrow={1} />

      <Typography
        display={{
          xs: "none",
          lg: "block",
        }}
        color={"rgba(0,0,0,0.7"}
        textAlign={"center"}
      >
        {moment().format("dddd, D MMMM YYYY")}
      </Typography>
      <NotificationIcon />
    </Stack>
  </Paper>
);

const Dashboard = () => {
  const { loading, data, error } = useFetchData(
    `${server}/admin/stats`,
    "dashboard-stats"
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);
  const Widgets = (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      spacing={"2rem"}
      justifyContent={"space-between"}
      alignItems={"center"}
      margin={"2rem 0"}
    >
      <WidgetsComponent
        title={"Users"}
        value={data?.data?.usersCount}
        Icon={<PersonIcon />}
      />
      <WidgetsComponent
        title={"Chats"}
        value={data?.data?.totalChatsCount}
        Icon={<GroupIcon />}
      />
      <WidgetsComponent
        title={"Messages"}
        value={data?.data?.messagesCount}
        Icon={<ForumIcon />}
      />
    </Stack>
  );
  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Container component={"main"}>
          {AppBar}

          <Stack
            direction={{
              xs: "column",
              lg: "row",
            }}
            flexWrap={"wrap"}
            justifyContent={"center"}
            alignContent={{
              xs: "center",
              lg: "stretch",
            }}
            sx={{
              gap: "2rem",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: "2rem 3.5rem",
                width: "100%",
                borderRadius: "1rem",
                maxWidth: "45rem",
              }}
            >
              <Typography variant="h4" margin={"2rem 0"}>
                Last Messages
              </Typography>
              {/*Line char Component*/}
              <LineChart value={data?.data?.messagesChart} />
            </Paper>
            <Paper
              elevation={3}
              sx={{
                padding: "1rem",
                borderRadius: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: { xs: "100%", sm: "50%" },
                position: "relative",
                ...(window.innerWidth <= 600 && { width: "100%" }),
                maxWidth: "25rem",
              }}
            >
              <DoughnutChart
                labels={["Single Chats", "Group Chats"]}
                value={[
                  data?.data?.totalChatsCount - data?.data?.groupsCount || 0,
                  data?.data?.groupsCount || 0,
                ]}
              />

              <Stack
                position={"absolute"}
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={"0.5 rem"}
                width={"100%"}
                height={"100%"}
              >
                <GroupIcon /> <Typography>Vs</Typography> <PersonIcon />
              </Stack>
            </Paper>
          </Stack>

          {Widgets}
        </Container>
      )}
    </AdminLayout>
  );
};

// eslint-disable-next-line react/prop-types
const WidgetsComponent = ({ title, value, Icon }) => (
  <Paper
    elevation={3}
    sx={{
      padding: "2rem",
      margin: "2rem 0",
      borderRadius: "1rem",
      width: "20rem",
    }}
  >
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography
        sx={{
          color: "rgba(0,0,0,0.9)",
          borderRadius: "50%",
          border: "5px solid rgba(0,0,0,0.9)",
          width: "5rem",
          height: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {value}
      </Typography>
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        {Icon}
        <Typography>{title}</Typography>
      </Stack>
    </Stack>
  </Paper>
);

export default Dashboard;
