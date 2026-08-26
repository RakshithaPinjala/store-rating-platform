import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, address, role: role || 'NORMAL_USER' }
    });
    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createStore = async (req, res) => {
  const { name, email, address, ownerName, ownerEmail, ownerPassword, ownerAddress } = req.body;
  try {
    const existingStore = await prisma.store.findUnique({ where: { email } });
    if (existingStore) return res.status(400).json({ message: 'Store email already exists' });

    const existingOwner = await prisma.user.findUnique({ where: { email: ownerEmail } });
    if (existingOwner) return res.status(400).json({ message: 'Owner email already exists' });

    const hashedPassword = await bcrypt.hash(ownerPassword, 10);

    const store = await prisma.$transaction(async (prisma) => {
      const owner = await prisma.user.create({
        data: { name: ownerName, email: ownerEmail, password: hashedPassword, address: ownerAddress, role: 'STORE_OWNER' }
      });
      return await prisma.store.create({
        data: { name, email, address, ownerId: owner.id }
      });
    });

    res.status(201).json({ message: 'Store and Owner created successfully', storeId: store.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUsers = async (req, res) => {
  const { search, role, sortBy = 'name', order = 'asc' } = req.query;
  try {
    const where = {
      ...(role ? { role } : {}),
      ...(search ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { address: { contains: search } }
        ]
      } : {})
    };

    const users = await prisma.user.findMany({
      where,
      orderBy: { [sortBy]: order },
      select: { id: true, name: true, email: true, address: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getStores = async (req, res) => {
  const { search, sortBy = 'name', order = 'asc' } = req.query;
  try {
    const where = search ? {
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
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
      return {
        id: store.id, name: store.name, email: store.email, address: store.address,
        averageRating: avg.toFixed(1), totalRatings: total
      };
    });
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { store: { include: { ratings: true } } }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let storeDetails = null;
    if (user.role === 'STORE_OWNER' && user.store) {
      const total = user.store.ratings.length;
      const avg = total > 0 ? user.store.ratings.reduce((a, c) => a + c.value, 0) / total : 0;
      storeDetails = { ...user.store, averageRating: avg.toFixed(1) };
      delete storeDetails.ratings;
    }

    res.json({
      id: user.id, name: user.name, email: user.email, address: user.address, role: user.role,
      store: storeDetails
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
