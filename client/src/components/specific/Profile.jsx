import { Avatar, Typography, Stack } from "@mui/material";
import moment from "moment";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        src={user?.data?.avatar?.url}
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard heading={"Bio"} text={user?.data?.bio} />
      <ProfileCard
        heading={"username"}
        text={user?.data?.username}
        Icon={UserNameIcon}
      />
      <ProfileCard heading={"Name"} text={user?.data?.name} Icon={FaceIcon} />
      <ProfileCard
        heading={"Joined"}
        text={moment(user?.data?.createdAt).fromNow()}
        Icon={CalendarIcon}
      />
    </Stack>
  );
};

// eslint-disable-next-line react/prop-types
const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    display={"flex"}
    justifyContent={"center"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
  >
    {Icon && <Icon />}
    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography color={"gray"} variant="caption">
        {heading}
      </Typography>
    </Stack>
  </Stack>
);
export default Profile;
