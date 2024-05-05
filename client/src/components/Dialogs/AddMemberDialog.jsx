/* eslint-disable react/prop-types */
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoResultFoundImage from "../../assets/NoResult.svg";
import colors from "../../constant/color";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAddGroupMembersMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import { setIsAddMember } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

// eslint-disable-next-line no-unused-vars
const AddMemberDialog = ({ chatId }) => {
  const dispatch = useDispatch();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { isAddMember } = useSelector((state) => state.misc);

  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);
  // console.log(data?.data?.friends);
  const [addMember, isLoadingAddMember] = useAsyncMutation(
    useAddGroupMembersMutation
  );

  const closeHandler = () => {
    setSelectedMembers([]);
    dispatch(setIsAddMember(false));
  };

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) => {
      const updatedMembers = prev.includes(id)
        ? prev.filter((element) => element.toString() !== id.toString())
        : [...prev, id];
      return updatedMembers;
    });
  };

  const addMemberSubmitHandler = () => {
    addMember("Adding Members...", { members: selectedMembers, chatId });
    closeHandler();
  };

  useErrors([{ isError, error }]);
  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack p={"2rem"} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Members</DialogTitle>
        <Stack spacing={"1rem"}>
          {isLoading ? ( // Show Skeleton if data is being fetched
            <Stack spacing={"1rem"}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" height={"3rem"} />
              ))}
            </Stack>
          ) : data?.data?.friends.length > 0 ? (
            data?.data?.friends.map((user, index) => (
              <UserItem
                key={index}
                user={user}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))
          ) : (
            <Stack
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
              spacing={"1rem"}
            >
              <img
                src={NoResultFoundImage}
                alt="No Friends"
                height={"100rem"}
                width={"100rem"}
                style={{ marginBottom: "1rem" }}
              />
              <Typography
                fontWeight={"550"}
                color={colors.exDarkGray}
                textAlign={"center"}
              >
                No Friends
              </Typography>
            </Stack>
          )}
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button onClick={closeHandler} color="error">
            Cancel
          </Button>
          <Button
            onClick={addMemberSubmitHandler}
            variant="contained"
            disabled={isLoadingAddMember}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
