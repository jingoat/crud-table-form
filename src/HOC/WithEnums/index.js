import React from "react";

export function withEnums(Com) {
  return (props) => {
    const { enums }: any = {};

    return <Com {...props} enums={enums} />;

    // if (Object.keys(enums).length === 0) {
    //   return <div>...</div>;
    // } else {
    //   return <Com {...props} enums={enums} />;
    // }
  };
}
