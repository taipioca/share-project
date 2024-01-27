import React from "react";

import { RouteComponentProps } from "@reach/router";

type NotFoundProps = RouteComponentProps;

const NotFound = (props: NotFoundProps) => {
  return (
    <div>
      <h1>this page isn't done yet please go to catalog and profile</h1>
    </div>
  );
};

export default NotFound;
