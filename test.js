//вот это надо чтобы сервер запускался
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Post = require('./models/post');
const Contact = require('./models/contact');

const app = express();
app.set('view engine', 'ejs');
const PORT = 3000;
const db = 'mongodb+srv://semaevdokimov00:260816@cluster0.xservsi.mongodb.net/data?retryWrites=true&w=majority';

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => console.log('Connect to DB'))
    .catch((error) => console.log(error));


app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
});

//файловая работа
const path = require('path');
const createPath = (page) => path.resolve(__dirname, 'ejs-views', `${page}.ejs`);

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.urlencoded({ extended: false }));

app.use(express.static('styles'));

app.use(methodOverride('_method'));

// начало роутинга
app.use(express.json());
app.get('/', (req, res) => {
    const title = 'Home';
    res.render(createPath('index'), { title });
});


app.get('/contacts', (req, res) => {
    const title = 'Contacts';
    Contact
        .find()
        .then((contacts) => res.render(createPath('contacts'), { contacts, title }))
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});

app.get('/posts/:id', (req, res) => {
    const title = 'Post';
    Post
        .findById(req.params.id)
        .then(post => res.render(createPath('post'), { post, title }))
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});

app.get('/edit/:id', (req, res) => {
    const title = 'Edit Post';
    Post
        .findById(req.params.id)
        .then(post => res.render(createPath('edit-post'), { post, title }))
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});

app.put('/edit/:id', (req, res) => {
    const { title, author, text } = req.body
    const { id } = req.params;
    Post
        .findByIdAndUpdate(id, { title, author, text })
        .then(result => res.redirect(`/posts/${id}`))
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});

app.delete('/posts/:id', (req, res) => {
    Post
        .findByIdAndDelete(req.params.id)
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});

app.get('/posts', (req, res) => {
    const title = 'Posts';
    Post
        .find()
        .sort({ createdAt: -1 })
        .then((posts) => res.render(createPath('posts'), { posts, title }))
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
});


app.post('/add-post', (req, res) => {
    const { email, title, author, text } = req.body;
    const post = new Post({ email, title, author, text });
    post
        .save()
        .then((posts) => res.redirect('/posts'))
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        })
});



app.get('/add-post', (req, res) => {
    const title = 'Add Post';
    res.render(createPath('add-post'), { title });
});

//рендер ошибки методом use
app.use((req, res) => {
    console.log(`404: Not Found - ${req.method} ${req.originalUrl}`);
    res
        .status(404)
        .sendFile(createPath('error'))
});