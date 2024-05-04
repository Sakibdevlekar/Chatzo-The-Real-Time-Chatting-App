import { IconButton, Tooltip, Stack, Skeleton } from "@mui/material";
import AppLayout from "../components/Layout/AppLayout";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import colors from "../constant/color";
import { InputBox } from "../components/Styles/StyledComponents";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import FileMenu from "../components/Dialogs/FileMenu";
import { sampleMessage } from "../constant/SampleData";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import { NEW_MESSAGE } from "../constant/event.js";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api.js";
import { useErrors, useSocketEvents } from "../hooks/hook.jsx";
import { useSelector } from "react-redux";

// eslint-disable-next-line react-refresh/only-export-components, react/prop-types
function Chat({ chatId }) {
  const { user } = useSelector((state) => state.auth);
  const socket = getSocket();
  const containerRef = useRef(null);
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });
  console.log(oldMessagesChunk?.data?.data?.messages);
  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];
  // console.log(chatDetails?.data?.data?.members);
  const members = chatDetails?.data?.data?.members;

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    //Emitting message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const newMessagesHandler = useCallback((data) => {
    setMessages((prev) => [...prev, data?.message]);
  }, []);

  const eventHandler = { [NEW_MESSAGE]: newMessagesHandler };

  useSocketEvents(socket, eventHandler);

  useEffect(() => {
    socket.on(NEW_MESSAGE, newMessagesHandler);
    return () => {
      socket.off(NEW_MESSAGE, newMessagesHandler);
    };
  }, []);
  const oldMessages = oldMessagesChunk?.data?.data?.messages || [];
  const AllMessages = [...oldMessages, ...messages];
  console.log(AllMessages);
  useErrors(errors);
  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
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
        {AllMessages.map((message, index) => (
          <MessageComponent key={index} message={message} user={user.data} />
        ))}
      </Stack>
      <form
        style={{
          height: "10%",
        }}
        onSubmit={sendMessage}
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

          <InputBox
            placeholder="Type message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

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

// eslint-disable-next-line react-refresh/only-export-components
export default AppLayout()(Chat);
