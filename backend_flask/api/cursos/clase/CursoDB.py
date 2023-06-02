from conectionDB import conectionDatabase

class CursoDB:
    def __init__(self, imagen_portada, imagen_card, titulo, descripcion, trailer, precio, id_instructor):
        self.imagen_portada = imagen_portada
        self.imagen_card = imagen_card
        self.titulo = titulo
        self.descripcion = descripcion
        self.trailer = trailer
        self.precio = precio
        self.id_instructor = id_instructor
    def create_curso(self):
        try:
            with conectionDatabase() as conection:
                cursor = conection.cursor()
                sql="INSERT INTO cursos(imagen_portada, imagen_card, titulo, descripcion, trailer, precio, id_instructor) VALUES (%s, %s, %s, %s, %s, %s, %s)"
                values=(self.imagen_portada, self.imagen_card, self.titulo, self.descripcion, self.trailer, self.precio, self.id_instructor)
                cursor.execute(sql, values)
                curso_id = cursor.lastrowid
                # retornar el id del curso creado
                conection.commit()
                return curso_id
        except Exception as e:
            # print(e)
            return False
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
    """Este metodo es para la obtención de curso con sus respectivas secciones y subsecciones"""
    # @staticmethod
    # def get_all_cursos():
    # #traer todos los cursos y adempas con su respectivas secciones y subsecciones
    #     try:
    #         with conectionDatabase() as conection:
    #             cursor = conection.cursor()
    #             sql="SELECT * FROM cursos"
    #             cursor.execute(sql)
    #             cursos = cursor.fetchall()
    #             cursos_list = []
    #             for curso in cursos:
    #                 curso_dict = {
    #                     "id": curso[0],
    #                     "imagen_portada": curso[1],
    #                     "imagen_card": curso[2],
    #                     "titulo": curso[3],
    #                     "descripcion": curso[4],
    #                     "trailer": curso[5],
    #                     "precio": curso[6],
    #                     "id_instructor": curso[7],
    #                     "secciones": []
    #                 }
    #                 sql="SELECT * FROM secciones WHERE curso_id=%s"
    #                 values=(curso[0],)
    #                 cursor.execute(sql, values)
    #                 secciones = cursor.fetchall()
    #                 for seccion in secciones:
    #                     seccion_dict = {
    #                         "id": seccion[0],
    #                         "curso_id": seccion[1],
    #                         "titulo": seccion[2],
    #                         "orden": seccion[3],
    #                         "subsecciones": []
    #                     }
    #                     sql="SELECT * FROM subsecciones WHERE id_seccion=%s"
    #                     values=(seccion[0],)
    #                     cursor.execute(sql, values)
    #                     subsecciones = cursor.fetchall()
    #                     for subseccion in subsecciones:
    #                         subseccion_dict = {
    #                             "id": subseccion[0],
    #                             "id_seccion": subseccion[1],
    #                             "titulo": subseccion[2],
    #                             "contenido": subseccion[3]
    #                         }
    #                         seccion_dict['subsecciones'].append(subseccion_dict)
    #                     curso_dict['secciones'].append(seccion_dict)
    #                 cursos_list.append(curso_dict)
    #             return cursos_list
    #     except Exception as e:
    #         print(e)
    #         return False

    # se obtiene todos los cursos pero sin la definicion de instructor 
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
                        "id_instructor": curso[7]
                    }
                    cursos_list.append(curso_dict)
                return cursos_list
        except Exception as e:
            # print(e)
            return False
            
    

