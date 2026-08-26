import prisma from '../config/db.js';

export const getOwnerDashboard = async (req, res) => {
  const userId = req.user.userId;
  try {
    const store = await prisma.store.findUnique({
      where: { ownerId: userId },
      include: {
        ratings: {
          include: { user: { select: { id: true, name: true, email: true } } }
        }
      }
    });

    if (!store) {
      return res.status(404).json({ message: 'No store found for this owner' });
    }

    const total = store.ratings.length;
    const avg = total > 0 ? store.ratings.reduce((a, c) => a + c.value, 0) / total : 0;

    res.json({
      store: { id: store.id, name: store.name, averageRating: avg.toFixed(1) },
      raters: store.ratings.map(r => ({
        ratingId: r.id,
        value: r.value,
        userName: r.user.name,
        userEmail: r.user.email,
        updatedAt: r.updatedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
