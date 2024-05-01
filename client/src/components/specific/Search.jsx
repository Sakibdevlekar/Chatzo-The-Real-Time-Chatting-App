import {
  Dialog,
  DialogTitle,
  TextField,
  Stack,
  InputAdornment,
  List,
  Typography,
  Skeleton,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useInputValidation } from "6pp";
import UserItem from "../shared/UserItem";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/reducers/misc";
import { useLazySearchUserQuery } from "../../redux/api/api";
import NoResult from "../../assets/NoResult.svg";
function search() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const search = useInputValidation("");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isSearch } = useSelector((state) => state.misc);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch();
  const searchCloseHandler = () => dispatch(setIsSearch(false));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [searchUser] = useLazySearchUserQuery();
  let isLoadingSendFriendRequest = false;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [user, setUser] = useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [loading, setLoading] = useState(false);
  const addFriendHandler = (id) => {
    console.log(id);
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setLoading(true);
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => {
          setUser(data?.data);
          setLoading(false);
        })
        .catch((error) => console.log(error));
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.value]);

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
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
        <List sx={{ alignItems: "center" }}>
          {loading ? ( // Show Skeleton if data is being fetched
            <Stack spacing={"1rem"}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" height={"3rem"} />
              ))}
            </Stack>
          ) : user.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={NoResult}
                style={{ display: "block", margin: "auto" }}
              />
              <Typography marginTop={"1rem"} variant={"h6"}>
                No Results
              </Typography>
            </div>
          ) : (
            user.map((user, index) => (
              <UserItem
                key={index}
                user={user}
                handler={addFriendHandler}
                handleIsLoading={isLoadingSendFriendRequest}
              />
            ))
          )}
        </List>
      </Stack>
    </Dialog>
  );
}

export default search;
