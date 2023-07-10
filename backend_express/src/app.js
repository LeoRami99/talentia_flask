const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const cursoRoutes = require('./api/cursos/cursoRoutes');
const usuarioRoutes = require('./api/usuarios/usuarioRoutes');

const app = express();

// Crear un stream de escritura en modo 'append'
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// Configurar morgan para usar el stream de escritura
app.use(morgan('combined', { stream: accessLogStream }))

app.use(cors());
app.use(express.json());

app.use('/curso', cursoRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/imagenes', express.static(path.join(__dirname, 'images/curso')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

module.exports = app;
