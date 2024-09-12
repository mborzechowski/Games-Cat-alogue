'use client';
import { useState } from 'react';
import { LiaEdit } from 'react-icons/lia';
import { TfiClose, TfiSave } from 'react-icons/tfi';
import { FaCheckCircle, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const GameDetails = ({ game, onClose, onSave }) => {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGame, setCurrentGame] = useState(game);
  const [rating, setRating] = useState(game.rating || '');
  const [note, setNote] = useState('');
  const [selectedLists, setSelectedLists] = useState([]);
  const [image, setImage] = useState(null);

  const [hoverRating, setHoverRating] = useState(0);

  const summaryLimit = 200;
  const shortSummary = game.summary?.substring(0, summaryLimit) + '...';

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

  const handleRatingClick = (index) => {
    setRating(index);
  };

  const handleRatingHover = (index) => {
    setHoverRating(index);
  };

  const handleRatingHoverOut = () => {
    setHoverRating(0);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/updateGame', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: currentGame._id,
          rating,
          note,
          image,
        }),
      });

      const updatedGame = await response.json();

      if (response.ok) {
        setCurrentGame(updatedGame);
        setIsEditing(false);
        toast.success('Changes have been saved!');
        onSave(updatedGame);
      } else {
        toast.error('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('An error occurred while saving changes');
    }
  };

  return (
    <div className='p-4 bg-black text-white mt-4 h-2/3 w-2/3 absolute z-10 top-44 left-1/2 transform -translate-x-1/2 border-2 border-red-700 rounded-lg'>
      <div className='flex flex-col float-right gap-2 items-end'>
        <TfiClose
          className='text-red-600 hover:text-red-700  size-6 mr-2'
          onClick={onClose}
        />
        {isEditing ? (
          <TfiSave
            onClick={handleSave}
            className='text-red-600 hover:text-red-700 size-6 cursor-pointer mt-2 mr-2'
          />
        ) : (
          <LiaEdit
            onClick={() => setIsEditing(true)}
            className='text-red-600 hover:text-red-700 cursor-pointer size-8'
          />
        )}
      </div>

      <div className='flex mb-4'>
        <div className='w-1/4'>
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
            <strong>Developer:</strong> {game.developer}
          </p>
          <p>
            <strong>Publisher:</strong> {game.publisher}
          </p>

          <div className='flex items-center gap-4'>
            <strong className={isEditing ? 'text-red-600' : ''}>Rating:</strong>{' '}
            {isEditing ? (
              <div className='flex space-x-1'>
                {[...Array(10)].map((_, index) => {
                  const starIndex = index + 1;
                  return (
                    <FaStar
                      key={starIndex}
                      className={`cursor-pointer ${
                        starIndex <= (hoverRating || rating)
                          ? 'text-red-600'
                          : 'text-gray-500'
                      }`}
                      onClick={() => handleRatingClick(starIndex)}
                      onMouseEnter={() => handleRatingHover(starIndex)}
                      onMouseLeave={handleRatingHoverOut}
                    />
                  );
                })}
              </div>
            ) : (
              <div className='flex space-x-1'>
                {[...Array(10)].map((_, index) => {
                  const starIndex = index + 1;
                  return (
                    <FaStar
                      key={starIndex}
                      className={`${
                        starIndex <= rating ? 'text-red-600' : 'text-gray-500'
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {isEditing ? (
            <>
              <div className=' flex items-center'>
                <strong className='text-red-600'>Add Note:</strong>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className='w-60  px-2 mt-2 ml-4 h-8 bg-black text-white border-b-2 border-r-2 rounded-xl border-red-600 text-sm focus:outline-none hover:outline-none resize-none '
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
                  <button className='cursor-pointer flex items-center justify-center bg-gblack text-white  w-24 text-sm border-b-2 border-r-2 rounded-xl border-red-600'>
                    Choose file
                  </button>
                </div>
              </div>

              <div className='flex mt-2'>
                <div className='flex space-x-4 mt-4'>
                  {['Next in line', 'On loan', 'On hold', 'On sale'].map(
                    (list) => (
                      <div
                        key={list}
                        className='cursor-pointer flex items-center justify-between bg-grey-600 text-white px-2 py-1   w-28 text-sm border-b-2 border-r-2 rounded-xl border-red-600'
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
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className='mt-4'>
        {game.summary && (
          <p onClick={toggleSummary} className='cursor-pointer text-justify'>
            <strong>Summary: </strong>
            {isSummaryExpanded ? game.summary : shortSummary}
            {!isSummaryExpanded && (
              <span className='text-red-600 hover:text-red-700 cursor-pointer text-sm text-justify'>
                {' '}
                Read more
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default GameDetails;
