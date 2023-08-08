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
        // console.log(datos);
        if (nombre !== '' && descripcion !== '' && imagen !== '' && tiempo !==''){
            const examen = new ExamenDB(nombre, descripcion, imagen, tiempo);
            const examen_id = await examen.create();
            // console.log(examen_id);
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
router.post('/create-opcion', async (req, res) => {
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
// eliminar opción
router.delete('/delete-opcion', async (req, res) => {
    try{
        const id_opcion = req.body.id;
        // console.log(id_opcion);
        const examen = new ExamenDB();
        const respuesta = await examen.deleteOpciones(id_opcion);
        if (respuesta) {
            res.status(200).json({"message": "Opcion eliminada correctamente", "status": 200});
        }else{
            res.status(400).json({"message": "Error al eliminar la opcion", "status": 400});
        }
    }catch(error){
        console.log(error)
        res.status(500).json({"message": "Error al eliminar la opcion", "status": 500});
    }
})

// ruta para actualización de examen, preguntas y opciones
router.put('/update-examen', async (req, res) => {
    try{
        // console.log(req.body);
        const [id, nombre, descripcion, imagen, tiempo, preguntas] = [req.body.id, req.body.nombre, req.body.descripcion, req.body.imagen, req.body.tiempo, req.body.preguntas];
        const examen = new ExamenDB();
        const respuesta = await examen.updateExamen(id, nombre, descripcion);
		preguntas.forEach(async (pregunta) => {
			const respuesta_pregunta = await examen.updatePregunta(
					pregunta.id,
					pregunta.pregunta
				);
			pregunta.opciones.forEach(async (opcion) => {
				const respuesta_opcion = await examen.updateOpciones(
						opcion.id,
						opcion.opcion,
						opcion.opcion_correcta
					);
				});
			});
        if (respuesta) {
            res.status(200).json({"message": "Examen actualizado correctamente", "status": 200});
        }else{
            res.status(400).json({"message": "Error al actualizar el examen", "status": 400});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({"message": "Error al actualizar el examen", "status": 500});
    }
})

router.post('/create-pregunta', async (req, res) => {
    try{
        
        const [id_examen, pregunta, opciones] = [req.body.id_examen, req.body.pregunta, req.body.opciones];
        // console.log(id_examen, pregunta, opciones);
        const examen = new ExamenDB();
        const respuesta = await examen.createPregunta(id_examen, pregunta);
        opciones.forEach(async (elemento) => {
            await examen.createOpciones(respuesta, elemento.opcion, elemento.opcion_correcta);
        });
        res.status(200).json({"message": "Pregunta creada correctamente", "status": 200});
    }catch(error){
        console.error(error);
        res.status(500).json({"message": "Error al crear la pregunta", "status": 500});
    }
})
router.delete('/delete-pregunta', async (req, res) => {
    try{
        const id_pregunta = req.body.id;
        const examen = new ExamenDB();
        const respuesta_opciones = await examen.deleteOpcionesByPregunta(id_pregunta);
        const respuesta = await examen.deletePregunta(id_pregunta);
        if (respuesta) {
           res.status(200).json({"message": "Pregunta eliminada correctamente", "status": 200});
        }else{
            res.status(400).json({"message": "Error al eliminar la pregunta", "status": 400});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({"message": "Error al eliminar la pregunta", "status": 500});
    }
});
// sección para el manejo de la creación de progreso de usuario por examen

router.post('/create-progreso', async (req, res) => {
    try{
        const id_examen = req.body.id_examen;
        const id_usuario = req.body.id_usuario;
        const examen = new ExamenDB();
        const respuesta = await examen.createProgreso(id_examen, id_usuario);
        if (respuesta) {
            res.status(200).json({"message": "Progreso creado correctamente", "status": 200});
        }else{
            res.status(400).json({"message": "Error al crear el progreso", "status": 400});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({"message": "Error al crear el progreso", "status": 500});
    }
});
router.get('/get-progreso/:id_examen/:id_usuario', async (req, res) => {
    try{
        const id_examen = req.params.id_examen;
        const id_usuario = req.params.id_usuario;
        const examen = new ExamenDB();
        const respuesta = await examen.getProgreso(id_examen, id_usuario);
        if (respuesta) {
            res.status(200).json({"message": "Progreso obtenido correctamente", "status": 200, "data": respuesta});
        }else{
            res.status(400).json({"message": "Error al obtener el progreso", "status": 400});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({"message": "Error al obtener el progreso", "status": 500});
    }
});
router.put('/update-progreso', async (req, res) => {
    try{
        const id_examen = req.body.id_examen;
        const id_usuario = req.body.id_usuario;
        const progreso = req.body.progreso;
        const fecha_actual = new Date();
        // console.log(fecha_actual);
        const examen = new ExamenDB();
        const respuesta = await examen.actualizarProgreso(id_examen, id_usuario, progreso, fecha_actual);
        if (respuesta) {
            res.status(200).json({"message": "Progreso actualizado correctamente", "status": 200});
        }else{
            res.status(400).json({"message": "Error al actualizar el progreso", "status": 400});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({"message": "Error al actualizar el progreso", "status": 500});
    }
});


// obtener el progreso de un usuario en un examen
router.get('/get-progreso/:id_usuario', async (req, res) => {
    try{
        const id_usuario = req.params.id_usuario;
        const examen = new ExamenDB();
        const respuesta = await examen.getProgresosByIdUsuario(id_usuario);
        if (respuesta) {
            res.status(200).json({"message": "Progreso obtenido correctamente", "status": 200, "data": respuesta});
        }else{
            res.status(400).json({"message": "Error al obtener el progreso", "status": 400});
        }
    }catch(error){
        res.status(500).json({"message": "Error al obtener el progreso", "status": 500});
    }
})
router.get('/get-examenes-estado', async (req, res) => {
    try{
        const examen = new ExamenDB();
        const respuesta = await examen.countExamenesActivos();
        if (respuesta) {
            res.status(200).json({"message": "Examenes obtenidos correctamente", "status": 200, "data": respuesta});
        }else{
            res.status(400).json({"message": "Error al obtener los examenes", "status": 400});
        }
    }catch(error){
        res.status(500).json({"message": "Error al obtener los examenes", "status": 500});
    }
})
router.get('/get-examenes-aprobados', async(req, res)=>{
    try{
        const examen = new ExamenDB();
        const respuesta = await examen.countExamenesAprobados();
    
        if (respuesta) {
            res.status(200).json({"message": "Examenes obtenidos correctamente", "status": 200, "data": respuesta});
        }else{
            console.log(respuesta);
            res.status(400).json({"message": "Error al obtener los examenes", "status": 400});
        }
    }catch(error){
        res.status(500).json({"message": "Error al obtener los examenes", "status": 500});
    }
})




module.exports = router;