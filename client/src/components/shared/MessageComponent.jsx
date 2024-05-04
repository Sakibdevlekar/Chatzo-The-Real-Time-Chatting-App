/* eslint-disable react/prop-types */
import { memo } from "react";
import colors from "../../constant/color";
import { Box, Typography } from "@mui/material";
import moment from "moment";
import { fileFormate } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";

// eslint-disable-next-line react/prop-types
const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();
  return (
    <div
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        background: colors.light,
        color: colors.dark,
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content",
      }}
    >
      {
        <Typography
          color={!sameSender ? colors.lightBlue : colors.orange}
          fontWeight={"600"}
          flexWrap={"wrap"}
          variant="caption"
        >
          {!sameSender ? sender?.name : "You"}
        </Typography>
      }
      {content && <Typography>{content}</Typography>}
      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormate(url);
          return (
            <Box key={index}>
              <a
                href={url}
                target="_blank"
                download
                style={{
                  color: colors.dark,
                }}
              >
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}
      <Typography variant="caption" color={colors.darkGray} fontWeight={"700"}>
        {timeAgo}
      </Typography>
    </div>
  );
};

export default memo(MessageComponent);
