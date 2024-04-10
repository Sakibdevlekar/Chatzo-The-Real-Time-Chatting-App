import { Avatar, Typography, Stack } from "@mui/material";
import moment from "moment";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
const Profile = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard heading={"Bio"} text={"sassa sdsdsf dsfs "} />
      <ProfileCard heading={"username"} text={"user"} Icon={UserNameIcon} />
      <ProfileCard heading={"Name"} text={"Name"} Icon={FaceIcon} />
      <ProfileCard
        heading={"Joined"}
        text={moment("2024-04-01T09:27:59.133+00:00").fromNow()}
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
