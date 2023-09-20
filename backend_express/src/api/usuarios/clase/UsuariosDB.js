const e = require('express');
const db = require('../../../config/db');

class usuarioDB {
  constructor(nombre, apellidos, correo, rol){
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.correo = correo;
    this.rol = rol
  }
  async registerUser(password){
    try{
      const [result] = await db.execute('INSERT INTO usuario (nombre, apellidos, correo, password, rol) VALUES (?, ?, ?, ?, ?)', [this.nombre, this.apellidos, this.correo, password, this.rol]);
      return result.affectedRows > 0;
    }catch(error){
      console.log(error);
      return false;
    }
  }
  async verifyUser(){
    try {
      const [rows] = await db.execute('SELECT * FROM usuario WHERE correo = ?', [this.correo]);
      return rows.length > 0;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getUser(){
    try {
      const [rows] = await db.execute('SELECT id, nombre, apellidos, correo, password, rol FROM usuario WHERE correo = ?', [this.correo]);
      if(rows.length > 0){
        const user = rows[0];
        return {
          id: user.id,
          nombre: user.nombre,
          apellidos: user.apellidos,
          correo: user.correo,
          password: user.password,
          rol : user.rol
        }
      }else{
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  static async dataUser(id){
    try{
      const sql = 'SELECT id, nombre, apellidos, correo FROM usuario WHERE id = ?';
      const [result] = await db.execute(sql, [id]);
      return result[0];
    }catch(error){
      console.log(error);
      return false;
    }
  }

  // conteo de usuarios con el rol USER
  static async countUsers(){
    try{
      const sql = 'SELECT COUNT(*) as total FROM usuario WHERE rol = "USER"';
      const [result] = await db.execute(sql);
      return result[0].total;
    }catch(error){
      console.log(error);
      return false;
    }
  }

  // estas funciones son para actualizar

  async createProfile(id_usuario, nombre_usuario, sobre_mi, url_cv, num_telefono){ 
      try {
          let query = "INSERT INTO perfil (id_usuario, nombre_usuario, sobre_mi, url_cv, num_telefono) VALUES (?,?,?,?,?)";
          let rows = await db.query(query, [id_usuario, nombre_usuario, sobre_mi, url_cv, num_telefono]);
          if(rows[0].affectedRows > 0){
              return true;
          }else{
              return false;
          } 
      } catch (error) {
        console.log(error);
          throw error;
      }
  }
  async getProfileByIdUsuario(id_usuario){
      try {
          let query = "SELECT * FROM perfil WHERE id_usuario = ?";
          let [rows] = await db.query(query, [id_usuario]);
          return rows;
      } catch (error) {
          throw error;
      }
  }
  async updateProfile(id_usuario, nombre_usuario, sobre_mi, url_cv, num_telefono){
      try {
          let query = "UPDATE perfil SET nombre_usuario = ?, sobre_mi = ?, url_cv = ?, num_telefono = ? WHERE id_usuario = ?";
          let rows = await db.query(query, [nombre_usuario, sobre_mi, url_cv, num_telefono, id_usuario]);
          return true;
      } catch (error) {
          throw error;
      }
  }
  async ProfileExist(id_usuario){
      try {
          let query = "SELECT * FROM perfil WHERE id_usuario = ?";
          let [rows] = await db.query(query, [id_usuario]);
          if(rows.length > 0){
              return true;
          }else{
              return false;
          }
      } catch (error) {
          throw error;
      }
  }
  async getProfileById(id_usuario){
      try {
          let query = "SELECT usuario.id, usuario.nombre, usuario.apellidos, usuario.correo, perfil.id as id_perfil, perfil.nombre_usuario, perfil.sobre_mi, perfil.sobre_mi, perfil.url_cv, perfil.num_telefono FROM usuario INNER JOIN perfil ON usuario.id = perfil.id_usuario WHERE usuario.id  = ?";
          let [rows] = await db.query(query, [id_usuario]);
          return rows;
      } catch (error) {
          throw error;
      }
  }
  async updatePerfilAll(...args){
      try {
          let [id, nombre_usuario, sobre_mi, url_cv, num_telefono, nombre, apellidos, correo] = args;
          let query = "UPDATE perfil SET nombre_usuario = ?, sobre_mi = ?, url_cv = ?, num_telefono = ? WHERE id_usuario = ?";
          let rows = await db.query(query, [nombre_usuario, sobre_mi, url_cv, num_telefono, id]);
          let query_usuario = "UPDATE usuario SET nombre = ?, apellidos = ?, correo = ? WHERE id = ?";
          let rows_usuario= await db.query(query_usuario, [nombre, apellidos, correo, id]);
          if(rows[0].affectedRows > 0 && rows_usuario[0].affectedRows > 0){
              return true;
          }else{
              return false;
          }
      } catch (error) {
        console.log(error);
          throw error;
      }
  }

  // funcionaes para resetear la contraseña
  async getUserByemail(correo){
      try {
          let query = "SELECT * FROM usuario WHERE correo = ?";
          let [rows] = await db.query(query, [correo]);
          return rows;
      } catch (error) {
          throw error;
      }
  }
  async insertDataCodePass(id_usuario, codigo, expireAt, validacion){
      try {
          let query = "SELECT * FROM reset_pass_code WHERE id_usuario = ?";
          let [rows] = await db.query(query, [id_usuario]);
          if(rows.length > 0){
              let query = "UPDATE reset_pass_code SET codigo = ?, expireAt = ?, validacion = ? WHERE id_usuario = ?";
              let rows = await db.query(query, [codigo, expireAt, validacion, id_usuario]);
              if(rows[0].affectedRows > 0){
                  return true;
              }else{
                  return false;
              }
          }else{
              let query = "INSERT INTO reset_pass_code (id_usuario, codigo, expireAt, validacion) VALUES (?,?,?,?)";
              let rows = await db.query(query, [id_usuario, codigo, expireAt, validacion]);
              if(rows[0].affectedRows > 0){
                  return true;
              }else{
                  return false;
              }
          }
      } catch (error) {
          throw error;
      }
  }
  async verifyCodePass(id_usuario, codigo){
      try {
          let query = "SELECT * FROM reset_pass_code WHERE id_usuario = ? AND codigo = ?";
          let [rows] = await db.query(query, [id_usuario, codigo]);
          if(rows.length > 0){
              return true;
          }else{
              return false;
          }
      } catch (error) {
          throw error;
      }
  }
  async updatePassword(id_usuario, password, estado){
      try {
          let query = "UPDATE usuario SET password = ? WHERE id = ?";
          let rows = await db.query(query, [password, id_usuario]);
          let query_code = "UPDATE reset_pass_code SET validacion = ?, codigo=? WHERE id_usuario = ?";
          let rows_code = await db.query(query_code, [estado, "", id_usuario]);
          if(rows[0].affectedRows > 0, rows_code[0].affectedRows > 0){
              return true;
          }else{
              return false;
          }
      } catch (error) {
          throw error;
      }
  }


}

module.exports = usuarioDB;
