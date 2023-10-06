const express = require('express');
const router = express.Router();
const Usuarios = require('./clase/UsuariosDB');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middlewares/authenticateToken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
// la secret key del archivo de .env
const secret = process.env.SECRET_KEY;



// aqui va la configuración de la subidad de imagenes de perfil del usuario
const storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            // en local se usa esta ruta
            cb(null, 'src/images/foto_perfil');
            //en producción se usa esta ruta
            // cb(null, 'images/foto_perfil');
        },
        filename: function (req, file, cb) {
            let ext = path.extname(file.originalname);
            if (file.fieldname === "foto_perfil") {
                cb(null, 'perfil_' + Date.now() + ext);
            } else {
                cb(null, file.originalname); // Para otros campos o como opción por defecto
            }
        }
    });
const upload_image_perfil = multer({ storage: storage });
router.post('/upload_imagen_perfil', upload_image_perfil.fields([{ name: 'foto_perfil' }]), async (req, res) => {
    try {

        if (req.files.foto_perfil) {
            let response_data = {
                "message": "Imagen de foto de perfil subida exitosamente",
                "status": 200,

                "foto_perfil": req.files.foto_perfil[0].filename
            };
            // console.log(response_data);
            res.status(200).json(response_data);
        } else {
            res.status(400).json({ message: 'No se pudo subir la imagen', status: 400 });
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});
router.put('/actualizar-foto-perfil', async (req, res) => {
    try {
        const { id_usuario, foto_perfil } = req.body;
        const usuario = new Usuarios()
        if (await usuario.actualizarFotoPerfil(id_usuario, foto_perfil)) {
            res.status(200).json({ message: 'Foto de perfil actualizada exitosamente', status: 200 });
        } else {
            res.status(400).json({ message: 'No se pudo actualizar la foto de perfil', status: 400 });
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});
router.get('/get-foto-perfil/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = new Usuarios()
        const data = await usuario.getFotoPerfil(id);
        if (data) {
            res.status(200).json({ message: 'Foto de perfil', status: 200, data });
        } else {
            res.status(404).json({ message: 'Foto de perfil no encontrada', status: 404 });
        } 
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});


router.post('/signup', async (req, res) => {
    const { nombre, apellidos, correo, password, rol } = req.body;
    // Validación de los campos
    const validNamePattern = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
    const validEmailPattern = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!nombre || !apellidos || !correo || !password || !rol) {
        return res.status(400).json({ message: "Error al registrar usuario campos vacíos", status: 400 });
    }
    if (!validNamePattern.test(nombre) || !validNamePattern.test(apellidos) || !validEmailPattern.test(correo.toLowerCase())) {
        return res.status(400).json({ message: "Error al registrar usuario campos inválidos", status: 400 });
    }
    try {
        const usuarioDB = new Usuarios(nombre, apellidos, correo.toLowerCase(), rol);
        const userExists = await usuarioDB.verifyUser(correo.toLowerCase());
        if (userExists) {
            return res.status(400).json({ message: "Usuario ya registrado", status: 400 });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const token = createTokenMail();
        const userCreated = await usuarioDB.registerUser(passwordHash);
        const verficacionCuenta = await usuarioDB.createVerficacion(correo.toLowerCase(), token);
        if (userCreated && verficacionCuenta) {
            envioMailActivacionCuenta(correo.toLowerCase(), token);
            return res.status(200).json({ message: "Usuario registrado exitosamente", status: 200 });
        } else {
            return res.status(400).json({ message: "Error al registrar usuario", status: 400 });
        }
    } catch (e) {
        console.error(e);
        return res.status(400).json({ message: "Ocurrio un error en la API", status: 400 });
    }
});

// hacer función de verificación de email cuando se crea la cuenta
const createTokenMail = () => {
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return randomString
}

function envioMailActivacionCuenta(correo, token) {
    let transporter = nodemailer.createTransport({
        port: 465,
        host: process.env.EMAIL_HOST,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: correo,
        subject: 'Activación de cuenta',
        text: 'Para activar tu cuenta haz click en el siguiente enlace: ' + process.env.URL_FRONTEND + '/activar-cuenta/' + token

    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Email enviado: ' + info.response);
            return true;
        }
    })
}



router.post('/verify-account', async (req, res) => {
    try {
        const dataReq = req.body
        const usuario = new Usuarios();
        // verificar que el token exista en la base de datos
        const tokenExist = await usuario.verifyTokenExist(dataReq.token);
        if (tokenExist) {
            const data = await usuario.verifyAccountState(dataReq.token);
            if (data) {
                res.status(200).json({ message: 'Cuenta activada exitosamente', status: 200 });
            } else {
                res.status(400).json({ message: 'No se pudo activar la cuenta', status: 400 });
            }
        } else {
            res.status(400).json({ message: 'El token no existe', status: 400 });
        }
    } catch (error) {
        // console.log(error)
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});




router.post('/login', async (req, res) => {
    const { correo, password } = req.body;
    try {
        const usuario = new Usuarios('', '', correo);
        const user = await usuario.getUser();
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id, rol: user.rol }, secret, { expiresIn: '24h' });
            res.status(200).json({ message: 'Usuario logueado exitosamente', status: 200, access_token: token });
        } else {
            res.status(401).json({ message: 'Usuario o contraseña incorrectos', status: 401 });
        }
    } catch (e) {
        console.error(e);
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});
router.get('/data-usuario/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Usuarios.dataUser(id);
        if (data) {
            res.status(200).json({ message: 'Datos del usuario', status: 200, data });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado', status: 404 });
        }
    } catch (e) {
        console.error(e);
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});

