const db = require('../../../config/db');

class usuarioDB {
  constructor(nombre, apellidos, correo){
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.correo = correo;
  }
  async registerUser(password){
    try{
      const [result] = await db.execute('INSERT INTO usuario (nombre, apellidos, correo, password) VALUES (?, ?, ?, ?)', [this.nombre, this.apellidos, this.correo, password]);
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
      const [rows] = await db.execute('SELECT id, nombre, apellidos, correo, password FROM usuario WHERE correo = ?', [this.correo]);
      if(rows.length > 0){
        const user = rows[0];
        return {
          id: user.id,
          nombre: user.nombre,
          apellidos: user.apellidos,
          correo: user.correo,
          password: user.password
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
}

module.exports = usuarioDB;
