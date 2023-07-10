const db = require("../../../config/db");
// jsonify
const {json} = require("express");
class CursoDB {
	constructor(
		imagen_portada,
		imagen_card,
		titulo,
		descripcion,
		trailer,
		precio,
		id_instructor,
		estado,
		dificultad
	) {
		this.imagen_portada = imagen_portada;
		this.imagen_card = imagen_card;
		this.titulo = titulo;
		this.descripcion = descripcion;
		this.trailer = trailer;
		this.precio = precio;
		this.id_instructor = id_instructor;
		this.estado = estado;
		this.dificultad = dificultad;
	}
  // Creación del curso
  async createCurso() {
    try {
        let sql = "INSERT INTO cursos(imagen_portada, imagen_card, titulo, descripcion, trailer, precio, id_instructor, estado, dificultad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let values = [this.imagen_portada, this.imagen_card, this.titulo, this.descripcion, this.trailer, this.precio, this.id_instructor, this.estado, this.dificultad];
        
        let result = await db.query(sql, values);
        
        // El id del curso recién creado estará en result[0].insertId
        let curso_id = result[0].insertId;
        return curso_id;
    } catch (error) {
        console.error(error);
        return false;
    }
  }

	
  // creación de las secciones del curso
  async createSection(curso_id, titulo, descripcion, orden) {
    try {
        let sql = "INSERT INTO secciones(curso_id, titulo, descripcion, orden) VALUES (?, ?, ?, ?)";
        let values = [curso_id, titulo, descripcion, orden];
        let result = await db.query(sql, values);
        // El id de la sección recién creada estará en result[0].insertId
        let seccion_id = result[0].insertId;
        return seccion_id;
    } catch (error) {
        console.error(error);
        return false;
    }
}
// creación de las subsecciones del curso
async createSubsection(seccion_id, titulo, contenido, descripcion) {
    try{
        let sql = "INSERT INTO subsecciones(id_seccion, titulo, contenido, descripcion) VALUES (?, ?, ?, ?)";
        let values = [seccion_id, titulo, contenido, descripcion];
        let result = await db.query(sql, values);
        // El id de la subsección recién creada estará en result[0].insertId
        return true;
    }catch(error){
        console.error(error);
        return false;
    }
}
// creación de las categorías del curso
async createCategoria(curso_id, categoria_id) {
    try{
        let sql = "INSERT INTO categorias_curso(id_curso, id_categoria) VALUES (?, ?)";
        let values = [curso_id, categoria_id];
        let result = await db.query(sql, values);
        // El id de la categoría recién creada estará en result[0].insertId
        return result[0].insertId;
    }catch(error){
        console.error(error);
        return false;
    }
}

