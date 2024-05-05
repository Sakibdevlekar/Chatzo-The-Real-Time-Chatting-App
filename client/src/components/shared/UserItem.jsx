/* eslint-disable react/prop-types */
import { Stack, ListItem, Avatar, Typography, IconButton } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { memo } from "react";
import { transformImage } from "../../lib/features";

// eslint-disable-next-line react/prop-types, react-refresh/only-export-components
const UserItem = ({
  // eslint-disable-next-line react/prop-types
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  // eslint-disable-next-line no-unused-vars
  styling = {},
}) => {
  // eslint-disable-next-line react/prop-types, no-unused-vars
  const { name, _id, avatar } = user;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        border={`0.1rem solid #5557583B`}
        borderRadius={"0.5rem"}
        padding={"1rem"}
        {...styling}
      >
        <Avatar src={transformImage(avatar,1000)} />
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
            bgcolor: isAdded ? "error.main" : "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: isAdded ? "error.dark" : "primary.dark",
            },
          }}
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
        >
          {isAdded ? <RemoveIcon /> : <AddIcon />}
        </IconButton>
      </Stack>
    </ListItem>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default memo(UserItem);
