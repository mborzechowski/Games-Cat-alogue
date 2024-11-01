'use client';
import { useState } from 'react';

const GameSummary = ({ summary }) => {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const summaryLimit = 120;
  const shortSummary = summary?.substring(0, summaryLimit) + '...';

  const toggleSummary = () => {
    setIsSummaryExpanded(!isSummaryExpanded);
  };

  return (
    <div className='mt-2'>
      {summary && (
        <p onClick={toggleSummary} className='cursor-pointer text-justify'>
          <strong>Summary: </strong>
          {isSummaryExpanded ? summary : shortSummary}
          {!isSummaryExpanded && (
            <span className='text-red-600 hover:text-red-700 cursor-pointer text-sm text-justify'>
              {' '}
              Read more
            </span>
          )}
        </p>
      )}
    </div>
  );
};

export default GameSummary;
