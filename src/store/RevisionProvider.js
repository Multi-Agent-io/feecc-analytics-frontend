
import { useState } from "react";
import RevisionContext from "./revision-context";


function RevisionProvider (props) {

  const [revisionIds, setRevisionIds] = useState([])

  const changeRevisions = (id, name, index,) => {

    setRevisionIds((prevState) => {
      const newState = JSON.parse(JSON.stringify(prevState))

      if(newState[index]){
          newState[index] = null
      } else {
          newState[index] = { [id]: name }
      }
      return newState
  })
  }

  const revisionActions = {
    changeRevision : changeRevisions,
    revisionsItem: revisionIds
  }

  return (
    <RevisionContext.Provider value={revisionActions}>
      {props.children}
    </RevisionContext.Provider>
  );
}

export default RevisionProvider