'use client';
import { useState, useEffect } from 'react';
import { TfiClose, TfiSave } from 'react-icons/tfi';
import { CiTrash, CiEdit } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { deleteGame } from '@/utils/gameService';
import GameDetailsHeader from '@/components/_GameDetails/GameDetailsHeader';
import GameSummary from '@/components/_GameDetails/GameSummary';
import GameExpansionsAndDlc from '@/components/_GameDetails/GameExpansionsAndDlc';
import GameDetailsNoteAndImage from '@/components/_GameDetails/GameDetailsNoteAndImage';
import GameFinishedStatus from '@/components/_GameDetails/GameFinishedStatus';
import GameRating from '@/components/_GameDetails/GameRating';

const GameDetails = ({ game, onClose, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentGame, setCurrentGame] = useState(game);
  const [rating, setRating] = useState(game.rating || '');
  const [note, setNote] = useState('');
  const [selectedLists, setSelectedLists] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [finished, setFinished] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [wishlist, setWishlist] = useState(false);

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

      if (currentGame.lists.includes('wishlist')) {
        setWishlist(true);
      }
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
          finished,
          fileData,
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(file.name);
        setFileData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='p-4 bg-black text-white min-h-[300px] lg:w-2/3 max-h-[80vh] absolute z-25 top-16 lg:top-48 rounded-lg  overflow-x-hidden overflow-y-auto'>
      <div className='flex flex-col float-right gap-2 items-end'>
        <TfiClose
          className='text-red-600 hover:text-red-700 cursor-pointer  size-6 mr-2'
          onClick={onClose}
        />

        {!wishlist &&
          (isEditing ? (
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
          ))}
      </div>

      <div className='flex flex-col gap-4 md:flex-row mb-4'>
        <div className='w-1/4'>
          <img
            src={game.cover_image.replace('t_thumb', 't_720p')}
            alt={game.title}
            className='w-full h-auto rounded-lg'
          />
        </div>
        <div className='md:w-1/2 md:pl-6'>
          <GameDetailsHeader game={game} />
          {!wishlist && (
            <GameFinishedStatus
              isEditing={isEditing}
              finished={finished}
              setFinished={setFinished}
              game={currentGame}
            />
          )}
          {!wishlist && (
            <GameRating
              isEditing={isEditing}
              rating={rating}
              hoverRating={hoverRating}
              handleRatingClick={handleRatingClick}
              handleRatingHover={handleRatingHover}
              handleRatingHoverOut={handleRatingHoverOut}
            />
          )}

          <GameDetailsNoteAndImage
            note={note}
            setNote={setNote}
            handleFileChange={handleFileChange}
            selectedFile={selectedFile}
            selectedLists={selectedLists}
            handleAddToList={handleAddToList}
            isEditing={isEditing}
          />
        </div>
      </div>

      <GameExpansionsAndDlc expansions={game.expansions} dlc={game.dlc} />
      <GameSummary summary={game.summary} />
    </div>
  );
};

export default GameDetails;
