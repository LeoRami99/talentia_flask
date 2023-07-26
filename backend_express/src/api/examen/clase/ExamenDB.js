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

}

module.exports = ExamenDB;