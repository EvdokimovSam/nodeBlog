//вот это надо чтобы сервер запускался
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const postRoutes = require('./routes/post-routes');
const postApiRoutes = require('./routes/api-post-routes');
const contactRoutes = require('./routes/contact-routes');
const createPath = require('./helpers/create-path');

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

app.use(contactRoutes);
app.use(postRoutes);
app.use(postApiRoutes);
//рендер ошибки методом use
app.use((req, res) => {
    console.log(`404: Not Found - ${req.method} ${req.originalUrl}`);
    res
        .status(404)
        .sendFile(createPath('error'))
});