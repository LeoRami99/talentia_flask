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
            conection = conectionDatabase()
            cursor = conection.cursor()
            sql = "INSERT INTO usuarios(nombre, apellido, correo, password) VALUES ('{0}', '{1}', '{2}', '{3}')".format(self.nombre, self.apellidos, self.correo, password)
            cursor.execute(sql)
            conection.commit()
            return True
        except Exception as e:
            print(e)
            return False
    """ Metodo para verficiar que el usuario no este registrado en la base de datos """
    def verify_user(self):
        try:
            conection = conectionDatabase()
            cursor = conection.cursor()
            sql = "SELECT * FROM usuarios WHERE correo = '{0}'".format(self.correo)
            cursor.execute(sql)
            result = cursor.fetchone()
            if result:
                return True
            else:
                return False
        except Exception as e:
            print(e)
            return False
    

        