	// Función para obtener la información de todos los cursos con su respectiva categoría
	static async getCursos() {
		try {
			let [cursos] = await db.execute("SELECT * FROM cursos");
			let cursos_list = {
				cursos: [],
			};

			for (let curso of cursos) {
				let [categorias_curso] = await db.execute(
					"SELECT * FROM categorias_curso WHERE id_curso=?",
					[curso.id]
				);
				let [categoria] = await db.execute(
					"SELECT nombre FROM categorias WHERE id=?",
					[categorias_curso[0].id_categoria]
				);
				let curso_dict = {
					id: curso.id,
					imagen_portada: curso.imagen_portada,
					imagen_card: curso.imagen_card,
					titulo: curso.titulo,
					descripcion: curso.descripcion,
					trailer: curso.trailer,
					precio: curso.precio,
					id_instructor: curso.id_instructor,
					estado: curso.estado,
					dificultad: curso.dificultad,
					categoria: categoria[0].nombre,
				};
				cursos_list.cursos.push(curso_dict);
			}
			return cursos_list;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
	static async getCurso(id_curso){
		try{
			let sql = "SELECT cursos.*, categorias_curso.id_categoria FROM cursos JOIN categorias_curso ON cursos.id = categorias_curso.id_curso WHERE cursos.id = ?";
			let values = [id_curso];
			let [result] = await db.query(sql, values);
			let curso = {
				id: result[0].id,
				imagen_portada: result[0].imagen_portada,
				imagen_card: result[0].imagen_card,
				titulo: result[0].titulo,
				descripcion: result[0].descripcion,
				trailer: result[0].trailer,
				precio: result[0].precio,
				id_instructor: result[0].id_instructor,
				estado: result[0].estado,
				dificultad: result[0].dificultad,
				categoria_id: result[0].id_categoria,
				secciones: [],
			}
			sql = "SELECT * FROM secciones WHERE curso_id = ?";
			values = [id_curso];
			[result] = await db.query(sql, values);
			for(let seccion of result){
				let seccion_dict = {
					id: seccion.id,
					curso_id: seccion.curso_id,
					titulo: seccion.titulo,
					descripcion: seccion.descripcion,
					orden: seccion.orden,
					subsecciones: [],
				}
				sql = "SELECT * FROM subsecciones WHERE id_seccion = ?";
				values = [seccion.id];
				let [result2] = await db.query(sql, values);
				for(let subseccion of result2){
					let subseccion_dict = {
						id_subseccion: subseccion.id,
						id_seccion: subseccion.id_seccion,
						titulo: subseccion.titulo,
						contenido: subseccion.contenido,
						descripcion: subseccion.descripcion,
					}
					seccion_dict.subsecciones.push(subseccion_dict);
				}
				curso.secciones.push(seccion_dict);
			}
			return curso;
		}catch(error){
			console.error(error);
			return false;
	  }}
	// Función para obtener la información de todos los cursos con su respectiva categoría
	static async getCategorias() {
		try {
			let [categorias] = await db.execute("SELECT * FROM categorias");
			// lista de categorias en formato JSON
			let categorias_list = {
				categorias: [],
			};
			for (let categoria of categorias) {
				let categoria_dict = {
					id: categoria.id,
					nombre: categoria.nombre,
				};
				categorias_list.categorias.push(categoria_dict);
			}
			return categorias_list;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
	// Actualización del estado del curso
	static async actualizarEstado(id_curso, estado) {
		try {
			let sql = "UPDATE cursos SET estado=? WHERE id=?";
			let values = [estado, id_curso];
			let result = await db.query(sql, values);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
	// Actualización de curso
	static async actualizarCurso(imagen_portada, imagen_card, id_curso, titulo, descripcion, trailer, precio, estado, dificultad) {
		try{
			let sql= "UPDATE cursos SET imagen_portada=?, imagen_card=?, titulo=?, descripcion=?, trailer=?, precio=?, estado=?, dificultad=? WHERE id=?"
			let values = [imagen_portada, imagen_card, titulo, descripcion, trailer, precio, estado, dificultad, id_curso];
			await db.query(sql, values);
			return true;
		}catch(error){
			console.error(error);
			return false;
		}
	}
	// Actualización de sección
	static async actualizarSeccion(titulo, descripcion, id_seccion, id_curso){
		try{
			let sql= "UPDATE secciones SET titulo=?, descripcion=? WHERE id=? AND curso_id=?"
			let values= [titulo, descripcion, id_seccion, id_curso];
			await db.query(sql, values);
			return true;
		}catch(error){
			console.error(error);
			return false;
		}
	}
	// Actualización de subsección
	static async actualizarSubseccion(titulo, contenido, descripcion, id_subseccion, id_seccion, id_curso){
		try{
			console.log(titulo, contenido, descripcion, id_subseccion, id_seccion, id_curso);
			let sql= "UPDATE subsecciones SET titulo=?, contenido=?, descripcion=? WHERE id_seccion=? AND id=?"
			let values = [titulo, contenido, descripcion, id_seccion, id_subseccion];
			await db.query(sql, values);
			return true;
		}catch(error){
			console.error(error);
			return false;
		}
	}
	// Actualización de categoría
	static async actualizarCategoria(id_curso, id_categoria){
		try{
			let sql= "UPDATE categorias_curso SET id_categoria=? WHERE id_curso=?"
			let values = [id_categoria, id_curso];
			await db.query(sql, values);
			return true;
		}catch(error){
			console.error(error);
			return false;
		}
	}
	// Eliminación de las subsecciones basada en el id de la sección
	//Indica que se elimina todas las subsecciones
	static async eliminarSubsecciones(id_seccion){
		try{
			let sql= "DELETE FROM subsecciones WHERE id_seccion=?";
			let values = [id_seccion];
			await db.query(sql, values);
			return true;
		}catch(error){
			console.error(error);
			return false;
		}
	}
	static async eliminarSecciones(id_curso, id_secciones){
		try{
			let sql= "DELETE FROM secciones WHERE id=? AND curso_id=?";
			let values = [id_secciones, id_curso];
			await db.query(sql, values);
			return true;
		}catch(error){
			console.error(error);
			return false;
		}
	}
	static async eliminarSubseccion(id_subseccion, id_seccion){
		try{
			let sql= "DELETE FROM subsecciones WHERE id=? AND id_seccion=?";
			let values = [id_subseccion, id_seccion];
			await db.query(sql, values);
			return true;
		}catch(error){
			console.error(error);
			return false;
		}
	}
	static async eliminarCurso(id_curso){
		try{
			let sql= "DELETE FROM cursos WHERE id=?";
			let values = [id_curso];
			await db.query(sql, values);
			return true;
		}catch(error){
			console.error(error);
			return false;
		}
	}
	static async eliminarCategoria(id_curso){
		try{
			let sql= "DELETE FROM categorias_curso WHERE id_curso=?";
			let values = [id_curso];
			await db.query(sql, values);
			return true;
		}catch(error){
			console.error(error);
			return false;
		}
	}
	// Para estas dos secciones se cren las funciones estaticas debido a que las principales son llamadas por el controlador
	static async createLeccion(seccion_id, titulo, contenido, descripcion) {
		try{
			let sql = "INSERT INTO subsecciones(id_seccion, titulo, contenido, descripcion) VALUES (?, ?, ?, ?)";
			let values = [seccion_id, titulo, contenido, descripcion];
			let result = await db.query(sql, values);
			// El id de la subsección recién creada estará en result[0].insertId
			return true;
		}catch(error){
			console.error(error);
			return false;
		}
	}
	static async createModulo(curso_id, titulo, descripcion, orden) {
		try {
			let sql = "INSERT INTO secciones(curso_id, titulo, descripcion, orden) VALUES (?, ?, ?, ?)";
			let values = [curso_id, titulo, descripcion, orden];
			let result = await db.query(sql, values);
			// El id de la sección recién creada estará en result[0].insertId
			let seccion_id = result[0].insertId;
			return seccion_id;
		} catch (error) {
			console.error(error);
			return false;
		}
	}





}

module.exports = CursoDB;
