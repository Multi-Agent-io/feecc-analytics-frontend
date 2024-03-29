
import { useState } from "react";
import RevisionContext from "./revision-context";


function RevisionProvider (props) {

  const [revisionIds, setRevisionIds] = useState([])
  const [canSendRevision, setCanSendRevision] = useState([])


  const changeRevisions = (id, name, index,) => {

    setRevisionIds((prevState) => {
      const newState = JSON.parse(JSON.stringify(prevState));

      if(newState[index]){
          newState[index] = null
      } else {
          newState[index] = { [id]: name }
      }
      setCanSendRevision(newState.every(obj => obj === null)); // for passport button "send on revision"

      return newState
  })
  }

  const revisionActions = {
    changeRevision : changeRevisions,
    revisionsItem: revisionIds,
    canSendRevision: canSendRevision
  }

  return (
    <RevisionContext.Provider value={revisionActions}>
      {props.children}
    </RevisionContext.Provider>
  );
}

export default RevisionProvider