const express = require('express');
const router = express.Router();
const Usuarios = require('./clase/UsuariosDB');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// la secret key del archivo de .env
const secret = process.env.SECRET_KEY;


router.post('/signup', async (req, res) => {
    const { nombre, apellidos, correo, password } = req.body;
    // Validación de los campos
    const validNamePattern = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
    const validEmailPattern = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!nombre || !apellidos || !correo || !password) {
        return res.status(400).json({ message: "Error al registrar usuario campos vacíos", status: 400 });
    }
    if (!validNamePattern.test(nombre) || !validNamePattern.test(apellidos) || !validEmailPattern.test(correo)) {
        return res.status(400).json({ message: "Error al registrar usuario campos inválidos", status: 400 });
    }
    try {
        const usuarioDB = new Usuarios(nombre, apellidos, correo);
        const userExists = await usuarioDB.verifyUser(correo);
        if (userExists) {
            return res.status(400).json({ message: "Usuario ya registrado", status: 400 });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const userCreated = await usuarioDB.registerUser(passwordHash);
        if (userCreated) {
            return res.status(200).json({ message: "Usuario registrado exitosamente", status: 200 });
        } else {
            return res.status(400).json({ message: "Error al registrar usuario", status: 400 });
        }
    } catch (e) {
        console.error(e);
        return res.status(400).json({ message: "Ocurrio un error en la API", status: 400 });
    }
});
router.post('/login', async (req, res) => {
    const { correo, password } = req.body;
    try{
        const usuario = new Usuarios('', '', correo);
        const user  = await usuario.getUser();
        if(user && bcrypt.compareSync(password, user.password)){
            const token = jwt.sign({id:user.id}, secret, {expiresIn: '1h'});
            res.status(200).json({ message: 'Usuario logueado exitosamente', status: 200, access_token: token });
        }else{
            res.status(401).json({ message: 'Usuario o contraseña incorrectos', status: 401 });
        }
    }catch(e){
        console.error(e);
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});


module.exports = router;
