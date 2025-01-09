'use client';

import { useState, useEffect, useRef } from 'react';
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
import AdditionalImages from '@/components/_GameDetails/AdditionalImages';

const GameDetails = ({ game, onClose, onSave, onDelete, shared }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentGame, setCurrentGame] = useState(game);
  const [rating, setRating] = useState(game.rating || '');
  const [note, setNote] = useState('');
  const [selectedLists, setSelectedLists] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);
  const [finished, setFinished] = useState(null);
  const [wishlist, setWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPlatformList, setShowPlatformList] = useState(false);
  const [hoveredPlatformId, setHoveredPlatformId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const detailsRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handlePlatformSelect = (platform, type) => {
    console.log(`Selected platform: ${platform.name}, Type: ${type}`);
  };

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

  const handleRatingClick = (index) => setRating(index);
  const handleRatingHover = (index) => setHoverRating(index);
  const handleRatingHoverOut = () => setHoverRating(0);

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append('gameId', currentGame._id);
      formData.append('rating', rating);
      formData.append('note', note);
      formData.append('finished', finished !== null ? finished : false);

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append('files', file);
        });
      }

      const response = await fetch('/api/updateGame', {
        method: 'PUT',
        body: formData,
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
    } finally {
      setSelectedFiles([]);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleImageClick = (url) => setSelectedImage(url);
  const handleCloseImage = () => setSelectedImage(null);

  return (
    <div
      ref={detailsRef}
      className='p-4 bg-black text-white min-h-[500px] lg:w-2/3 max-h-[88vh] absolute z-25 top-16 lg:top-26 rounded-lg overflow-x-hidden overflow-y-auto'
    >
      <div className='flex flex-col float-right gap-2 items-end'>
        <TfiClose
          className='text-red-600 hover:text-red-700 cursor-pointer size-6 mr-2'
          onClick={onClose}
        />
        {!wishlist &&
          !shared &&
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
        {wishlist && !shared && (
          <>
            <CiTrash
              onClick={handleDelete}
              className='text-red-600 cursor-pointer size-8 mr-1 mt-1'
            />
            <button
              onClick={() => setShowPlatformList(!showPlatformList)}
              className='mt-2 px-4 py-2 bg-gray-800 text-red-600 rounded-lg hover:bg-gray-700'
            >
              To Library
            </button>
          </>
        )}

        {showPlatformList && game.platforms && game.platforms.length > 0 && (
          <div className='mt-4 overflow-hidden  rounded-lg border-red-600 border'>
            {game.platforms.map((platform) => {
              return (
                <div
                  key={platform.id}
                  className='text-s px-4 pt-2 pb-1 text-red-600 hover:bg-gray-800 cursor-pointer'
                  onMouseEnter={() => setHoveredPlatformId(platform.id)}
                  onMouseLeave={() => setHoveredPlatformId(null)}
                >
                  {platform.name}
                  {hoveredPlatformId === platform.id && (
                    <div className='absolute flex flex-col rounded-md -ml-16 overflow-hidden bg-black border-red-600 border'>
                      <button
                        className='text-s px-4 pt-2 pb-1 text-red-600 hover:bg-gray-800 cursor-pointer'
                        onClick={() =>
                          handlePlatformSelect(platform, 'physical')
                        }
                      >
                        Physical
                      </button>
                      <button
                        className='text-s px-4 py-1 text-red-600 hover:bg-gray-800 cursor-pointer'
                        onClick={() =>
                          handlePlatformSelect(platform, 'digital')
                        }
                      >
                        Digital
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
          <GameDetailsHeader
            game={game}
            wishlist={wishlist}
            onClose={onClose}
          />
          {!wishlist && (
            <>
              <GameFinishedStatus
                isEditing={isEditing}
                finished={finished}
                setFinished={setFinished}
                game={currentGame}
              />
              <GameRating
                isEditing={isEditing}
                rating={rating}
                hoverRating={hoverRating}
                handleRatingClick={handleRatingClick}
                handleRatingHover={handleRatingHover}
                handleRatingHoverOut={handleRatingHoverOut}
              />
            </>
          )}
          <GameDetailsNoteAndImage
            note={note}
            setNote={setNote}
            handleFileChange={handleFileChange}
            selectedLists={selectedLists}
            handleAddToList={handleAddToList}
            isEditing={isEditing}
          />
        </div>
      </div>

      <GameExpansionsAndDlc expansions={game.expansions} dlc={game.dlc} />

      <GameSummary summary={game.summary} />
      <AdditionalImages
        images={currentGame.additional_img}
        onImageClick={handleImageClick}
      />

      {selectedImage && (
        <div className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-80 z-30'>
          <img
            src={selectedImage}
            alt='Enlarged'
            className='max-w-full max-h-full'
            onClick={handleCloseImage}
          />
        </div>
      )}
    </div>
  );
};

export default GameDetails;
