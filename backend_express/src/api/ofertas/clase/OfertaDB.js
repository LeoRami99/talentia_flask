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
    async updateOferta(id_oferta, titulo, descripcion, fecha_publicacion, fecha_cierre, salario, tipo_contrato, modalida, url_referencia, ciudad, pais, requisitos, estado){
        try {
            let query = "UPDATE oferta_laboral SET titulo = ?, descripcion = ?, fecha_publicacion = ?, fecha_cierre = ?, salario = ?, tipo_contrato = ?, modalidad = ?, url_referencia = ?, ciudad = ?, pais = ?, requisitos = ?, estado = ? WHERE id = ?";
            let rows = await db.query(query, [titulo, descripcion, fecha_publicacion, fecha_cierre, salario, tipo_contrato, modalida, url_referencia, ciudad, pais, requisitos, estado, id_oferta]);
            if (rows[0].affectedRows > 0) {
                return true;
            }else{
                return false;
            }
        } catch (error) {
            throw error;
        }
    }
    //ActualizarEstado
    async updateEstadoOferta(id_oferta, estado){
        try {
            let query = "UPDATE oferta_laboral SET estado = ? WHERE id = ?";
            let rows = await db.query(query, [estado, id_oferta]);
            if (rows[0].affectedRows > 0) {
                return true;
            }else{
                return false;
            }
        } catch (error) {
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
    async ofertaUsuario(id_usuario, id_oferta){
        try{
            let query = "INSERT INTO oferta_usuario (id_usuario, id_oferta) VALUES (?,?)";
            let rows = await db.query(query, [id_usuario, id_oferta]);
            if (rows[0].affectedRows > 0) {
                return true;
            }else{
                return false;
            }
        }catch(error){
            throw error;
        }
    }
    async existOfertaUsuario(id_usuario, id_oferta){
        try{
            let query = "SELECT * FROM oferta_usuario WHERE id_usuario = ? AND id_oferta = ?";
            let rows = await db.query(query, [id_usuario, id_oferta]);
            if (rows[0].length > 0) {
                return true;
            }else{
                return false;
            }
        }catch(error){
            throw error;
        }
    }
    // las conexiones son ofertas laborales a las que aplica un usuario
    async countConexiones(id_usuario){
        try {
            let query = "SELECT COUNT(*) AS conexiones FROM oferta_usuario WHERE id_usuario = ?";
            let rows = await db.query(query, [id_usuario]);
            console.log(rows);
            return rows[0][0].conexiones;
        } catch (error) {
            throw error;
        }
    }
    // para esta función se va crear
    async allOfertasUsuario(){
        try{
            let query = "SELECT * FROM oferta_usuario";
            let rows = await db.query(query);
            return rows[0];
        }catch(error){
            throw error;
        }
    }


    async getAplicantsOferta(id_oferta){
        try {
            let query = "SELECT usuario.id, usuario.nombre, usuario.apellidos, usuario.correo FROM oferta_usuario INNER JOIN usuario ON oferta_usuario.id_usuario = usuario.id WHERE oferta_usuario.id_oferta = ?;";
            let rows = await db.query(query, [id_oferta]);
            if (rows[0].length > 0) {
                return rows[0];
            }else{
                return false;
            }
        } catch (error) {
            
        }
    }

}
module.exports = OfertaDB;