from conectionDB import conectionDatabase

class CursoDB:
    def __init__(self, imagen_portada, imagen_card, titulo, descripcion, trailer, precio, id_instructor, estado, dificultad):
        self.imagen_portada = imagen_portada
        self.imagen_card = imagen_card
        self.titulo = titulo
        self.descripcion = descripcion
        self.trailer = trailer
        self.precio = precio
        self.id_instructor = id_instructor
        self.estado = estado
        self.dificultad = dificultad
    """ Función para crear un curso basados en los paramatros que se le pasan a la clase """
    def create_curso(self):
        try:
            with conectionDatabase() as conection:
                cursor = conection.cursor()
                sql="INSERT INTO cursos(imagen_portada, imagen_card, titulo, descripcion, trailer, precio, id_instructor, estado, dificultad) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
                values=(self.imagen_portada, self.imagen_card, self.titulo, self.descripcion, self.trailer, self.precio, self.id_instructor, self.estado, self.dificultad)
                cursor.execute(sql, values)
                curso_id = cursor.lastrowid
                # retornar el id del curso creado
                conection.commit()
                return curso_id
        except Exception as e:
            # print(e)
            return False
    """ Creación de las secciones de cada curso basado en el id del curso arrojado por la función create_curso() """
    @staticmethod
    def create_section(curso_id, titulo, orden):
        try:
            with conectionDatabase() as conection:
                cursor = conection.cursor()
                sql="INSERT INTO secciones(curso_id, titulo, orden) VALUES (%s, %s, %s)"
                values=(curso_id, titulo, orden)
                cursor.execute(sql, values)
                seccion_id = cursor.lastrowid
                conection.commit()
                return seccion_id
        except Exception as e:
            print(e)
            return False
    @staticmethod
    def create_subsection(seccion_id, titulo, contenido):
        try:
            with conectionDatabase() as conection:
                cursor = conection.cursor()
                sql="INSERT INTO subsecciones(id_seccion, titulo, contenido) VALUES (%s, %s, %s)"
                values=(seccion_id, titulo, contenido)
                cursor.execute(sql, values)
                conection.commit()
                return True
        except Exception as e:
            # print(e)
            return False
    # creación de la categoria del curso
    @staticmethod
    def create_categoria(curso_id, categoria_id):
        try:
            with conectionDatabase() as conection:
                cursor = conection.cursor()
                sql="INSERT INTO categorias_curso(id_curso, id_categoria) VALUES (%s, %s)"
                values=(curso_id, categoria_id)
                cursor.execute(sql, values)
                conection.commit()
                return True
        except Exception as e:
            # print(e)
            return False
    @staticmethod
    def get_cursos():
        try:
            with conectionDatabase() as conection:
                cursor = conection.cursor()
                sql="SELECT * FROM cursos"
                cursor.execute(sql)
                cursos = cursor.fetchall()
                cursos_list = []
                for curso in cursos:
                    curso_dict = {
                        "id": curso[0],
                        "imagen_portada": curso[1],
                        "imagen_card": curso[2],
                        "titulo": curso[3],
                        "descripcion": curso[4],
                        "trailer": curso[5],
                        "precio": curso[6],
                        "id_instructor": curso[9],
                        "dificultad": curso[8],
                        "estado": curso[7]
                    }
                    cursos_list.append(curso_dict)
                return cursos_list
        except Exception as e:
            # print(e)
            return False
    @staticmethod
    def get_curso(id_curso):
        try:
            with conectionDatabase() as conection:
                cursor = conection.cursor()
                sql="SELECT * FROM cursos WHERE id=%s"
                values=(id_curso,)
                cursor.execute(sql, values)
                curso = cursor.fetchone()
                curso_dict = {
                    "id": curso[0],
                    "imagen_portada": curso[1],
                    "imagen_card": curso[2],
                    "titulo": curso[3],
                    "descripcion": curso[4],
                    "trailer": curso[5],
                    "precio": curso[6],
                    "id_instructor": curso[9],
                    "dificultad": curso[8],
                    "estado": curso[7]
                }
                # Obtención de secciones por id de curso
                sql="SELECT * FROM secciones WHERE curso_id=%s"
                values=(id_curso,)
                cursor.execute(sql, values)
                secciones = cursor.fetchall()
                secciones_list = []
                for seccion in secciones:
                    seccion_dict = {
                        "id": seccion[0],
                        "curso_id": seccion[1],
                        "titulo": seccion[2],
                        "orden": seccion[3],
                        "subsecciones": []
                    }
                    # Obtención de subsecciones por id de seccion
                    sql="SELECT * FROM subsecciones WHERE id_seccion=%s"
                    values=(seccion[0],)
                    cursor.execute(sql, values)
                    subsecciones = cursor.fetchall()
                    for subseccion in subsecciones:
                        subseccion_dict = {
                            "id_seccion": subseccion[0],
                            "titulo": subseccion[1],
                            "contenido": subseccion[3]
                        }
                        seccion_dict['subsecciones'].append(subseccion_dict)
                    secciones_list.append(seccion_dict)
                curso_dict['secciones'] = secciones_list
                return curso_dict
        except Exception as e:
            print(e)
            return False
    @staticmethod
    def get_categorias():
        try:
            with conectionDatabase() as conection:
                cursor = conection.cursor()
                sql="SELECT * FROM categorias"
                cursor.execute(sql)
                categorias = cursor.fetchall()
                categorias_list = []
                for categoria in categorias:
                    categoria_dict = {
                        "id": categoria[0],
                        "nombre": categoria[1]
                    }
                    categorias_list.append(categoria_dict)
                return categorias_list
        except Exception as e:
            # print(e)
            return False
    

