'use client';
import { useState } from 'react';
import { LiaEdit } from 'react-icons/lia';
import { TfiClose, TfiSave } from 'react-icons/tfi';
import { FaCheckCircle } from 'react-icons/fa';

const GameDetails = ({ game, onClose }) => {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(game.rating || '');
  const [note, setNote] = useState('');
  const [selectedLists, setSelectedLists] = useState([]);
  const [image, setImage] = useState(null);

  const toggleSummary = () => {
    setIsSummaryExpanded(!isSummaryExpanded);
  };

  const handleAddToList = (listName) => {
    if (selectedLists.includes(listName)) {
      setSelectedLists(selectedLists.filter((list) => list !== listName));
    } else {
      setSelectedLists([...selectedLists, listName]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSave = () => {
    if (note) {
      onAddNote(game, note);
    }
    if (image) {
      onAddImage(game, image);
    }
    setIsEditing(false);
    alert('Changes have been saved!');
  };
  const summaryLimit = 200;
  const shortSummary = game.summary?.substring(0, summaryLimit) + '...';

  return (
    <div className='p-4 bg-black text-white mt-4 w-1/2 absolute z-10 top-20 left-1/2 transform -translate-x-1/2 border-2 border-red-700 rounded-lg'>
      <TfiClose
        className='text-red-500 hover:text-red-700 pr-2 float-right size-8'
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

          <p>
            <strong className={isEditing ? 'text-red-600' : ''}>Rating:</strong>{' '}
            {isEditing ? (
              <input
                type='number'
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className='bg-black text-white p-1 rounded-lg w-20 border-none'
              />
            ) : (
              game.rating
            )}
          </p>

          {isEditing ? (
            <>
              <div className=' flex items-center'>
                <strong className='text-red-600'>Add Note:</strong>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className='w-60  px-2 mt-2 ml-4 h-8 bg-black text-white border-b-2 border-red-600 text-sm '
                />
              </div>

              <div className='mt-4 flex items-center'>
                <strong className='text-red-600 mr-2'>Add Image:</strong>
                <div className='relative'>
                  <input
                    type='file'
                    onChange={handleImageUpload}
                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                  />
                  <button className='cursor-pointer flex items-center bg-gblack text-white px-2 py-1 w-28 text-sm border-b-2 border-red-600'>
                    Choose file
                  </button>
                </div>
              </div>

              <div className='flex mt-2'>
                <div className='flex space-x-4 mt-4'>
                  {['On loan', 'Playing', 'Next in line', 'On sale'].map(
                    (list) => (
                      <div
                        key={list}
                        className='cursor-pointer flex items-center bg-grey-600 text-white px-2 py-1   w-28 text-sm border-b-2 border-red-600'
                        onClick={() => handleAddToList(list)}
                      >
                        <span>{list}</span>
                        {selectedLists.includes(list) && (
                          <FaCheckCircle className='text-red-600 ml-2' />
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
              <TfiSave
                onClick={handleSave}
                className=' text-rose-700 cursor-pointer float-right mt-4 size-8'
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className='mt-4'>
        {game.summary && (
          <p onClick={toggleSummary} className='cursor-pointer'>
            <strong>Summary: </strong>
            {isSummaryExpanded ? game.summary : shortSummary}
            {!isSummaryExpanded && (
              <span className='text-red-600 hover:text-red-700 cursor-pointer text-sm'>
                {' '}
                Read more
              </span>
            )}
          </p>
        )}

        <LiaEdit
          onClick={() => setIsEditing(true)}
          className={
            isEditing
              ? 'text-red-600 hover:text-red-700 float-right size-8 opacity-0'
              : 'text-red-600 hover:text-red-700 cursor-pointer float-right size-8'
          }
        />
      </div>
    </div>
  );
};

export default GameDetails;
