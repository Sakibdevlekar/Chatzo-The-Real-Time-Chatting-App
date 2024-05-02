import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";
import { transformImage } from "../../lib/features";
import toast from "react-hot-toast";

function notification() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isNotification } = useSelector((state) => state.misc);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [acceptRequest] = useAcceptFriendRequestMutation();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useErrors([{ isError, error }]);
  // eslint-disable-next-line no-unused-vars
  const frindReqHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    try {
      const { data } = await acceptRequest({ requestId: _id, accept });
      if (data?.statusCode === 200) {
        toast.success(data?.message || "Frind request accepted");
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  const closeNotificationDialog = () => dispatch(setIsNotification(false));
  return (
    <Dialog open={isNotification} onClose={closeNotificationDialog}>
      <Stack sx={{ xs: "1rem", sm: "2rem" }} padding={"1rem"}>
        <DialogTitle>Notification</DialogTitle>
        {isLoading ? (
          <Stack spacing={"1rem"} sx={{ xs: "1rem", sm: "2rem" }}>
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                height={"3rem"}
                width={"17.5rem"}
              />
            ))}
          </Stack>
        ) : data?.data.length > 0 ? (
          data?.data.map(({ sender, _id }, index) => (
            <NotificationItems
              key={index}
              sender={sender}
              _id={_id}
              handler={frindReqHandler}
            />
          ))
        ) : (
          <Typography textAlign={"center"}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "1rem",
              }}
            >
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFbElEQVR4nO2Z/08bdRjH69c/QH8B/N0vPwmLid9mYqIJFEtFYKblywbbUGEDgba0ZYAaCPgDyZIluozigCXiAJVtcdlYC9vAoY67KzLGFxlwV8yIE4H2riS0usc8h4cD2t5d72r8oU/yTi93vefzed3zeT7P5z6n0cQtbnGL2//BVl2Je7zOhKpVZ1LKf9owADxMLPieJRb875A0e5RkOCsvmj2K5/Aa/kfMz5oz8SJCrDkTg15XIqw5EwOr/UnJMe08QcBjFON/m2S4HormlimGg4jC/9BcN8n49XhvOL9eV4IJIbbkTKiKCcDEBDxO0mwZRbMe0c6HFcvw0QoBtOpMSsFICBFZGXjqedUhCMb3GsVwk9EDbBfJcLcJxrd3F0x/UrLXmVCpOgQAPEQy3DGKZv9UC+LfIccGKYazYxuaWFoPwCMkw7ZJ7VhX9wUwH8wBy6F90NVzQUZ0WAe29WDbts4xnbXd7bW2u99SIRKsQ2pnzvf/AI3laeD35AHH5EJDeSqc7/9RTu6ceTAyCIAgttNUuuRO2zp/etLa4a6sdEw8IZzjh5OEDly5MQnNtdVQmvM6HMl6Ecx5L/HCYzzXXGeDKyNTUoFsip6+rXOsytbhBoTZSmyRnBidW4WmOjs0lmth+vts2LibH1JTw9nQUKaFT+trYHR+TTxnaO8rUYNgJGzt7gr8xSlWbHZCCEtxPgx2Z4YF2KmBs5lQ/V6BKAyJs1mEWiPZ+DohMgSajlnhWq90CEEI3lxfE9bv1N11XpTHV6q8YosUu0tD49BUoZUNIajxQy1cHr4VGYRhaUVRcXv8mWLRaLBVwuxI+JwQ08yNLGi0m0QTn6A5XdQguB4Sa8BcmBE1hCDTgQzx2kJzXVFB4AqVornfIzm/ObsMte+nKwZBH+iLijiDcctSVs27jFzwPSf2lPpHbsOJer1ikBN1er7+UCLt/TzvfUY2CL47iDk+2+eCns+VD63uzzKg+9yA+PBi/PqYTLutpzpg6GudYpDrvTpobe2QkPDsEdkgFMPViDluafiIr9RKQaaGsqCl8WNREFwZRw0ys7QOiysbMObZ7bi27CD88YtRMcjyjBHqyg7HBgTf2vDm4F/3AQ1hdjo2FWUphhBkLsqOzdASkn3FH+RhppfWdzm2FClPdEGWIn2Mkl1k+iXmvWAvjn5pslP2w1rep+rTb4AseMEz1ctNzoWe3wdHZ6HFpnzGEtRi1cEgcSdCNLjfZL8CbxDv7gmQxmCQNEKAzIfJ+e0vQtfdNFR/UAz2wr3QdfxNycJ1FQqP+06l8gD4i+e+PK6DT6rNvG/VligBwmBCCEGe6b5tTjExx1yZsHZH+YwlCH2NuTLBXJgTEsRNc/Lf1TduGlICpCGwGZG8+zsjYtqvXm7slKkgLQQIS18FeFQ2CA/jzk0OkIbKuRlXMzpbGjFuOW5zfMHD1JWkh5T90BtgKXg1pPBauPtM+7XQ1nY6BIivRKPU8ElQNDcuoVhtyeHohG9PpgFD7tumb06mgqPtjGQ/1GZuTKjyqouGO4D/bJ5JanxofBEshVpg6dytIeNbyAXzAS0Mjy9KB6HZILmw/rJGTcPlgZwn2Xd5CCry08HRpOeFx+f6h+VGo1qjtsndoBOK5ndXKbh4zS1a7HbXDbY1SOTqAqTBGyQMynYXw2yZyoKJRiTDtmJbCMCDjBql7y7KiQzuAMrJGVk5QcdgOEUy3AHEGUW1KNDcLdUTW9a+l8dXigUregi811ei2hQb7eY2GnaCZPwZFM19RdLcPQlP/x6unXCvKuqKrebmdrgcGvvV+zR+U8RoCR9DN4/9erwW8w85cja3Rf8ct7jFLW6aGNjfD12WwDJ/WBwAAAAASUVORK5CYII="></img>
            </div>
            No notification
          </Typography>
        )}
      </Stack>
    </Dialog>
  );
}

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
        <Avatar src={transformImage(avatar, 6000)} />
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
export default notification;
