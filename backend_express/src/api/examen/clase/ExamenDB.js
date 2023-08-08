const db = require("../../../config/db");
// jsonify
const {json} = require("express");
class ExamenDB{
    constructor(nombre, descripcion, imagen, tiempo){
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.tiempo = tiempo;
    }
    // CRUD
    // Create
    async create(){
        try{
            let query = "INSERT INTO examen (nombre, descripcion, imagen, tiempo) VALUES (?,?,?,?)";
            let rows = await db.query(query, [this.nombre, this.descripcion, this.imagen, this.tiempo]);
            // obtener el id del examen creado
            const examen_id = rows[0].insertId;
            return examen_id;
        }catch(error){
            throw error;
        }
    }
    async createPregunta(id_examen, pregunta){
        try{
            let query = "INSERT INTO pregunta (id_examen, pregunta) VALUES (?,?)";
            let rows = await db.query(query, [id_examen, pregunta]);
            const pregunta_id = rows[0].insertId;
            return pregunta_id;
        }catch(error){
            throw error;
        }
    }
    async createOpciones(id_pregunta, opcion, opcion_correcta){
        try{
            let query = "INSERT INTO opciones (id_pregunta, opcion, opcion_correcta) VALUES (?,?,?)";
            let rows = await db.query(query, [id_pregunta, opcion, opcion_correcta]);
            // const respuesta_id = rows[0].insertId;
            return true;
        }catch(error){
            throw error;
        }
    };
    static async getExamenes(){
        try{
            let query = "SELECT * FROM examen";
            let rows = await db.query(query);
            return rows[0];
        }catch(error){
            return false;
            throw error;
        }
    }
    static async getExamen(id_examen){
        try{
            let query = "SELECT * FROM examen WHERE id = ?";
            let [res_examen] = await db.query(query, [id_examen]);
            let query_preguntas = "SELECT * FROM pregunta WHERE id_examen = ?";
            let examen = res_examen[0];
            let [res_preguntas] = await db.query(query_preguntas, examen.id);
            let preguntas = [];
            for (let pregunta of res_preguntas){
                let query_opciones = "SELECT * FROM opciones WHERE id_pregunta = ?";
                let [res_opciones] = await db.query(query_opciones, pregunta.id);
                let opciones = [];
                for (let opcion of res_opciones){
                    opciones.push({
                        "id": opcion.id,
                        "opcion": opcion.opcion,
                        "opcion_correcta": opcion.opcion_correcta
                    });
                }
                preguntas.push({
                    "id": pregunta.id,
                    "pregunta": pregunta.pregunta,
                    "opciones": opciones
                });
            }
            examen.preguntas = preguntas;
            return examen;
        }catch(error){
            // return ;
            throw error;
        }
    }
    static async updateEstado(id_examen, estado){
        try{
            let query = "UPDATE examen SET estado = ? WHERE id = ?";
            let rows = await db.query(query, [estado, id_examen]);
            if (rows[0].affectedRows > 0){
                return true;
            }else{
                return false;
            }
        }catch(error){
            // return;
            throw error;
        }
    }

