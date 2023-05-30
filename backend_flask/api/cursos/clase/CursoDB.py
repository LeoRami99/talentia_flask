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
            print(e)
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
    def create_subsection(seccion_id, titulo, orden):
        try:
            with conectionDatabase() as conection:
                cursor = conection.cursor()
                sql="INSERT INTO subsecciones(seccion_id, titulo, orden) VALUES (%s, %s, %s)"
                values=(seccion_id, titulo, orden)
                cursor.execute(sql, values)
                subseccion_id = cursor.lastrowid
                conection.commit()
                return subseccion_id
        except Exception as e:
            print(e)
            return False

    

