'use client';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeartCirclePlus,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';

const WishlistButton = ({ game }) => {
  const { data: session } = useSession();
  const [isCheckingWishlist, setIsCheckingWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInDatabase, setIsInDatabase] = useState(false);

  const checkIfGameInWishlist = async (gameId) => {
    setIsCheckingWishlist(true);
    try {
      const response = await axios.get(
        `/api/checkGameWishlist?igdb_id=${gameId}`
      );
      const { isOnWishlist, isInDatabase } = response.data;

      setIsInWishlist(isOnWishlist);
      setIsInDatabase(isInDatabase);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      toast.error('Failed to check wishlist status.');
    } finally {
      setIsCheckingWishlist(false);
    }
  };

  useEffect(() => {
    if (game?.id) {
      checkIfGameInWishlist(game.id);
    }
  }, [game?.id]);

  const handleAddToWishlist = async () => {
    if (!session) {
      toast.warn('You need to be logged in to add a game to your wishlist.');
      return;
    }

    try {
      const response = await axios.post('/api/addGame', {
        igdb_id: game.id,
        title: game.name,
        platforms: game.platforms
          ? game.platforms.map((p) => ({
              id: p.id,
              name: p.name,
              medium: 'unknown',
            }))
          : [],
        genres: game.genres
          ? game.genres.map((g) => ({ id: g.id, name: g.name }))
          : [],
        cover_image:
          game.cover && game.cover.url ? game.cover.url : '/temp_cover.png',
        rating: 0,
        personal_notes: '',
        lists: 'wishlist',
        summary: game.summary || '',
        category: game.category || '',
        themes: game.themes ? game.themes.map((t) => t.name) : [],
        game_modes: game.game_modes
          ? game.game_modes.map((mode) => mode.name)
          : [],
        player_perspectives: game.player_perspectives
          ? game.player_perspectives.map((perspective) => perspective.name)
          : [],
        franchises: game.franchises
          ? game.franchises.map((franchise) => franchise.name)
          : [],
        developer: game.involved_companies
          ? game.involved_companies
              .filter((company) => company.developer)
              .map((company) => company.company.name)
          : [],
        publisher: game.involved_companies
          ? game.involved_companies
              .filter((company) => company.publisher)
              .map((company) => company.company.name)
          : [],
        dlc: game.dlcs ? game.dlcs.map((dlc) => dlc.name) : [],
        expansions: game.expansions
          ? game.expansions.map((expansion) => expansion.name)
          : [],
        release_date:
          game.release_dates &&
          game.release_dates.length > 0 &&
          game.release_dates[0].human
            ? new Date(game.release_dates[0].human)
            : null,
        finished: false,
      });

      if (response.status === 200) {
        toast.info('Game added to wishlist.');
      } else {
        toast.error('Failed to add game to wishlist.');
      }
    } catch (error) {
      console.error('Error adding game to wishlist:', error);
      toast.error('Failed to add game to wishlist.');
    }
  };

  return !isInDatabase || isInWishlist ? (
    <FontAwesomeIcon
      icon={isInWishlist ? faCheckCircle : faHeartCirclePlus}
      className={`icon w-4 sm:w-6 h-auto cursor-pointer ml-3 ${
        isInWishlist ? 'text-red-500 cursor-default' : 'hover:text-red-600'
      }`}
      onClick={!isInWishlist ? handleAddToWishlist : undefined}
    />
  ) : (
    <div className='w-4 sm:w-6 h-auto ml-3 opacity-0'>
      <FontAwesomeIcon icon={faHeartCirclePlus} />
    </div>
  );
};

export default WishlistButton;
