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
}

module.exports = CursoDB;
