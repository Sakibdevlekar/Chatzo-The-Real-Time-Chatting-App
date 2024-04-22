import {
  Backdrop,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Link } from "../components/Styles/StyledComponents";
import AvatarCard from "../components/shared/AvatarCard";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useNavigate, useSearchParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import colors from "../constant/color";
import { Suspense, lazy, memo, useEffect, useState } from "react";
import { sampleChats, sampleUser } from "../constant/SampleData";
import UserItem from "../components/shared/UserItem";
import GroupLogo from "../assets/group.svg";
const ConfirmDeleteDialog = lazy(() =>
  import("../components/Dialogs/ConfirmDeleteDialog")
);

const AddMemberDialog = lazy(() =>
  import("../components/Dialogs/AddMemberDialog")
);

const isAddMember = false;

function Groups() {
  const [GroupName, setGroupName] = useState("");
  const [GroupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const chatId = useSearchParams()[0].get("group");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const updateGroupNameHandler = () => {
    setIsEdit(false);
    console.log(GroupNameUpdatedValue);
  };
  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name: ${chatId}`);
      setGroupNameUpdatedValue(`Group Name: ${chatId}`);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const removeMemberHandler = (id) => {};

  const handleMobileClose = () => setIsMobileOpen(false);
  const openAddMemberHandler = () => {};
  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };
  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };
  const deleteHandler = () => {};

  const IconBtn = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
          position: "fixed",
          right: "1rem",
          top: "1rem",
          bgcolor: colors.light,
          color: colors.light,
          "&:hover": {
            backgroundColor: colors.light,
          },
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Tooltip title={"Back"}>
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: colors.matBlack,
            color: colors.light,
            "&:hover": {
              backgroundColor: colors.dark,
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const ButtonGroup = (
    <Stack
      direction={{
        sm: "row",
        xs: "column-reverse",
      }}
      spacing={"1rem"}
      p={{
        sm: "1rem",
        xs: "1rem",
        md: "1rem 4rem",
      }}
    >
      <Button
        size="large"
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={openConfirmDeleteHandler}
      >
        Delete Group
      </Button>
      <Button
        size="large"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openAddMemberHandler}
      >
        Add Member
      </Button>
    </Stack>
  );

  const GroupNameComponent = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"3rem"}
    >
      {isEdit ? (
        <>
          <TextField
            value={GroupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
          />
          <IconButton onClick={updateGroupNameHandler}>
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4">{GroupName}</Typography>
          <IconButton onClick={() => setIsEdit(true)}>
            <BorderColorIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );
  return (
    <Grid container height={"100vh"}
    >
      <Grid
        item
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
          
        }}
        sm={4}
        bgcolor={colors.grayColor}
      >
        <GroupList myGroup={sampleChats} chatId={chatId} />
      </Grid>

      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        {IconBtn}
        {GroupName ? (
          <>
            {GroupNameComponent}
            <Typography
              margin={"2rem"}
              alignSelf={"flex-start"}
              variant="body1"
            >
              Members
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem",
              }}
              spacing={"2rem"}
              height={"50vh"}
              overflow={"auto"}
            >
              {sampleUser.map((user, index) => (
                <UserItem
                  key={index}
                  user={user}
                  isAdded
                  styling={{
                    boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                    padding: "1rem 2rem",
                    borderRadius: "1rem",
                  }}
                  handler={removeMemberHandler}
                />
              ))}
            </Stack>
            {ButtonGroup}
          </>
        ) : (
          <Stack
            alignItems={"center"}
            justifyContent={"center"}
            height={"100%"}
          >
            <img
              src={GroupLogo}
              alt="Group Logo"
              style={{
                maxWidth: "500px", 
                maxHeight: "500px", 
                width: "auto",
                height: "auto",
                display: "block",
              }}
            />
          </Stack>
        )}
      </Grid>
      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}
      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
        open={isMobileOpen}
        onClose={handleMobileClose}
      >
        <GroupList w={"50vw"} myGroup={sampleChats} chatId={chatId} />
      </Drawer>
    </Grid>
  );
}

// eslint-disable-next-line react/prop-types
const GroupList = ({ w = "100%", myGroup = [], chatId }) => {
  return (
    <Stack width={w}
    overflow={"auto"}
    sx={{
      height: "100vh",
      overflow: "auto",
    }}
    >
      {myGroup.length !== 0 ? (
        myGroup.map((group, index) => (
          <GroupListItem key={index} group={group} chatId={chatId} />
        ))
      ) : (
        <Typography textAlign={"center"} padding={"1rem"}>
          No groups
        </Typography>
      )}
    </Stack>
  );
};
// eslint-disable-next-line react/display-name, react/prop-types, no-unused-vars
const GroupListItem = memo(({ group, chatId }) => {
  // eslint-disable-next-line react/prop-types
  const { name, avatar, _id } = group;
  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId.toString() === _id.toString()) e.preventDefault();
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});

export default Groups;
