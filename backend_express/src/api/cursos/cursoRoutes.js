const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Aquí importarías las funciones del controlador para cada ruta
const CursoDB = require('./clase/CursoDB');
const { getCurso, getCursos, createCurso, updateCurso, deleteCurso, getCategorias} = require('./clase/CursoDB');
// Confiuración de multer para subir archivos y la subida de imagenes
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'src/images/curso');
    },
    filename: function(req, file, cb) {
        let ext = path.extname(file.originalname);
        if (file.fieldname === "imagen_portada") {
            cb(null, 'portada_' + Date.now() + ext);
        } else if (file.fieldname === "imagen_card") {
            cb(null, 'card_' + Date.now() + ext);
        } else {
            cb(null, file.originalname); // Para otros campos o como opción por defecto
        }
    }
});

const upload = multer({storage: storage});
router.post('/upload_imagenes_curso', upload.fields([{name: 'imagen_portada'}, {name: 'imagen_card'}]), (req, res) => {
    if (req.files.imagen_portada && req.files.imagen_card) {
        let response_data = {
            "message": "Imagenes subidas correctamente",
            "status": 200,
            "imagen_portada": req.files.imagen_portada[0].filename,
            "imagen_card": req.files.imagen_card[0].filename
        };
        console.log(response_data);
        res.status(200).json(response_data);
    } else {
        let response_data = {"message": "No hay imagenes", "status": 400};
        res.status(400).json(response_data);
    }
});

// Craer curso
router.post('/create', async (req, res) => {
    try {
        const datos = req.body;
        const titulo_curso = datos.title;
        const descripcion_curso = datos.description;
        const imagen_portada = datos.imagen_portada;
        const imagen_card = datos.imagen_card;
        const trailer = datos.url_video_intro;
        const precio = datos.price;
        const id_instructor = 1; // Esto puede cambiar si es dinámico
        const estado = 1; // Esto puede cambiar si es dinámico
        const dificultad = datos.dificultad;
        const categoria = datos.categoria;
        if (titulo_curso !== '' && descripcion_curso !== '' && imagen_portada !== '' && imagen_card !== '' && trailer !== '' && precio !== '' && id_instructor !== '' && estado !== '' && dificultad !== '' && categoria !== '') {
            let curso = new CursoDB(imagen_portada, imagen_card, titulo_curso, descripcion_curso, trailer, precio, id_instructor, estado, dificultad);
            const curso_id = await curso.createCurso();
            console.log(curso_id);

            await curso.createCategoria(curso_id, categoria);
            if (datos.sections) {
                for (let seccion of datos.sections) {
                    const seccion_id = await curso.createSection(curso_id, seccion.headerTitle, seccion.descriptionSection, 1);
                    if (seccion.items) {
                        for (let subsection of seccion.items) {
                            await curso.createSubsection(seccion_id, subsection.title, subsection.url, subsection.descripcion);
                        }
                    }
                }
            }
            return res.status(200).json({"message": "Curso creado", "status": 200});
        } else {
            return res.status(400).json({"message": "No hay datos", "status": 400});
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({"message": "Error en el servidor", "status": 500});
    }
});

// obtener todos los cursos
router.get('/get-cursos', async (req, res) => {
    try {
        const cursos = await getCursos();
        res.json(cursos);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});
router.get('/get-categorias', async (req, res) => {
    try{
        const categorias = await getCategorias();
        res.json(categorias);
    }catch(err){
        res.status(500).json({ error: err.toString() });
    }
});
router.get('/get-curso/:id', async (req, res) => {
    try{
        console.log(req.params.id);

        const curso = await getCurso(req.params.id);
        res.json({'status':200, curso});
    }catch(err){
        res.status(500).json({ error: err.toString() });
    }
})

// router.get('/:id', getCursos);
// router.post('/', createCurso);
// router.put('/:id', updateCurso);
// router.delete('/:id', deleteCurso);

module.exports = router;
