import React from "react";

import { RouteComponentProps } from "@reach/router";

type HomeProps = RouteComponentProps;

const Home = (props: HomeProps) => {
  return (
    <div>
      <h1>This is Home Page</h1>
    </div>
  );
};

export default Home;
