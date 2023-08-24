const db = require("../../../config/db");
// jsonify
const {json} = require("express");

class OfertaDB{
    // el constructor se va encargar de registrar los datos de la empresa 
    constructor(nombre, direccion, telefono, website, id_usuario){
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.website = website;
        this.id_usuario = id_usuario;
    }
    async createEmpresa(){
        try{
            let query = "INSERT INTO empresa (nombre, direccion, telefono, website, id_usuario) VALUES (?,?,?,?,?)";
            let rows = await db.query(query, [this.nombre, this.direccion, this.telefono, this.website, this.id_usuario]);
            const empresa_id = rows[0].insertId;
            return empresa_id;
        }catch(error){
            throw error;
        }
    }
    async createOferta(id_empresa, titulo, descripcion, fecha_publicacion, fecha_cierre, salario, tipo_contrato, modalida, url_referencia, ciudad, pais, requisitos, estado){
        try{
            let query = "INSERT INTO oferta_laboral (id_empresa, titulo, descripcion, fecha_publicacion, fecha_cierre, salario, tipo_contrato, modalidad, url_referencia, ciudad, pais, requisitos, estado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
            let rows = await db.query(query, [id_empresa, titulo, descripcion, fecha_publicacion, fecha_cierre, salario, tipo_contrato, modalida, url_referencia, ciudad, pais, requisitos, estado]);
            const oferta_id = rows[0].insertId;
            return oferta_id;
        }catch(error){
            throw error;
        }
    }
    async crearHabilidadOferta(id_oferta, id_habilidad){
        try{
            let query = "INSERT INTO habilidades_oferta (id_oferta, id_habilidad) VALUES (?,?)";
            let rows = await db.query(query, [id_oferta, id_habilidad]);
            return true;
        }catch(error){
            throw error;
        }
    }
    async getHabilidades(){
        try{
            let query = "SELECT * FROM habilidades";
            let rows = await db.query(query);
            return [rows[0]];
        }catch(error){
            throw error;
        }
    }
    // obtener las empresas por id de usuario
    async getEmpresaByIdUsuario(id_usuario){
        try {
            let query = "SELECT * FROM empresa WHERE id_usuario = ?";
            let [rows] = await db.query(query, [id_usuario]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    async getOfertas(){
        // obtiene las ofertas con sus respectivas habilidades
        let ofertas = []
        try{
            let query = "SELECT * FROM oferta_laboral";
            let rows = await db.query(query);
            for(let i = 0; i < rows[0].length; i++){
                let query = "SELECT * FROM habilidades_oferta WHERE id_oferta = ?";
                let rows2 = await db.query(query, [rows[0][i].id]);
                let query2 = "SELECT * FROM habilidades WHERE id = ?";
                let habilidades = [];
                for(let j = 0; j < rows2[0].length; j++){
                    let rows3 = await db.query(query2, [rows2[0][j].id_habilidad]);
                    habilidades.push(rows3[0][0]);
                }
                console.log(habilidades);
                rows[0][i].habilidades = habilidades;
                ofertas.push(rows[0][i]);
            }
            return ofertas;
        }catch(error){
            throw error;
        }
    }

}
module.exports = OfertaDB;