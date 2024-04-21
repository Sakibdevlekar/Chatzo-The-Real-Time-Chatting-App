import { Link as LinkComponent } from "react-router-dom";

import {styled } from "@mui/material";
import colors from "../../constant/color";

const VisualHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  width: 1,
});

const Link = styled(LinkComponent)`
  text-decoration: none;
  color: black;
  padding: 1rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const InputBox = styled("input")`
width: 100%;
  height: 100;
  border:none;
  outline: none;
  padding:0 3rem;
  boarder-radius:2.5rem;
  background-color: ${colors.grayColor};
`;

export { Link, InputBox, VisualHiddenInput };
