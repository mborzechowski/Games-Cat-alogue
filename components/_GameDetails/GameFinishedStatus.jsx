const GameFinishedStatus = ({ isEditing, finished, setFinished, game }) => {
  return (
    <div className='flex items-center'>
      <strong className={isEditing ? 'text-red-600' : ''}>Finished:</strong>
      <p className='ml-2'>
        {isEditing ? (
          <>
            <button
              onClick={() => setFinished(true)}
              className={
                finished
                  ? 'text-red-600 mr-2 cursor-pointer'
                  : 'mr-2 cursor-pointer'
              }
            >
              Yes
            </button>
            <button
              onClick={() => setFinished(false)}
              className={
                !finished
                  ? 'text-red-600 mr-2 cursor-pointer'
                  : 'mr-2 cursor-pointer'
              }
            >
              No
            </button>
          </>
        ) : game.finished ? (
          'Yes'
        ) : (
          'No'
        )}
      </p>
    </div>
  );
};

export default GameFinishedStatus;
