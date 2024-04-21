import { Menu } from "@mui/material";

const FileMenu = ({ anchorE1 }) => {
  return (
    <Menu anchorEl={anchorE1} open={false}>
      <div
        style={{
          width: "10rem",
        }}
      >
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis, quos
        nam voluptate quam expedita eos ab provident iste facere, doloremque
        molestias quas error dolor deleniti est quo ad perspiciatis accusamus.
      </div>
    </Menu>
  );
};

export default FileMenu;
