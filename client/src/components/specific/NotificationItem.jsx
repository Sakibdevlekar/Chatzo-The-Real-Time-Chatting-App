import { Avatar, Button, ListItem, Stack, Typography } from "@mui/material";
import { memo } from "react";
import { transformImage } from "../../lib/features";

// eslint-disable-next-line react/display-name, react/prop-types, no-unused-vars
const NotificationItems = memo(({ sender, _id, handler }) => {
  // eslint-disable-next-line react/prop-types
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={transformImage(avatar, 1000)} />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {name}
        </Typography>
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
        >
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default NotificationItems;
