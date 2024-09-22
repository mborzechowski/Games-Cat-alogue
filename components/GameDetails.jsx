'use client';
import { useState, useEffect } from 'react';
import { TfiClose, TfiSave } from 'react-icons/tfi';
import { FaCheckCircle, FaStar } from 'react-icons/fa';
import { CiTrash, CiEdit } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { deleteGame } from '@/utils/gameService';

const GameDetails = ({ game, onClose, onSave, onDelete }) => {
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

  useEffect(() => {
    if (currentGame) {
      const initialLists = currentGame.lists.map((list) => {
        const listMapping = {
          loan: 'On loan',
          next: 'Next in line',
          sale: 'On sale',
          hold: 'On hold',
        };
        return listMapping[list] || list;
      });
      setSelectedLists(initialLists);
    }
  }, [currentGame]);

  const handleAddToList = async (listName) => {
    let updatedLists;

    if (selectedLists.includes(listName)) {
      updatedLists = selectedLists.filter((list) => list !== listName);
    } else {
      updatedLists = [...selectedLists, listName];
    }

    const listMapping = {
      'On loan': 'loan',
      'Next in line': 'next',
      'On sale': 'sale',
      'On hold': 'hold',
    };

    const mappedLists = updatedLists.map((list) => listMapping[list] || list);

    setSelectedLists(updatedLists);

    try {
      const response = await fetch('/api/updateGame', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: currentGame._id,
          lists: mappedLists,
        }),
      });

      if (response.ok) {
        toast.success('Game lists updated successfully!');
      } else {
        throw new Error('Failed to update lists');
      }
    } catch (error) {
      console.error('Error updating lists:', error);
      toast.error('An error occurred while updating the lists');
    }
  };

  const handleDelete = async () => {
    if (!currentGame || !currentGame._id) return;

    try {
      await deleteGame(currentGame._id);
      toast.success('Game deleted successfully!');
      onDelete();
    } catch (error) {
      toast.error('Failed to delete the game');
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
    <div className='p-4 bg-black text-white mt-4 min-h-[300px] w-2/3 absolute z-10 top-22 left-1/2 transform -translate-x-1/2 border-2 border-red-700 rounded-lg max-h-[80vh]  overflow-y-auto'>
      <div className='flex flex-col float-right gap-2 items-end'>
        <TfiClose
          className='text-red-600 hover:text-red-700 cursor-pointer  size-6 mr-2'
          onClick={onClose}
        />

        {isEditing ? (
          <>
            <TfiSave
              onClick={handleSave}
              className='text-red-600 hover:text-red-700 size-6 cursor-pointer mt-2 mr-2'
            />

            <CiTrash
              onClick={handleDelete}
              className='text-red-600 cursor-pointer size-8 mr-1 mt-1'
            />
          </>
        ) : (
          <CiEdit
            onClick={() => setIsEditing(true)}
            className='text-red-600 hover:text-red-700 cursor-pointer size-8 mr-2 mt-1'
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
            <strong>Publisher:</strong> {game.publisher.join(', ')}
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
      <div className='mt-10 mb-10 flex justify-start gap-12'>
        {game.expansions && game.expansions.length > 0 && (
          <div className='flex flex-col items-center ml-10'>
            <h4 className='font-semibold mb-2'>Expansions:</h4>
            <div className='flex'>
              {game.expansions.map((expansionItem) => (
                <div key={expansionItem.id} className='relative group mx-2'>
                  <img
                    src={expansionItem.cover_image}
                    alt={expansionItem.name}
                    className='w-16 h-16 object-cover rounded-md'
                  />

                  <div className='absolute top-20 left-1/2 transform -translate-x-1/2 text-red-600 bg-black w-28 text-center  text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    {expansionItem.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {game.dlc && game.dlc.length > 0 && (
          <div className='flex flex-col items-center '>
            <h4 className='font-semibold mb-2'>DLC:</h4>
            <div className='flex'>
              {game.dlc.map((dlcItem) => (
                <div key={dlcItem.id} className='relative group mx-2'>
                  <img
                    src={dlcItem.cover_image}
                    alt={dlcItem.name}
                    className='w-16 h-16 object-cover rounded-md'
                  />

                  <div className='absolute top-20 left-1/2 transform -translate-x-1/2 text-red-600 bg-black w-28 text-center  text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    {dlcItem.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
