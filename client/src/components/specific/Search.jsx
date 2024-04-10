import {
  Dialog,
  DialogTitle,
  TextField,
  Stack,
  InputAdornment,
  List,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useInputValidation } from "6pp";
import UserItem from "../shared/UserItem";
import { useState } from "react";
import { sampleUser } from "../../constant/SampleData";

function search() {
  const search = useInputValidation("");
  let isLoadingSendFriendRequest = false;
  const [user,setUser] = useState(sampleUser);
  const addFriendHandler = (id) =>{
    console.log(id);
  }
  return (
    <Dialog open>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          placeholder="Search"
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <List>
          {user.map((user, index) => (
            <UserItem
              key={index}
              user={user}
              handler={addFriendHandler}
              handleIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
}

export default search;
