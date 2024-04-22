import AppLayout from "../components/Layout/AppLayout";
import { Typography, Box } from "@mui/material";
import MessageSvg from "../assets/message.svg";

function Home() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      // justifyContent="center"
      height="100%"
      bgcolor="rgba(232, 236, 241)"
      overflow="hidden"
    >
      <Typography
        paddingBottom={"2rem"}
        variant="h5"
        textAlign="center"
        marginTop={"5rem"}
        fontWeight={"600"}
      >
        Select a friend to chat
      </Typography>

      <Box display="flex" alignItems="center" justifyContent="center">
        <img
          src={MessageSvg}
          alt="Message Logo"
          style={{
            maxWidth: "300px",
            maxHeight: "300px",
            width: "auto",
            height: "auto",
            display: "block",
          }}
        />
      </Box>
    </Box>
  );
}

export default AppLayout()(Home);
