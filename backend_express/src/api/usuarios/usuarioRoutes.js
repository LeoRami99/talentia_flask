const express = require('express');
const router = express.Router();
const Usuarios = require('./clase/UsuariosDB');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middlewares/authenticateToken');
// la secret key del archivo de .env
const secret = process.env.SECRET_KEY;


router.post('/signup', async (req, res) => {
    const { nombre, apellidos, correo, password, rol } = req.body;
    // Validación de los campos
    const validNamePattern = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
    const validEmailPattern = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!nombre || !apellidos || !correo || !password || !rol) {
        return res.status(400).json({ message: "Error al registrar usuario campos vacíos", status: 400 });
    }
    if (!validNamePattern.test(nombre) || !validNamePattern.test(apellidos) || !validEmailPattern.test(correo)) {
        return res.status(400).json({ message: "Error al registrar usuario campos inválidos", status: 400 });
    }
    try { 
        const usuarioDB = new Usuarios(nombre, apellidos, correo, rol);
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
            const token = jwt.sign({id:user.id, rol: user.rol}, secret, {expiresIn: '24h'});
            res.status(200).json({ message: 'Usuario logueado exitosamente', status: 200, access_token: token });
        }else{
            res.status(401).json({ message: 'Usuario o contraseña incorrectos', status: 401 });
        }
    }catch(e){
        console.error(e);
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});
router.get('/data-usuario/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try{
        const data = await Usuarios.dataUser(id);
        if(data){
            res.status(200).json({ message: 'Datos del usuario', status: 200, data});
        }else{
            res.status(404).json({ message: 'Usuario no encontrado', status: 404 });
        }
    }catch(e){
        console.error(e);
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});

router.get("/count-users" , async (req, res) => {
    try{
        const count = await Usuarios.countUsers();
        if(count){
            res.status(200).json({ message: 'Datos del usuario', status: 200, count});
        }else{
            res.status(404).json({ message: 'Usuario no encontrado', status: 404 });
        }
    }catch(e){
        
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});

router.post("/create-profile" , async (req, res) => {
    try {
        const usuario = new Usuarios()
        const { id_usuario, nombre_usuario, sobre_mi, url_cv, num_telefono} = req.body;
        if(!await usuario.ProfileExist(id_usuario)){
            console.log("El perfil no existe");
            if(await usuario.createProfile(id_usuario, nombre_usuario, sobre_mi, url_cv, num_telefono)){
                res.status(200).json({ message: 'Perfil creado exitosamente', status: 200 });
            }else{
                res.status(400).json({ message: 'No se pudo crear el perfil', status: 400 });
            }
        }else{
            console.log("El perfil ya existe");
            res.status(400).json({ message: 'El perfil ya existe', status: 400 });
        }
    } catch (error) {
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});
router.get("/profile-exist/:id" , async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = new Usuarios()
        if(await usuario.ProfileExist(id)){
            res.status(200).json({ message: 'El perfil existe', status: 200, data: true});
        }else{
            res.status(400).json({ message: 'El perfil no existe', status: 400, data: false});
        }
    } catch (error) {
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});
router.get("/get-profile/:id" , async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = new Usuarios()
        const data = await usuario.getProfileById(id);
        if(data){
            res.status(200).json({ message: 'Datos del perfil', status: 200, data});
        }else{
            res.status(404).json({ message: 'Perfil no encontrado', status: 404 });
        }
    } catch (error) {
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
})
router.put("/update-profile" , async (req, res) => {
    try {
        const usuario = new Usuarios()
        const { id, nombre, apellido, correo, nombre_usuario, sobre_mi, url_cv, num_telefono} = req.body;
        if(await usuario.updatePerfilAll(id, nombre_usuario, sobre_mi, url_cv, num_telefono, nombre, apellido, correo)){
            res.status(200).json({ message: 'Perfil actualizado exitosamente', status: 200 });
        }else{
            res.status(400).json({ message: 'No se pudo actualizar el perfil', status: 400 });
        }
    } catch (error) {
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });   
    }
});


module.exports = router;
