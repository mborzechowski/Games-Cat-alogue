'use client';
import { useState } from 'react';
import { LiaEdit } from 'react-icons/lia';
import { TfiClose } from 'react-icons/tfi';

const GameDetails = ({
  game,
  onClose,
  onSaveChanges,
  onAddToList,
  onAddImage,
}) => {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(game.rating || '');
  const [note, setNote] = useState('');
  const [selectedLists, setSelectedLists] = useState([]);
  const [image, setImage] = useState(null);

  const toggleSummary = () => {
    setIsSummaryExpanded(!isSummaryExpanded);
  };

  const handleSaveChanges = () => {
    onSaveChanges(game, { rating });
    setIsEditing(false);
  };

  const handleAddToList = (listName) => {
    if (selectedLists.includes(listName)) {
      setSelectedLists(selectedLists.filter((list) => list !== listName));
    } else {
      setSelectedLists([...selectedLists, listName]);
    }
  };

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const summaryLimit = 200;
  const shortSummary = game.summary?.substring(0, summaryLimit) + '...';

  return (
    <div className='p-4 bg-black text-white mt-4 w-1/2 absolute z-10 top-20 left-1/2 transform -translate-x-1/2 border-2 border-red-700 rounded-lg'>
      <TfiClose
        className='text-red-500 hover:text-red-700 text-xl pr-2 float-right'
        onClick={onClose}
      />

      <div className='flex mb-4'>
        <div className='w-1/3'>
          <img
            src={game.cover_image.replace('t_thumb', 't_cover_big')}
            alt={game.title}
            className='w-full h-auto rounded-lg'
          />
        </div>
        <div className='w-1/2 pl-6'>
          <h2 className='text-xl font-bold mb-2'>{game.title}</h2>
          <p>
            <strong>Platform:</strong>{' '}
            {game.platforms.map((p) => p.name).join(', ')}
          </p>
          <p>
            <strong>Genres:</strong> {game.genres.map((g) => g.name).join(', ')}
          </p>
          <p>
            <strong className={isEditing ? 'text-red-600' : ''}>Rating:</strong>{' '}
            {isEditing ? (
              <input
                type='number'
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className='bg-gray-800 text-white p-1 rounded-lg w-20'
              />
            ) : (
              game.rating
            )}
          </p>

          {game.themes && (
            <p>
              <strong>Themes:</strong> {game.themes.join(', ')}
            </p>
          )}
          <p>
            <strong>Game Modes:</strong> {game.game_modes.join(', ')}
          </p>
          <p>
            <strong>Player Perspectives:</strong>{' '}
            {game.player_perspectives.join(', ')}
          </p>
          <p>
            <strong>Franchises:</strong> {game.franchises.join(', ')}
          </p>
        </div>
      </div>
      <div className='mt-4'>
        {game.summary && (
          <p onClick={toggleSummary} className='cursor-pointer'>
            <strong>Summary: </strong>
            {isSummaryExpanded ? game.summary : shortSummary}
            {!isSummaryExpanded && (
              <span className='text-red-500 hover:text-red-700 cursor-pointer text-sm'>
                {' '}
                Read more
              </span>
            )}
          </p>
        )}

        {isEditing ? (
          <>
            <div className='mt-4'>
              <strong>Add Note:</strong>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className='w-full p-2 mt-2 bg-gray-800 text-white rounded-lg'
              />
              <button
                onClick={() => onAddToList(game, note)}
                className='mt-2 bg-red-600 text-white px-4 py-1 rounded-lg'
              >
                Save Note
              </button>
            </div>

            <div className='mt-4'>
              <strong>Add to List:</strong>
              {['On loan', 'Playing', 'Next in line', 'On sale'].map((list) => (
                <label key={list} className='block'>
                  <input
                    type='checkbox'
                    value={list}
                    onChange={() => handleAddToList(list)}
                    checked={selectedLists.includes(list)}
                  />
                  {list}
                </label>
              ))}
              <button
                onClick={() => onAddToList(game, selectedLists)}
                className='mt-2 bg-red-600 text-white px-4 py-1 rounded-lg'
              >
                Save List
              </button>
            </div>

            <div className='mt-4'>
              <strong>Upload Image:</strong>
              <input
                type='file'
                onChange={handleImageUpload}
                className='w-full p-2 mt-2 bg-gray-800 text-white rounded-lg'
              />
              <button
                onClick={() => onAddImage(game, image)}
                className='mt-2 bg-red-600 text-white px-4 py-1 rounded-lg'
              >
                Add Image
              </button>
            </div>

            <div className='flex justify-end mt-4'>
              <button
                onClick={handleSaveChanges}
                className='bg-green-500 text-white px-4 py-1 rounded-lg mr-2'
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
        {isEditing ? (
          <></>
        ) : (
          <LiaEdit
            onClick={() => setIsEditing(true)}
            className='text-red-500 hover:text-red-700 text-xl cursor-pointer float-right'
          />
        )}
      </div>
    </div>
  );
};

export default GameDetails;