    // funciones para crear opciones seperadas de la clase
    static async createOpciones(id_pregunta, opcion, opcion_correcta){
        try{
            let query = "INSERT INTO opciones (id_pregunta, opcion, opcion_correcta) VALUES (?,?,?)";
            let rows = await db.query(query, [id_pregunta, opcion, opcion_correcta]);
            if (rows[0].affectedRows > 0){
                return true;
            }else{
                return false;
            }
        }catch(error){
            throw error;
        }
    }
    async deleteOpciones(id_opcion){
        try{
            let query = "DELETE FROM opciones WHERE id = ?";
            let rows = await db.query(query, [id_opcion]);
            if (rows[0].affectedRows > 0){
                return true;
            }else{
                return false;
            }
        }catch(error){
            throw error;
        }
    }
    // Funciones para actualizar un examen con sun correspondientes preguntas y opciones
    async updateExamen(id_examen, nombre, descripcion){
        try{
            let query = "UPDATE examen SET nombre = ?, descripcion = ? WHERE id = ?";
            let rows = await db.query(query, [nombre, descripcion, id_examen]);
            if (rows[0].affectedRows > 0){
                return true;
            }else{
                return false;
            }
        }catch(error){
            throw error;
        }
    }
    async updatePregunta(id_pregunta, pregunta){
        try{
            let query = "UPDATE pregunta SET pregunta = ? WHERE id = ?";
            let rows = await db.query(query, [pregunta, id_pregunta]);
            if (rows[0].affectedRows > 0){
                return true;
            }else{
                return false;
            }
        }catch(error){
            throw error;
        }
    }
    async updateOpciones(id_opcion, opcion, opcion_correcta){
        try{
            let query = "UPDATE opciones SET opcion = ?, opcion_correcta = ? WHERE id = ?";
            let rows = await db.query(query, [opcion, opcion_correcta, id_opcion]);
            if (rows[0].affectedRows > 0){
                return true;
            }else{
                return false;
            }
        }catch(error){
            throw error;
        }
    }
    // eliminar preguntas y opciones
    async deletePregunta(id_pregunta){
        try{
            let query = "DELETE FROM pregunta WHERE id = ?";
            let rows = await db.query(query, [id_pregunta]);
            if (rows[0].affectedRows > 0){
                return true;
            }else{
                return false;
            }
        }catch(error){
            throw error;
        }
    }
    async deleteOpcionesByPregunta(id_pregunta){
        try{
            let query = "DELETE FROM opciones WHERE id_pregunta = ?";
            let rows = await db.query(query, [id_pregunta]);
            if (rows[0].affectedRows > 0){
                return true;
            }else{
                return false;
            }
        }catch(error){
            throw error;
        }
    }
    // creación del progreso del examen
    async createProgreso(id_examen, id_usuario){
        try{
            let query = "INSERT INTO intentos_examen (id_examen, id_usuario) VALUES (?,?)";
            let rows = await db.query(query, [id_examen, id_usuario]);
            if (rows[0].affectedRows > 0){
                return true;
            }else{
                return false;
            }

        }catch(error){
            throw error;
        }
    }
    async getProgreso(id_examen, id_usuario){
        try{
            let query = "SELECT * FROM intentos_examen WHERE id_examen = ? AND id_usuario = ?";
            let [res] = await db.query(query, [id_examen, id_usuario]);
            if (res.length > 0){
                return res[0];
            }else{
                return false;
            }
        }catch(error){
            throw error;
        }
    }
    async actualizarProgreso(id_examen, id_usuario, aprobado, fecha_fin){
        try{    
            let query = "UPDATE intentos_examen SET aprobado = ?, fecha_fin = ? WHERE id_examen = ? AND id_usuario = ?";
            let rows = await db.query(query, [aprobado, fecha_fin, id_examen, id_usuario]);
            if (rows[0].affectedRows > 0){
                return true;
            }else{
                return false;
            }
        }catch(error){
            throw error;
        }
    }
    // obtener los progresos de los examenes por id del usuario
    async getProgresosByIdUsuario(id_usuario){
        try{
            let query = "SELECT * FROM intentos_examen WHERE id_usuario = ?";
            let [res] = await db.query(query, [id_usuario]);
            if (res.length > 0){
                return res;
            }else{
                return false;
            }
        }catch(error){
            throw error;
        }
    }

    // count de los examenes activos
    async countExamenesActivos(){
        try{
            let query = "SELECT COUNT(*) AS count FROM examen WHERE estado = 1";
            let query2 = "SELECT COUNT(*) AS count FROM examen WHERE estado = 0";
            let [res] = await db.query(query);
            let [res2] =  await db.query(query2);
            if(res && res2){
                return {activos: res[0].count, inactivos: res2[0].count};
            }else{
                false
            }
        }catch(error){
            throw error;
        }
    }
    async countExamenesAprobados(){
        try{
            let query = "SELECT COUNT(*) AS count FROM intentos_examen WHERE aprobado = 'aprobado'";
            let [res] = await db.query(query);
            if(res.length > 0){
                return {aprobados: res[0].count};
            }else{
                return false;
            }
        }catch(error){
            throw error;
        }
    }
}

module.exports = ExamenDB;