import React from 'react';
import Spinner from './Spinner';

const Status = ({
  status,
  label
}) => {
  return (
    <div className="status">
      <div style={{marginRight: '10px'}}>
        {
          status === 'started' ? (
            <Spinner />
          ) : (
            <input
              type="checkbox"
              readOnly
              checked={status === 'complete'}
            />
          )
        } 
      </div>
      <div>
        {label}
      </div>
    </div>
  )
};

export default Status;