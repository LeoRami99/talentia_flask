const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');


// Aquí importarías las funciones del controlador para cada ruta
const CursoDB = require('./clase/CursoDB');
const {
	getCurso,
	getCursos,
    // estas funciones se llaman por clases
	// createCurso,
	// updateCurso,
	// deleteCurso,
    createSubsection,
    createModulo,
    createLeccion,
	getCategorias,
    // actualización de curso
	actualizarEstado,
	actualizarCurso,
	actualizarSeccion,
	actualizarSubseccion,
	actualizarCategoria,
    // Eliminación de curso
	eliminarSubsecciones,
	eliminarSecciones,
	eliminarCurso,
	eliminarCategoria,
    eliminarSubseccion,
    // Progreso de curso
    progresoCurso,
    actualizarProgresoCurso,
    getProgresoCurso,
    verificarProgresoCurso,
    modulosCurso,
    leccionesModuloActual,
    getProgresoCursos

} = require("./clase/CursoDB");
// Confiuración de multer para subir archivos y la subida de imagenes

const storage = multer.diskStorage(
    {
    destination: function(req, file, cb) {
        // en local se usa esta ruta
        // cb(null, 'src/images/curso');
        //en producción se usa esta ruta
        cb(null, 'images/curso');
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
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         const dir = '/home/pruebawp/public_html/api.pruebawp.cymetria.com/talentia_flask/backend_express/src/images/curso';
//         fs.access(dir, fs.constants.W_OK, (err) => {
//             console.log(`Checking permissions for directory: ${dir}`);
//             if (err) {
//                 console.error(`Directory ${dir} is not writable:`, err);
//                 cb(err);
//             } else {
//                 cb(null, dir);
//             }
//         });
//     },
//     filename: function(req, file, cb) {
//         let ext = path.extname(file.originalname);
//         let filename;
//         if (file.fieldname === "imagen_portada") {
//             filename = 'portada_' + Date.now() + ext;
//         } else if (file.fieldname === "imagen_card") {
//             filename = 'card_' + Date.now() + ext;
//         } else {
//             filename = file.originalname; // Para otros campos o como opción por defecto
//         }
//         console.log(`Saving file with filename: ${filename}`);
//         cb(null, filename);
//     }
// });


const upload = multer({storage: storage});
router.post('/upload_imagenes_curso', upload.fields([{name: 'imagen_card'}]), (req, res) => {
    try{
        if (req.files.imagen_card) {
            let response_data = {
                "message": "Imagenes subidas correctamente",
                "status": 200,
                "imagen_portada": 'imagen_portada',
                "imagen_card": req.files.imagen_card[0].filename
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
            // console.log(curso_id);

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
router.get('/get-cursos', authenticateToken, async (req, res) => {
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
        // console.log(req.params.id);

        const curso = await getCurso(req.params.id);
        res.json({'status':200, curso});
    }catch(err){
        res.status(500).json({ error: err.toString() });
    }
})
router.put('/estado-curso/', async(req,res)=>{
    try{
        const estado = actualizarEstado(req.body.id,req.body.estado);
        res.json({'status':200, 'message':'Estado actualizado correctamente'});
    }catch(err){
        res.status(500).json({ error: err.toString() });
    }
})
router.put('/update-curso/', async(req,res)=>{
    try{
        let data=req.body;
        let id_curso = data.id,
            imagen_portada = data.imagen_portada,
			imagen_card = data.imagen_card,
			titulo= data.titulo,
			descripcion = data.descripcion,
			trailer = data.trailer,
			precio = data.precio,
			estado = data.estado,
			dificultad = data.dificultad,
			secciones = data.secciones,
			categoria_id = data.categoria_id;
        if (id_curso!='' && titulo!='' && descripcion!='' && trailer!='' && precio!='' && estado!='' && dificultad!='' && categoria_id!='') {
            const update_curso = await actualizarCurso(imagen_portada, imagen_card, id_curso, titulo, descripcion, trailer, precio, estado, dificultad);
            if(update_curso){
                
                if(await actualizarCategoria(id_curso,categoria_id)){
                    secciones.forEach(async secciones => {
                        await actualizarSeccion(secciones.titulo, secciones.descripcion, secciones.id, id_curso);
                        secciones.subsecciones.forEach(async subsecciones => {
                             await actualizarSubseccion(subsecciones.titulo, subsecciones.contenido, subsecciones.descripcion, subsecciones.id_subseccion, secciones.id, id_curso);
                        });
                    });               
                    return res.status(200).json({"message": "Curso actualizado", "status": 200});
                }else{
                    return res.status(400).json({"message": "No hay datos", "status": 400});
                }
            }else{
                return res.status(400).json({"message": "No hay datos", "status": 400});
            }
        }else{
            return res.status(400).json({"message": "No hay datos", "status": 400});

        }

    }catch(err){
        res.status(500).json({ 'error': err.toString() });
    }
})

// router.delete('/delete-curso/', async (req, res) => {
//     try{
//         let data=req.body;
//         if(data.id!=''){
//             let seccion = data.secciones
//             seccion.forEach(async secciones => {
//                 secciones.subsecciones.forEach(async subsecciones => {
//                     await eliminarSubsecciones(subsecciones.id_seccion);
//                 });
//                 await eliminarSecciones(secciones.curso_id, secciones.id);
//             });
//             await eliminarCategoria(data.id);
//             await eliminarCurso(data.id) ? res.status(200).json({"message": "Curso eliminado", "status": 200}) : res.status(400).json({"message": "No hay datos", "status": 400});
//         }else{
//             return res.status(400).json({"message": "No hay datos", "status": 400});
//         }
//     }catch(err){
//         res.status(500).json({ error: err.toString() });
//     }
// });
router.delete('/delete-curso/', async (req, res) => {
    try{
        let data=req.body;
        if(data.id!=''){
            let seccion = data.secciones
            for (const secciones of seccion) {
                for (const subsecciones of secciones.subsecciones) {
                    await eliminarSubsecciones(subsecciones.id_seccion);
                };
                await eliminarSecciones(secciones.curso_id, secciones.id);
            };
            await eliminarCategoria(data.id);
            await eliminarCurso(data.id) ? res.status(200).json({"message": "Curso eliminado", "status": 200}) : res.status(400).json({"message": "No hay datos", "status": 400});
        }else{
            return res.status(400).json({"message": "No hay datos", "status": 400});
        }
    }catch(err){
        res.status(500).json({ error: err.toString() });
    }
});

// esto es cuando se edita el curso
// eliminar seccion
 /* Al eliminar una sección se elimna las subsecciones del mismos */
router.delete('/delete-seccion/', async (req, res) => {
    // console.log(req.body);
    try{
        let data=req.body;
        if(data.id!=''){
            let subsecciones = data.subsecciones;
            for (const subseccion of subsecciones) {
                await eliminarSubseccion(subseccion.id_subseccion,subseccion.id_seccion);
            }
            await eliminarSecciones(data.id_curso, data.id_seccion) ? res.status(200).json({"message": "Sección eliminada", "status": 200}) : res.status(400).json({"message": "No hay datos", "status": 400});
        }else{
            return res.status(400).json({"message": "No hay datos", "status": 400});
        }
    }catch(err){
        res.status(500).json({ error: err.toString() });
    } 
});
router.delete('/delete-subseccion/', async (req, res) => {
    try{
        let data=req.body;
        // console.log(data);
        if(data.id!=''){
            await eliminarSubseccion(data.id_subseccion, data.id_seccion) ? res.status(200).json({"message": "Subsección eliminada", "status": 200}) : res.status(400).json({"message": "No hay datos", "status": 400});
        }else{
            return res.status(400).json({"message": "No hay datos", "status": 400});
        }
    }catch(err){
        res.status(500).json({ error: err.toString() });
    } 
})

// Creación de lecciones

router.post('/create-leccion/', async (req, res) => {
    try{
        let data=req.body;
        if(data.id_seccion!='' && data.titulo_leccion!='' && data.url_contenido!='' && data.descripcion_leccion!=''){
            await createLeccion(data.id_seccion, data.titulo_leccion, data.url_contenido, data.descripcion_leccion) ? res.status(200).json({"message": "Lección creada", "status": 200}) : res.status(400).json({"message": "No hay datos", "status": 400});
        }else{
            return res.status(400).json({"message": "No hay datos", "status": 400});
        }
    }catch(err){
        res.status(500).json({ error: err.toString() });
    }
});

router.post('/create-modulo/', async (req, res) => {
    try{
        let data=req.body;
        if(data.id_curso!='' && data.titulo_modulo!='' && data.descripcion_seccion!=''){
            await createModulo(data.id_curso, data.titulo_modulo, data.descripcion_seccion) ? res.status(200).json({"message": "Módulo creado", "status": 200}) : res.status(400).json({"message": "No hay datos", "status": 400});
        }else{
            return res.status(400).json({"message": "No hay datos", "status": 400});
        }
    }catch(err){
        res.status(500).json({ error: err.toString() });
    }
})

// Rutas para el progreso del curso
router.post('/progreso-curso/', async (req, res) => {
    try{
        let data=req.body;
        // console.log(data);
        if(data.id_curso!='' && data.id_usuario!=''){
            await progresoCurso(data.id_usuario, data.id_curso, data.id_modulo, data.id_leccion) ? res.status(200).json({"message": "Progreso del curso creado", "status": 200}) : res.status(400).json({"message": "No hay datos", "status": 400});
        }else{
            return res.status(400).json({"message": "No hay datos", "status": 400});
        }
    }catch(err){
        res.status(500).json({ error: err.toString() });
    }
});

router.get('/verificar-progreso-curso/:id_curso/:id_usuario', async (req, res) => {
    try{
        let data=req.params;
        if(data.id_curso!==0  && data.id_usuario!==0){
            let progreso = await verificarProgresoCurso(data.id_usuario, data.id_curso);
            if(progreso){
                return res.status(200).json({"message": "Progreso del curso", "status": 200, "data": progreso});
            }else{
                return res.status(400).json({"message": "No hay datos", "status": 400, "data": progreso});
            }
        }else{
            return res.status(400).json({"message": "No hay datos", "status": 400});
        }
    }catch(err){
        res.status(500).json({ error: err.toString() });
    }

});

router.get('/progreso-curso/:id_curso/:id_usuario', async (req, res) => {
    try{
        let data=req.params;
        if(data.id_curso!='' && data.id_usuario!=''){
            let progreso = await getProgresoCurso(data.id_usuario, data.id_curso);
            console.log(progreso);
            if(progreso){
                return res.status(200).json({"message": "Progreso del curso", "status": 200, "data": progreso});
            }else{
                return res.status(400).json({"message": "No hay datos", "status": 400});
            }
        }else{
            return res.status(400).json({"message": "No hay datos", "status": 400});
        }
    }catch(err){
        res.status(500).json({ error: err.toString() });
    }
});

// Estos endpoints serán para  la condición de los cursos para dar siguiente lección
router.get('/condicion-modulo/:id_curso/:id_seccion', async (req, res) => {
    try{
        let data=req.params;
        if(data.id_curso!='' && data.id_seccion!=''){
            let condicion = await modulosCurso(data.id_curso, data.id_seccion);
            if(condicion){
                return res.status(200).json({"message": "Condición del módulo", "status": 200, "data": condicion});
            }else{
                return res.status(200).json({"message": "No hay datos", "status": 200, "data": condicion});
            }
        }
    }catch(err){
        res.status(500).json({ error: err.toString() });
    }
});
router.get('/condicion-leccion/:id_seccion/:id_subseccion', async (req, res) => {
    try{
        let data=req.params;
        if(data.id_seccion!='' && data.id_subseccion!=''){
            let condicion = await leccionesModuloActual(data.id_seccion, data.id_subseccion);
            console.log("Esta esla condición de lección", condicion);
            if(condicion){
                return res.status(200).json({"message": "Condición del módulo", "status": 200, "data": condicion});
            }else{
                return res.status(200).json({"message": "No hay datos", "status": 200, "data": condicion});
            }
        }
    }catch(err){
        res.status(500).json({ error: err.toString() });
    }
});
router.put('/actualizar-progreso-curso/', async (req, res) => {
    try{
        let data=req.body;
        if(data.id_usuario!='' && data.id_curso!='' && data.id_modulo!='' && data.id_leccion!=''){
            let progreso = await actualizarProgresoCurso(data.id_usuario, data.id_curso, data.id_modulo, data.id_leccion);
            
            if (progreso){
                return res.status(200).json({"message": "Progreso del curso actualizado", "status": 200})
            }else{
                return res.status(200).json({"message": "No se actualizo por que no hubo coincidencia de datos", "status": 400});
            }
        }else{
            console.log("No hay datos");
            return res.status(400).json({"message": "No hay datos", "status": 400});
        }
    }catch{
        res.status(500).json({ error: err.toString() });
    }
});

router.get('/usuario-curso/:id_usuario', async (req, res) => {
    try{
        let data=req.params;
        if(data.id_usuario!=''){
            let progreso = await getProgresoCursos(data.id_usuario);
            if(progreso){
                return res.status(200).json({"message": "Progreso del curso", "status": 200, "data": progreso});
            }else{
                return res.status(400).json({"message": "No hay datos", "status": 400});
            }
        }else{
            return res.status(400).json({"message": "No hay datos", "status": 400});
        }
    }catch(error){
        res.status(500).json({ error: error.toString() });
    }
});
router.get('/get-cursos-estado', async (req, res) => {
    try{
        const cursos = new CursoDB();
        const respuesta = await cursos.getCountCursosEstado();
        if (respuesta) {
            res.status(200).json({"message": "Cursos obtenidos correctamente", "status": 200, "data": respuesta});
        }else{
            res.status(400).json({"message": "Error al obtener los cursos", "status": 400});
        }
    }catch(error){
        res.status(500).json({"message": "Error al obtener los cursos", "status": 500});
    }
})
router.get('/get-cursos-tomados', async (req, res)=>{
    try{
        const cursos = new CursoDB();
        const respuesta = await cursos.getCountCursos();
        if (respuesta) {
            res.status(200).json({"message": "Cursos obtenidos correctamente", "status": 200, "data": respuesta});
        }else{
            res.status(400).json({"message": "Error al obtener los cursos", "status": 400});
        }
    }catch(error){
        res.status(500).json({"message": "Error al obtener los cursos", "status": 500});
    }
})

// cursosAleatorios
router.get('/curso-aleatorio', async (req, res) => {
    try {
        const curso = new CursoDB();
        const respuesta = await curso.getCursoAleatorio();
        if (respuesta) {
            res.status(200).json({"message": "Curso obtenido correctamente", "status": 200, "data": respuesta});
        }else{
            res.status(400).json({"message": "Error al obtener el curso", "status": 400});
        }
    } catch (error) {
        res.status(500).json({"message": "Error al obtener el curso", "status": 500});
    }
});








// router.delete('/delete-curso/', async (req, res) => {
//     try{
//         let data=req.body;
//         console.log(req.body);
        
//     }catch(err){
//         res.status(500).json({ error: err.toString() });
//     }
// })

// router.get('/:id', getCursos);
// router.post('/', createCurso);
// router.put('/:id', updateCurso);
// router.delete('/:id', deleteCurso);

module.exports = router;
