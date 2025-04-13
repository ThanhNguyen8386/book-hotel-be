import { Router } from "express";
import {
  getFavoritesByUser,
  addFavoriteRoom,
  deleteFavoriteRoom,
  getAllFavorites
} from '../controller/favoriteRoom.controller.js';

const router = Router();

router.get('/getAllFavorites', getAllFavorites); // Optional: lấy toàn bộ favorites
router.get('/getFavoritesByUser/:userId', getFavoritesByUser);
router.post('/addFavoriteRoom', addFavoriteRoom);
router.delete('/deleteFavoriteRoom/:userId/:roomId', deleteFavoriteRoom);

module.exports = router;
