import AppLayout from "../components/Layout/AppLayout";
import { Typography, Box } from "@mui/material";

function Home() {
  return (
    <Box height={"100%"} bgcolor={"rgba(232, 236, 241)"}>
      <Typography p={"2rem"} variant="h5" textAlign={"center"}>
        Select a friend to chat
      </Typography>
    </Box>
  );
}

export default AppLayout()(Home); // Apply the AppLayout HOC to Home component
