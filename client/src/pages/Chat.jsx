import { IconButton, Tooltip, Stack } from "@mui/material";
import AppLayout from "../components/Layout/AppLayout";
import { Fragment, useRef } from "react";
import colors from "../constant/color";
import { InputBox } from "../components/Styles/StyledComponents";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import FileMenu from "../components/Dialogs/FileMenu";
import { sampleMessage } from "../constant/SampleData";
import MessageComponent from "../components/shared/MessageComponent";
const user = {
  _id:"wertyuio",
  name:"lovely"

}

function Chat() {
  const containerRef = useRef(null);
  return (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={colors.grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {sampleMessage.map((message,index)=>(
          <MessageComponent key={index} message={message} user={user}/>
        ))}

      </Stack>
      <form
        style={{
          height: "10%",
        }}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          // alignItems={"center"}
          position={"relative"}
        >
          <Tooltip title={"Attach"}>
            <IconButton
              sx={{
                padding: "1rem",
                rotate: "30deg",
                position: "absolute",
              }}
            >
              <AttachFileIcon />
            </IconButton>
          </Tooltip>

          <InputBox placeholder="Type message here..." />

          <Tooltip title={"Send"}>
            <IconButton
              type="submit"
              sx={{
                backgroundColor: colors.orange,
                color: colors.light,
                marginLeft: "1rem",
                padding: "1rem",
                "&:hover": {
                  backgroundColor: colors.error,
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </form>
      <FileMenu />
    </Fragment>
  );
}

export default AppLayout()(Chat);
