import { Drawer, Grid, Skeleton } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  REFETCH_CHATS
} from "../../constant/event";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getOrSaveFromStorage } from "../../lib/features";
import { useMyChatsQuery } from "../../redux/api/api";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import DeleteChatMenu from "../Dialogs/DeleteChatMenu";
import Header from "../shared/Header";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";

const AppLayout = () => (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const params = useParams();
    const socket = getSocket();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dispatch = useDispatch();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const deleteMenuAnchor = useRef(null);
    const chatId = params.chatId;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isMobile } = useSelector((state) => state.misc);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { newMessagesAlert } = useSelector((state) => state.chat);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useErrors([{ isError, error }]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const newMessageAlertListener = useCallback(
      (data) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks

        if (data.chatId === params.chatId) return;

        dispatch(setNewMessagesAlert(data));
      },
      [chatId, dispatch]
    );

    const handelMobileClose = () => {
      dispatch(setIsMobile(false));
    };
    const handleDeleteChat = (e, chatId, groupChat) => {
      e.preventDefault();
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);
    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestHandler,
      [REFETCH_CHATS]: refetchListener,
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSocketEvents(socket, eventHandlers);

    return (
      <>
        <Title />
        <Header />
        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />
        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handelMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.data?.chats}
              chatId={chatId}
              newMessagesAlert={[
                {
                  chatId,
                  count: 4,
                },
              ]}
              onlineUsers={[1, 2]}
              handleDeleteChat={handleDeleteChat}
            />
          </Drawer>
        )}
        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.data?.chats}
                chatId={chatId}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={[1, 2]}
                handleDeleteChat={handleDeleteChat}
              />
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            lg={6}
            height={"100%"}
            // bgcolor={"primary.main"}
          >
            <WrappedComponent {...props} chatId={chatId} />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
            height={"100%"}
          >
            <Profile />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout; // Make sure to export the AppLayout component as default
