import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import { sampleUser } from "../../constant/SampleData";
import UserItem from "../shared/UserItem";
import { useState } from "react";

const AddMemberDialog = ({ addMember, isLoadingAddMember, ChatId }) => {
  const [members, setMembers] = useState(sampleUser);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const closeHandler = () => {
    setMembers([]);
    setSelectedMembers([]);
  };

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) => {
      const updatedMembers = prev.includes(id)
        ? prev.filter((element) => element !== id)
        : [...prev, id];
      console.log(updatedMembers); // Log the updated state
      return updatedMembers;
    });
  };

  const addMemberSubmitHandler = () => {};
  return (
    <Dialog open onClose={closeHandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Members</DialogTitle>
        <Stack spacing={"1rem"}>
          {members.length > 0 ? (
            members.map((user, index) => (
              <UserItem
                key={index}
                user={user}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friends</Typography>
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
