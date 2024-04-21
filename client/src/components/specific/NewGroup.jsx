import {
  Button,
  Dialog,
  DialogTitle,
  Stack,
  Typography,
  TextField,
} from "@mui/material";

import { sampleUser } from "../../constant/SampleData";
import UserItem from "../shared/UserItem";
import { useInputValidation } from "6pp";
import { useState } from "react";

function NewGroup() {
  const [members, setMembers] = useState(sampleUser);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const closeHandler = () => {};

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) => {
      const updatedMembers = prev.includes(id)
        ? prev.filter((element) => element !== id)
        : [...prev, id];
      console.log(updatedMembers); // Log the updated state
      return updatedMembers;
    });
  };
  const submitHandler = () => {};
  const groupName = useInputValidation("");
  return (
    <Dialog open onClose={closeHandler}>
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
          {sampleUser.map((user, index) => (
            <UserItem
              key={index}
              user={user}
              handler={selectMemberHandler}
              isAdded={selectedMembers.includes(user._id)}
            />
          ))}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button variant="outlined" color="error" size="large">
            Cancel
          </Button>
          <Button variant="contained" size="large" onClick={submitHandler}>
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default NewGroup;
