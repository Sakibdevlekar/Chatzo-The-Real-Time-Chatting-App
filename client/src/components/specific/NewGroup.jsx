import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Stack,
  Typography,
  TextField,
} from "@mui/material";

import { sampleUser } from "../../constant/SampleData";
import UserItem from "../shared/UserItem";
import {useInputValidation} from "6pp";

function NewGroup() {
  const selectMemberHandler = () => {};
  const groupName = useInputValidation("")
  return (
    <Dialog open>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">New Group</DialogTitle>
        <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler} />
        <Typography>Members</Typography>
        <Stack>
          {sampleUser.map((user, index) => (
            <UserItem key={index} user={user} handler={selectMemberHandler} />
          ))}
        </Stack>
        <Stack direction={"row"}>
          <Button variant="text" color="error">
            Cancel
          </Button>
          <Button variant="contained">Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default NewGroup;
