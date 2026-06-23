const express = require('express');
const cors    = require('cors');
const { PrismaClient } = require('@prisma/client');

const app    = express();
const prisma = new PrismaClient();
const PORT   = 3000;

app.use(express.json());
app.use(cors()); 

app.get('/api/movies', async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({
      success: true,
      data: movies
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch movies.' });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const movie = await prisma.movie.findUnique({ where: { id } });
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    return res.status(200).json({ success: true, data: movie });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch movie.' });
  }
});

app.post('/api/movies', async (req, res) => {
  const { title, year, director, genre, rating, status, notes } = req.body;

  if (!title || !year || !genre) {
    return res.status(400).json({
      message: 'Title, year and genre are required.'
    });
  }

  try {
    const newMovie = await prisma.movie.create({
      data: {
        title,
        year:     parseInt(year),
        director: director || null,
        genre,
        rating:   rating ? parseFloat(rating) : null,
        status:   status || 'plan',
        notes:    notes || null,
      }
    });
    return res.status(201).json({ success: true, data: newMovie });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create movie.' });
  }
});

app.put('/api/movies/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, year, director, genre, rating, status, notes } = req.body;

  if (!title || !year || !genre) {
    return res.status(400).json({
      message: 'Title, year and genre are required.'
    });
  }

  try {
    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: {
        title,
        year:     parseInt(year),
        director: director || null,
        genre,
        rating:   rating ? parseFloat(rating) : null,
        status:   status || 'plan',
        notes:    notes || null,
      }
    });
    return res.status(200).json({ success: true, data: updatedMovie });
  } catch (error) {
    if (error.code === 'P2025')
      return res.status(404).json({ message: 'Movie not found.' });
    return res.status(500).json({ message: 'Failed to update movie.' });
  }
});

app.delete('/api/movies/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.movie.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025')
      return res.status(404).json({ message: 'Movie not found.' });
    return res.status(500).json({ message: 'Failed to delete movie.' });
  }
});

app.post('/api/auth/register', (req, res) => {
  res.status(200).json({ message: 'Auth coming in Project 3!' });
});

app.post('/api/auth/login', (req, res) => {
  res.status(200).json({ message: 'Auth coming in Project 3!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});