import { Helmet } from "react-helmet-async";

const Title = ({
  // eslint-disable-next-line react/prop-types
  title = "Chatzo",
  // eslint-disable-next-line react/prop-types
  description = "This is a chat app called chatly",
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
    </>
  );
};

export default Title;
