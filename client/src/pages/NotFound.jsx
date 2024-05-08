import { Stack, Typography } from "@mui/material";
import NotFoundImg from "../assets/404.svg";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Stack
      alignItems="center"
      // justifyContent="center"
      height="100vh"
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
        404 Page Not Found
      </Typography>
      <img
        src={NotFoundImg}
        alt="Not Found"
        style={{
          maxWidth: "400px",
          maxHeight: "400px",
          width: "auto",
          height: "auto",
          display: "block",
        }}
      />
      <Link style={{marginTop:"5rem"}} to={"/"}>Go Back To Home</Link>
    </Stack>
  );
}

export default NotFound;
