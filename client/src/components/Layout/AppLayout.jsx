import Title from "../shared/Title";
import Header from "../shared/Header";
import { Drawer, Grid, Skeleton } from "@mui/material";
import ChatList from "../specific/ChatList";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { useMyChatsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "../../redux/reducers/misc";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getSocket } from "../../socket";
import {
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  REFETCH_CHATS,
} from "../../constant/event";
import { useCallback, useEffect, useState } from "react";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../lib/features";

const AppLayout = () => (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const params = useParams();
    const socket = getSocket();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const dispatch = useDispatch();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // const [chatId, setChatId] = useState(params.chatId);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // useEffect(() => {
    //   setChatId(params.chatId);
    // }, [params.chatId]);
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
    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handelMobileClose = () => {
      dispatch(setIsMobile(false));
    };
    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("Delete chat", _id, groupChat);
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const newMessageAlertListener = useCallback(
      (data) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks

        if (data.chatId === params.chatId) return;

        dispatch(setNewMessagesAlert(data));
      },
      [chatId, dispatch]
    );
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const refetchListener = useCallback(() => {
      refetch();
    }, [refetch]);
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
