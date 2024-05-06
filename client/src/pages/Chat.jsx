import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { IconButton, Skeleton, Stack, Tooltip } from "@mui/material";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileMenu from "../components/Dialogs/FileMenu";
import AppLayout from "../components/Layout/AppLayout";
import { InputBox } from "../components/Styles/StyledComponents";
import MessageComponent from "../components/shared/MessageComponent";
import colors from "../constant/color";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constant/event.js";
import { useErrors, useSocketEvents } from "../hooks/hook.jsx";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api.js";
import { getSocket } from "../socket";
import { useInfiniteScrollTop } from "6pp";
import { setIsFileMenu } from "../redux/reducers/misc.js";
import { removeNewMessagesAlert } from "../redux/reducers/chat.js";
import { TypingLoader } from "../components/Layout/Loaders.jsx";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components, react/prop-types
function Chat({ chatId }) {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [page, setPage] = useState(1);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  const typingTimeout = useRef(null);
  const bottomRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk?.data?.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk?.data?.data?.messages
  );

  const AllMessages = [...oldMessages, ...messages];
  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];
  // console.log(chatDetails?.data?.data?.members);
  const members = chatDetails?.data?.data?.members;
  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);
  const newMessagesHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data?.message]);
    },
    [chatId]
  );
  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );
  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);
  };
  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const handelFileOpen = (e) => {
    e.preventDefault();
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    //Emitting message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesHandler,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);

  useEffect(() => {
    socket.on(NEW_MESSAGE, newMessagesHandler);
    return () => {
      socket.off(NEW_MESSAGE, newMessagesHandler);
    };
  }, []);

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
        {userTyping && <TypingLoader />}
        <div ref={bottomRef} style={{ addingBottom: "5rem" }} />
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
              onClick={handelFileOpen}
            >
              <AttachFileIcon />
            </IconButton>
          </Tooltip>

          <InputBox
            placeholder="Type message here..."
            value={message}
            onChange={messageOnChange}
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
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default AppLayout()(Chat);
