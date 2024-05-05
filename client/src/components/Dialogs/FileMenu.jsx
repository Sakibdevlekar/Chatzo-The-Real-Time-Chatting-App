import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import {
  Image as ImageIcon,
  AudioFile as AudioFileIcon,
  UploadFile as UploadFileIcon,
  VideoLibrary as VideoFileIcon,
} from "@mui/icons-material"; // Changed import for AudioFileIcon
import { useRef } from "react";
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/api/api";

const FileMenu = ({ anchorE1, chatId }) => {
  const dispatch = useDispatch();
  const { isFileMenu } = useSelector((state) => state.misc);
  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  const [sendAttachments] = useSendAttachmentsMutation();

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const selectImage = () => imageRef.current.click();
  const selectAudio = () => audioRef.current.click();
  const selectVideo = () => videoRef.current.click();
  const selectFile = () => fileRef.current.click();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) return;

    if (files.length > 5)
      return toast.error(`You can only send 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));

    const tostId = toast.loading(`Sending ${key}`);
    closeFileMenu(tostId);

    try {
      const myFrom = new FormData();
      myFrom.append("chatId", chatId),
        files.forEach((file) => myFrom.append("files", file));
      const res = await sendAttachments(myFrom);
      console.log(res?.data?.statusCode, res.error?.data?.message);
      if (res?.data?.statusCode == 200)
        toast.success(res?.data?.message || "Image send successfully", {
          id: tostId,
        });
      else
        toast.error(
          res?.data?.message ||
            res.error?.data?.message ||
            "Something went wrong",
          {
            id: tostId,
          }
        );
    } catch (error) {
      toast.error(error, { id: tostId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  return (
    <div
      style={{
        width: "20rem",
      }}
    >
      <Menu anchorEl={anchorE1} open={isFileMenu} onClose={closeFileMenu}>
        <MenuList sx={{ width: "10rem" }}>
          <MenuItem onClick={selectImage}>
            <Tooltip title="Image">
              <ImageIcon sx={{ color: "#007BFC" }} />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/gif"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Images")}
              ref={imageRef}
            />
          </MenuItem>

          <MenuItem onClick={selectAudio}>
            <Tooltip title="Audio">
              <AudioFileIcon sx={{ color: "#ff2e74" }} />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              type="file"
              multiple
              accept="audio/mpeg, audio/wav"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Audios")}
              ref={audioRef}
            />
          </MenuItem>

          <MenuItem onClick={selectVideo}>
            <Tooltip title="Video">
              <VideoFileIcon sx={{ color: "#02A698" }} />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
            <input
              type="file"
              multiple
              accept="video/mp4, video/webm, video/ogg"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Videos")}
              ref={videoRef}
            />
          </MenuItem>

          <MenuItem onClick={selectFile}>
            <Tooltip title="File">
              <UploadFileIcon sx={{ color: "#7f66ff" }} />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
            <input
              type="file"
              multiple
              accept="*"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Files")}
              ref={fileRef}
            />
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

export default FileMenu;
