import FavoriteRoom from '../models/FavoriteRoom.js';

// Get all (optional)
export const getAllFavorites = async (req, res) => {
  try {
    const favorites = await FavoriteRoom.find().populate('user category');
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get favorites by user
export const getFavoritesByUser = async (req, res) => {
  try {
    const favorites = await FavoriteRoom.find({ user: req.params.userId }).populate('category');
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add to favorites
export const addFavoriteRoom = async (req, res) => {
  try {
    const { user, category } = req.body;

    const favorite = new FavoriteRoom({ user, category });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove favorite
export const deleteFavoriteRoom = async (req, res) => {
  try {
    const { user, category } = req.params;
    await FavoriteRoom.findOneAndDelete({
      user: user,
      category: category
    });
    res.json({ message: 'Đã xoá khỏi danh sách yêu thích' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
