/* eslint-disable react/jsx-filename-extension */
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import RevisionContext from './revision-context';

function RevisionProvider({ children }) {
  const [revisionIds, setRevisionIds] = useState([]);
  const [canSendRevision, setCanSendRevision] = useState([]);

  const changeRevisions = (id, name, index) => {
    setRevisionIds((prevState) => {
      const newState = JSON.parse(JSON.stringify(prevState));

      if (newState[index]) {
        newState[index] = null;
      } else {
        newState[index] = { [id]: name };
      }
      // eslint-disable-next-line max-len
      setCanSendRevision(newState.every((obj) => obj === null)); // for passport button "send on revision"

      return newState;
    });
  };

  const revisionActions = useMemo(() => ({
    changeRevision: changeRevisions,
    revisionsItem: revisionIds,
    canSendRevision,
  }));

  return (
    <RevisionContext.Provider value={revisionActions}>
      {children}
    </RevisionContext.Provider>
  );
}

export default RevisionProvider;

RevisionProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
