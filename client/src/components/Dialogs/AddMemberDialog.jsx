/* eslint-disable react/prop-types */
import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import { sampleUser } from "../../constant/SampleData";
import NoResultFoundImage from "../../assets/NoResult.svg";
import UserItem from "../shared/UserItem";
import { useState } from "react";
import colors from "../../constant/color";

// eslint-disable-next-line no-unused-vars
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
            <Stack sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              
            }}
            spacing={"1rem"}>
              <img src={NoResultFoundImage} alt="No Friends" height={"100rem"} width={"100rem"} style={{marginBottom:"1rem"}}/>
              <Typography fontWeight={"550"} color={colors.exDarkGray} textAlign={"center"}>No Friends</Typography>
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
