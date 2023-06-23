const express = require('express');
const cors = require('cors');
const cursoRoutes = require('./api/cursos/cursoRoutes');
const usuarioRoutes = require('./api/usuarios/usuarioRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/curso', cursoRoutes);
app.use('/usuarios', usuarioRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

module.exports = app;
