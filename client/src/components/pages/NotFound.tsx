import React from "react";

import { RouteComponentProps } from "@reach/router";

type NotFoundProps = RouteComponentProps;

const NotFound = (props: NotFoundProps) => {
  return (
    <div>
      <h1>Page Not Found</h1>
    </div>
  );
};

export default NotFound;
