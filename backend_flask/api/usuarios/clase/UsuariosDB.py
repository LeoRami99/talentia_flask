from conectionDB import conectionDatabase
class Usuarios:
    """ Clase para el registro de usarios en el sistema nombre, apellido, correo """
    def __init__(self, nombre, apellidos, correo):
        self.nombre = nombre
        self.apellidos = apellidos
        self.correo = correo
    """ Metodo para registrar usuarios en la base de datos """
    def register_user(self, password):
        try:
            with conectionDatabase() as conection:
                cursor = conection.cursor()
                sql = "INSERT INTO usuarios(nombre, apellido, correo, password) VALUES (%s, %s, %s, %s)"
                values=(self.nombre, self.apellidos, self.correo, password)
                cursor.execute(sql, values)
                conection.commit()
            return True
        except Exception as e:
            print(e)
            return False
    """ Metodo para verficiar que el usuario no este registrado en la base de datos """
    def verify_user(self):
        try:
            with conectionDatabase() as conection:
                cursor = conection.cursor()
                sql = "SELECT * FROM usuarios WHERE correo = %s"
                values=(self.correo,)
                cursor.execute(sql, values)
                result = cursor.fetchone()
                if result:
                    return True
                else:
                    return False
        except Exception as e:
            print(e)
            return False
    
    """Metodo para obtener la información del usuario"""
    def get_user(self):
        try:
            with conectionDatabase() as conection:
                cursor = conection.cursor()
                sql = "SELECT id, nombre, apellido, correo, password FROM usuarios WHERE correo = %s"
                values=(self.correo,)
                cursor.execute(sql, values)
                result = cursor.fetchone()
                if result:
                    resultado={
                        'id': result[0],
                        'nombre': result[1],
                        'apellido': result[2],
                        'correo': result[3],
                        'password': result[4]
                    }
                    return resultado
                else:
                    return False
        except Exception as e:
            print(e)
            return False
    """Metodo para obtener la información del usuario basado en el correo y contraseña"""
    # def get_user_by_email_password(self, password):
    #     try:
    #         conection = conectionDatabase()
    #         cursor = conection.cursor()
    #         sql = "SELECT * FROM usuarios WHERE correo = '{0}' AND password = '{1}'".format(self.correo, password)
    #         cursor.execute(sql)
    #         result = cursor.fetchone()
    #         if result:
    #             return result
    #         else:
    #             return False
    #     except Exception as e:
    #         print(e)
    #         return False

    
    

        

