import React from "react";
import TasterShow from "./show/page";

const page = ({ params }: { params: { id: string } }) => {
  return <TasterShow params={params} />;
};

export default page;
