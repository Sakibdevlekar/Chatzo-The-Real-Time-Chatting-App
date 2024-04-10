import { Stack, ListItem, Avatar, Typography, IconButton } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { memo } from "react";

// eslint-disable-next-line react/prop-types
const UserItem = ({ user, handler, handlerIsLoading }) => {
  // eslint-disable-next-line react/prop-types, no-unused-vars
  const { name, _id, avatar } = user;
  return (
    <ListItem >
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={avatar} />
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
        <IconButton
          size="small"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
        >
          <AddIcon />
        </IconButton>
      </Stack>
    </ListItem>
  );
};

export default memo(UserItem);
