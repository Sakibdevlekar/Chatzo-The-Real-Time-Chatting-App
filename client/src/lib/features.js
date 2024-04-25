import moment from "moment";

const fileFormate = (url) => {
  const fileExtension = url.split(".").pop();
  if (
    fileExtension === "mp4" ||
    fileExtension === "webm" ||
    fileExtension === "ogg"
  ) {
    return "video";
  }
  if (fileExtension === "mp3" || fileExtension === "wav") return "audio";
  if (
    fileExtension === "png" ||
    fileExtension === "jpeg" ||
    fileExtension === "jpeg" ||
    fileExtension === "gif"
  ) {
    return "image";
  }
  return "file";
};

// eslint-disable-next-line no-unused-vars
const transformImage = (url, width = 100) => url;

const getLast7Days = () => {
  const currentDate = moment();

  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    last7Days.unshift(currentDate.clone().subtract(i, "days").format("ddd"));
  }
  return last7Days;
};

export { fileFormate, transformImage, getLast7Days };
