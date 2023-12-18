const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://0.0.0.0:27017/lab07', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected!');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

const peliculaSchema = new mongoose.Schema({
  titulo: String,
  director: String,
  genero: String
});

const Pelicula = mongoose.model('Pelicula', peliculaSchema);

app.set('view engine', 'pug');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/form', (req, res) => {
  res.render('formulario');
});

app.post('/guardar', (req, res) => {
  const { titulo, director, genero } = req.body;

  const newPelicula = new Pelicula({
    titulo,
    director,
    genero
  });

  newPelicula.save().then(() => {
    res.redirect('/');
  }).catch((error) => {
    console.error('Error creating movie:', error);
  });
});

app.get('/', (req, res) => {
  Pelicula.find().then((peliculas) => {
    res.render('lista', { peliculas });
  }).catch((error) => {
    console.error('Error retrieving movies:', error);
  });
});

app.use('/public', express.static('public'));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
