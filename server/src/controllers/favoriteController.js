import  Favorite  from "../models/favoriteModel.js";


// Add a package to favorites
export const addFavorite = async (req, res) => {
  try {
    const { userId, packageId } = req.body;

    // Check if the favorite already exists
    const existingFavorite = await Favorite.findOne({ userId, packageId });
    if (existingFavorite) {
      return res.status(400).json({ error: 'Package is already in favorites' });
    }

    const favorite = new Favorite({ userId, packageId });
    await favorite.save();

    res.status(201).json({ message: 'Package added to favorites', favorite });
  } catch (error) {
    res.status(500).json({ error: 'Error adding to favorites', details: error.message });
  }
};

// Get all favorites for a user
export const getFavoritesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const favorites = await Favorite.find({ userId }).populate('packageId');
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching favorites', details: error.message });
  }
};

// Remove a package from favorites
export const removeFavorite = async (req, res) => {
  try {
    const { userId, packageId } = req.body;
    console.log(userId, packageId);
    

    const favorite = await Favorite.findOneAndDelete({ userId, packageId });
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.status(200).json({ message: 'Package removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing favorite', details: error.message });
  }
};

// Get all users who favorited a specific package
export const getUsersByPackage = async (req, res) => {
  try {
    const { packageId } = req.params;

    const favorites = await Favorite.find({ packageId }).populate('userId');
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users', details: error.message });
  }
};
