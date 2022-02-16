
import React from "react";

const RevisionContext = React.createContext({
  changeRevision : () => {},
  revisionsItem: []
});

export default RevisionContext;
