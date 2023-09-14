const express = require('express');
const {
    getPosts,
    addPost,
    getPost,
    deletePost,
    editPost,
} = require('../controllers/api-post-controller');

const router = express.Router();


router.get('/api/posts', getPosts);
router.post('/api/post/', addPost);
router.get('/api/post/:id', getPost);
router.delete('/api/post/:id', deletePost);
router.put('/api/post/:id', editPost);

module.exports = router;