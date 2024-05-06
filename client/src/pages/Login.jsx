import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  IconButton,
} from "@mui/material";
import { CameraAlt as CameraIcon } from "@mui/icons-material";
import { VisualHiddenInput } from "../components/Styles/StyledComponents";
import { VisibilityRounded, VisibilityOffRounded } from "@mui/icons-material";
import { useInputValidation, useStrongPassword, useFileHandler } from "6pp";
import { useState } from "react";
import { userNameValidator } from "../utils/validator";
import axios from "axios";
import { server } from "../constant/config";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth.reducer";
import toast from "react-hot-toast";
function Login() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const toggleLogin = () => {
    setIsLogin((perv) => !perv);
  };

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const userName = useInputValidation("", userNameValidator);
  const password = useStrongPassword();

  const avatar = useFileHandler("single");

  const handleLogin = async (e) => {
    e.preventDefault();
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      toast.loading("Please wait your request being processed", { id: 1 });
      const { data } = await axios.post(
        `${server}/user/login`,
        {
          username: userName.value,
          password: password.value,
        },
        config
      );
      if (data.statusCode === 200) {
        dispatch(userExists(true));
        toast.success(data.message, { id: 1 });
      } else if (data.statusCode === 401) {
        dispatch(userExists(false));
        toast.error(data.message, { id: 1 });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while trying to login",
        { id: 1 }
      );
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("username", userName.value);
    formData.append("bio", bio.value);
    formData.append("password", password.value);
    try {
      toast.loading("Please wait your request being processed", { id: 2 });
      const config = {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      };
      const { data } = await axios.post(`${server}/user/new`, formData, config);
      if (data.statusCode === 201) {
        dispatch(userExists(true));
        toast.success(data.message, { id: 2 });
      } else if (data.statusCode === 400) {
        dispatch(userExists(false));
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while trying to login"
      );
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(to right top, #ea7070, #e97393, #de7db3, #c98acd, #ad98de, #ad98de, #ad98de, #ad98de, #c98acd, #de7db3, #e97393, #ea7070)",
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={userName.value}
                  onChange={userName.changeHandler}
                />
                {userName.error && (
                  <Typography color="error" variant="caption">
                    {userName.error}
                  </Typography>
                )}
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? (
                          <VisibilityRounded />
                        ) : (
                          <VisibilityOffRounded />
                        )}
                      </IconButton>
                    ),
                  }}
                />
                {/* {password.error && (
                  <Typography color="error" variant="caption">
                    {password.error}
                  </Typography>
                )} */}
                <Button
                  sx={{
                    marginTop: "1rem",
                    backgroundColor: "#FF8878",
                    ":hover": { bgcolor: "#FF7E81" },
                  }}
                  variant="contained"
                  // color="#ea7070"

                  type="submit"
                  fullWidth
                >
                  Login
                </Button>
                <Typography textAlign={"center"} margin={"1rem"}>
                  {/*  eslint-disable-next-line react/no-unescaped-entities */}
                  Don't have an account?
                </Typography>
                <Button
                  variant="text"
                  type="submit"
                  fullWidth
                  onClick={toggleLogin}
                >
                  Register
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Register</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleRegister}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    }}
                    component="label"
                  >
                    <CameraIcon />
                    <VisualHiddenInput
                      type="file"
                      onChange={avatar.changeHandler}
                    />
                  </IconButton>
                </Stack>
                {avatar.error && (
                  <Typography
                    margin={"1rem auto"}
                    width={"fit-content"}
                    display={"block"}
                    color="error"
                    variant="caption"
                  >
                    {avatar.error}
                  </Typography>
                )}
                <TextField
                  required
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={userName.value}
                  onChange={userName.changeHandler}
                />
                {userName.error && (
                  <Typography color="error" variant="caption">
                    {userName.error}
                  </Typography>
                )}
                <TextField
                  required
                  fullWidth
                  label="Boi"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? (
                          <VisibilityRounded />
                        ) : (
                          <VisibilityOffRounded />
                        )}
                      </IconButton>
                    ),
                  }}
                />
                {password.error && (
                  <Typography color="error" variant="caption">
                    {password.error}
                  </Typography>
                )}
                <Button
                  sx={{
                    marginTop: "1rem",
                    backgroundColor: "#ea7070",
                    ":hover": { bgcolor: "#FF6D6D" },
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Register
                </Button>
                <Typography textAlign={"center"} margin={"1rem"}>
                  Already have an account?
                </Typography>
                <Button
                  variant="text"
                  type="submit"
                  fullWidth
                  onClick={toggleLogin}
                >
                  Login
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default Login;