router.get("/count-users", async (req, res) => {
    try {
        const count = await Usuarios.countUsers();
        if (count) {
            res.status(200).json({ message: 'Datos del usuario', status: 200, count });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado', status: 404 });
        }
    } catch (e) {

        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});

router.post("/create-profile", async (req, res) => {
    try {
        const usuario = new Usuarios()
        const { id_usuario, nombre_usuario, sobre_mi, url_cv, num_telefono } = req.body;
        if (!await usuario.ProfileExist(id_usuario)) {
            console.log("El perfil no existe");
            if (await usuario.createProfile(id_usuario, nombre_usuario, sobre_mi, url_cv, num_telefono)) {
                res.status(200).json({ message: 'Perfil creado exitosamente', status: 200 });
            } else {
                res.status(400).json({ message: 'No se pudo crear el perfil', status: 400 });
            }
        } else {
            console.log("El perfil ya existe");
            res.status(400).json({ message: 'El perfil ya existe', status: 400 });
        }
    } catch (error) {
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});


// verificar estado cuenta
router.get("/verify-account-state/:correo", async (req, res) => {
    try {
        const { correo } = req.params;
        const usuario = new Usuarios()
        const data = await usuario.verificarStateAccount(correo);
        if (data) {
            res.status(200).json({ message: 'Cuenta activada', status: 200, data: data });
        } else {
            res.status(400).json({ message: 'Cuenta no activada', status: 400, data: data });
        }
    } catch (error) {
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});



router.get("/profile-exist/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = new Usuarios()
        if (await usuario.ProfileExist(id)) {
            res.status(200).json({ message: 'El perfil existe', status: 200, data: true });
        } else {
            res.status(400).json({ message: 'El perfil no existe', status: 400, data: false });
        }
    } catch (error) {
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});
router.get("/get-profile/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = new Usuarios()
        const data = await usuario.getProfileById(id);
        if (data) {
            res.status(200).json({ message: 'Datos del perfil', status: 200, data });
        } else {
            res.status(404).json({ message: 'Perfil no encontrado', status: 404 });
        }
    } catch (error) {
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
})
router.put("/update-profile", async (req, res) => {
    try {
        const usuario = new Usuarios()
        const { id, nombre, apellido, correo, nombre_usuario, sobre_mi, url_cv, num_telefono } = req.body;
        if (await usuario.updatePerfilAll(id, nombre_usuario, sobre_mi, url_cv, num_telefono, nombre, apellido, correo)) {
            res.status(200).json({ message: 'Perfil actualizado exitosamente', status: 200 });
        } else {
            res.status(400).json({ message: 'No se pudo actualizar el perfil', status: 400 });
        }
    } catch (error) {
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
});

router.post('/restore-password', async (req, res) => {
    try {
        const { correo } = req.body;
        const usuario = new Usuarios();
        const user = await usuario.getUserByemail(correo);
        if (user.length > 0) {
            const codigo = generarCodigoResetPass();
            if (await usuario.insertDataCodePass(user[0].id, codigo, new Date(), 0)) {
                if (!envioCorreoCodigo(user[0].correo, codigo)) {
                    res.status(200).json({ message: 'Se envio un correo con el codigo para restablecer la contraseña', status: 200 });
                } else {
                    res.status(400).json({ message: 'No se pudo enviar el correo', status: 400 });
                }
            } else {
                res.status(400).json({ message: 'No se pudo enviar el correo', status: 400 });
            }
        } else {
            console.log(user);
            res.status(404).json({ message: 'Usuario no encontrado', status: 404 });
        }
    } catch (error) {
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
})
router.post('/verify-code', async (req, res) => {
    try {
        const { codigo, correo } = req.body;
        const usuario = new Usuarios();
        const user = await usuario.getUserByemail(correo);
        if (user.length > 0) {
            const data = await usuario.verifyCodePass(user[0].id, codigo);
            if (data) {
                res.status(200).json({ message: 'Código correcto', status: 200 });
            } else {
                res.status(400).json({ message: 'Código incorrecto', status: 400 });
            }
        } else {
            res.status(404).json({ message: 'Usuario no encontrado', status: 404 });
        }
    } catch (error) {
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
})
router.post('/update-password', async (req, res) => {
    try {
        const { correo, password } = req.body;
        const usuario = new Usuarios();
        const user = await usuario.getUserByemail(correo);
        if (user.length > 0) {
            const passwordHash = await bcrypt.hash(password, 10);
            if (await usuario.updatePassword(user[0].id, passwordHash, 1)) {
                res.status(200).json({ message: 'Contraseña actualizada', status: 200 });
            } else {
                res.status(400).json({ message: 'No se pudo actualizar la contraseña', status: 400 });
            }
        } else {
            res.status(404).json({ message: 'Usuario no encontrado', status: 404 });
        }
    } catch (error) {
        res.status(400).json({ message: 'Ocurrio un error en la API', status: 400 });
    }
})

function generarCodigoResetPass() {
    let codigo = '';
    let caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let caracteresLength = caracteres.length;
    for (let i = 0; i < 10; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteresLength));
    }
    return codigo;
}

function envioCorreoCodigo(correo, codigo) {
    let transporter = nodemailer.createTransport({
        port: 465,
        host: process.env.EMAIL_HOST,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: correo,
        subject: 'Código para restablecer contraseña',
        text: 'Su código para restablecer la contraseña es: ' + codigo

    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Email enviado: ' + info.response);
            return true;
        }
    })
}


module.exports = router;
