const express = require('express');
const { uuid } = require('uuidv4');
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const logger = require('../logger');
const { bookmarks } = require('../store');

bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  });

bookmarkRouter
  .route('/bookmark/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(b => b.id === parseInt(id));
  
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).send('Bookmark Not Found');
    }
    res.json(bookmark);
  });

bookmarkRouter
  .route('/bookmark')
  .post(bodyParser, (req, res) => {
    const { title, rating, description, url } = req.body;
  
    if (!title) {
      logger.error('Missing Title');
      return res.status(400).send('Missing Title');
    }
  
    if (!rating || !Number(rating) || rating < 0 || rating > 5) {
      logger.error('Missing Rating');
      return res.status(400).send('Missing Rating');
    }
  
    if (!description) {
      logger.error('Missing Description');
      return res.status(400).send('Missing Description');
    }
  
    if (!url) {
      logger.error('Missing Url');
      return res.status(400).send('Missing Url');
    }
  
    const id = uuid();
  
    const bookmark = {
      id,
      title,
      rating,
      description
    };
  
    bookmarks.push(bookmark);
    logger.info(`Bookmark with id ${id} created`);
  
    res
      .status(201)
      .location(`http://localhost:8000/bookmark/${id}`)
      .json(bookmark);
  });

bookmarkRouter
  .route('/bookmark/:id')
  .delete((req, res) => {
    const { id } = req.params;
  
    const bookmarkIndex = bookmarks.findIndex(li => li.id === parseInt(id));
  
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).send('Not Found');
    }
  
    bookmarks.splice(bookmarkIndex, 1);
  
    logger.info(`Bookmark with id ${id} deleted.`);
    res.status(204).end();
  });

module.exports = bookmarkRouter;