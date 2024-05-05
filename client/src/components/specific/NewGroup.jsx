import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useInputValidation } from "6pp";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { setIsNewGroup } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

function NewGroup() {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery("");
  const [ newGroup, isLadingNewGroup ] = useAsyncMutation(useNewGroupMutation);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [{ isError, error }];

  useErrors(errors);

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) => {
      const updatedMembers = prev.includes(id)
        ? prev.filter((element) => element !== id)
        : [...prev, id];
      return updatedMembers;
    });
  };
  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");
    if (selectedMembers.length < 2) {
      return toast.error("Please Select Atleast 2 member");
    }
    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });
    //close dialog
    closeHandler();
  };
  const groupName = useInputValidation("");
  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />
        <Typography>Members</Typography>
        <Stack>
          {isLoading ? ( // Show Skeleton if data is being fetched
            <Stack spacing={"1rem"}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" height={"auto"} />
              ))}
            </Stack>
          ) : (
            data?.data?.friends.map((user, index) => (
              <UserItem
                key={index}
                user={user}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))
          )}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button
            variant="outlined"
            color="error"
            size="large"
            onClick={closeHandler}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={submitHandler}
            disabled={isLadingNewGroup}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default NewGroup;
