import prisma from '../config/db.js';

export const getStoresForUser = async (req, res) => {
  const { search, sortBy = 'name', order = 'asc' } = req.query;
  const userId = req.user.userId;
  
  try {
    const where = search ? {
      OR: [
        { name: { contains: search } },
        { address: { contains: search } }
      ]
    } : {};

    const stores = await prisma.store.findMany({
      where,
      orderBy: { [sortBy]: order },
      include: { ratings: true }
    });

    const formatted = stores.map(store => {
      const total = store.ratings.length;
      const avg = total > 0 ? store.ratings.reduce((a, c) => a + c.value, 0) / total : 0;
      const userRating = store.ratings.find(r => r.userId === userId)?.value || null;
      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: avg.toFixed(1),
        userSubmittedRating: userRating
      };
    });
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const rateStore = async (req, res) => {
  const { storeId } = req.params;
  const { value } = req.body;
  const userId = req.user.userId;

  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
  }

  try {
    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: { userId, storeId }
      },
      update: { value },
      create: { value, userId, storeId }
    });
    res.json({ message: 'Rating submitted successfully', rating });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
