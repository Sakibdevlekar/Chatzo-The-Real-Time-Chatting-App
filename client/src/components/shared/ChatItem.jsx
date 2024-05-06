import { Box, Stack, Typography } from "@mui/material";
import { memo } from "react";
import { Link } from "../Styles/StyledComponents";
import AvatarCard from "./AvatarCard";
// import AvatarCard from "./AvatarCard";
// import { motion } from "framer-motion";

const ChatItem = ({
  // eslint-disable-next-line react/prop-types, no-unused-vars
  avatar = [],
  // eslint-disable-next-line react/prop-types
  name,
  // eslint-disable-next-line react/prop-types
  _id,
  // eslint-disable-next-line react/prop-types
  groupChat = false,
  // eslint-disable-next-line react/prop-types
  sameSender,
  // eslint-disable-next-line react/prop-types
  isOnline,
  // eslint-disable-next-line react/prop-types
  newMessageAlert,
  // eslint-disable-next-line react/prop-types
  index = 0,
  // eslint-disable-next-line react/prop-types
  handleDeleteChat,
  // eslint-disable-next-line react/prop-types
}) => {
  return (
    <Link
      sx={{
        padding: "0",
      }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <div
        // initial={{ opacity: 0, y: "-100%" }}
        // whileInView={{ opacity: 1, y: 0 }}
        // transition={{ delay: 0.1 * index }}
        style={{
          display: "flex",
          gap: "5rem",
          alignItems: "center",
          backgroundColor: sameSender ? "black" : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative",
          padding: "1rem",
        }}
      >
        <AvatarCard  avatar={avatar}/>

        <Stack>
          <Typography>{name}</Typography>
          {newMessageAlert && (
            // eslint-disable-next-line react/prop-types
            <Typography>{newMessageAlert.count} New Message</Typography>
          )}
        </Stack>

        {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </div>
    </Link>
  );
};

export default memo(ChatItem);
