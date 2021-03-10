import React from "react";

const Emoji = ({ e }) => {
  return (
    <span className="emoji" role="img">
      {e}
    </span>
  );
};

export default Emoji;
