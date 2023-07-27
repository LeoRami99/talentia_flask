const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ExamenDB = require('./clase/ExamenDB');



// contralodr para subir imagenes
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // en local se usa esta ruta
        cb(null, 'src/images/examen');
        //en producción se usa esta ruta
        // cb(null, 'images/examen');
    },
    filename: function(req, file, cb) {
        let ext = path.extname(file.originalname);
        if (file.fieldname === "imagen") {
            cb(null, 'imagen_examen_' + Date.now() + ext);
        } else {
            cb(null, file.originalname); // Para otros campos o como opción por defecto
        }
    }
});

const upload = multer({storage: storage});
router.post('/upload_imagen_examen', upload.fields([{name: 'imagen'}]), (req, res) => {
    try{
        if (req.files.imagen) {
            let response_data = {
                "message": "Imagenes subida correctamente",
                "status": 200,
                "imagen_examen": req.files.imagen[0].filename
            };
            // console.log(response_data);
            res.status(200).json(response_data);
        } else {
            // console.log("No hay imagenes");
            let response_data = {"message": "No hay imagenes", "status": 400};
            res.status(400).json(response_data);
        }
    } catch (err) {
        // console.log("Error al subir las imagenes");
        console.error(err);  // Agrega esta línea
        let response_data = {"message": "Error al subir las imagenes", "status": 500};
        res.status(500).json(response_data);
    }
});


router.get('/hola', (req, res) => {
    res.send('Hola desde examen Routes');
});
router.post('/crear', async (req, res) => {
    try{
        const datos = req.body;
        const nombre  = datos.nombre;
        const descripcion = datos.descripcion;
        const imagen = datos.imagen;
        const tiempo = datos.tiempo;
        console.log(datos);
        if (nombre !== '' && descripcion !== '' && imagen !== '' && tiempo !==''){
            const examen = new ExamenDB(nombre, descripcion, imagen, tiempo);
            const examen_id = await examen.create();
            console.log(examen_id);
            const preguntas = datos.preguntas;
            preguntas.forEach(async elementos => {
                const id_pregunta = await examen.createPregunta(examen_id, elementos.pregunta);
                const opciones = elementos.opciones;
                opciones.forEach(async opcion => {
                    await examen.createOpciones(id_pregunta, opcion.opcion, opcion.opcion_correcta);
                });
            });
            return res.status(200).json({"message": "Examen creado correctamente", "status": 200});
        }else{
            return res.status(400).json({"message": "Faltan datos para crear el examen", "status": 400});
        }
    }
    catch(e){
        console.error(e);
        return res.status(500).json({"message": "Error al crear el examen", "status": 500});
    }
});

router.get('/get-examens', async (req, res) => {
    res.json(await ExamenDB.getExamenes());
});
router.get('/get-examen/:id', async (req, res) => {
    const id_examen = req.params.id;
    try {
        const examen = await ExamenDB.getExamen(id_examen);
        res.status(200).json({'status':200, 'examen': examen});
    } catch (error) {
        console.error(error);
        res.status(500).json({"message": "Error al obtener el examen", "status": 500});
    }
    
});

// actualizar estado del examen
router.put('/update-estado-examen', async (req, res) => {
    try{
        const id_examen = req.body.id;
        const estado = req.body.estado;
        const examen = await ExamenDB.updateEstado(id_examen, estado);
        if (examen) {
            res.status(200).json({"message": "Estado del examen actualizado correctamente", "status": 200});
        }else{
            res.status(400).json({"message": "Error al actualizar el estado del examen", "status": 400});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({"message": "Error al actualizar el estado del examen", "status": 500});
    }
});

// funciones para crear opciones por separado sin dependencia del constructor de la clase ExamenDB
router.post('/crear-opciones', async (req, res) => {
    try{
        const id_pregunta = req.body.id_pregunta;
        const opcion = req.body.opcion;
        const opcion_correcta = req.body.opcion_correcta;
        const examen = new ExamenDB();
        const respuesta = await examen.createOpciones(id_pregunta, opcion, opcion_correcta);
        if (respuesta) {
            res.status(200).json({"message": "Opcion creada correctamente", "status": 200});
        }else{
            res.status(400).json({"message": "Error al crear la opcion", "status": 400});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({"message": "Error al crear las opciones", "status": 500});
    }
});

module.exports = router;