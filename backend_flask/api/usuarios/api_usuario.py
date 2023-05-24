from flask import Blueprint, make_response, request
from flask.json import jsonify
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from api.usuarios.clase.UsuariosDB import Usuarios
import re

api_usuario = Blueprint('api_usuario', __name__, url_prefix='/user')


""" 
    Endpoint para el registro de usuarios normales a talentia
    Parametros: nombre, apellidos, correo, password
    Return: 200 si el usuario se registro correctamente
            400 si el usuario ya esta registrado
            400 si el usuario no se registro correctamente
            405 si el metodo no es POST

 """
@api_usuario.route('/signup', methods=['POST', 'GET'])
def signup():
    #Validación de los de caracteres de los campos nombre, apellidos y correo
    valid_name_pattern = r'^[a-zA-ZÀ-ÿ\s]{1,40}$'
    valid_email_pattern = r'^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$'
    # validación del metodo que si sea de tipo POST
    if request.method == 'POST':
        #Reccolección de los campos de nombre apellidos correo y password
        try:
            nombre = request.json.get('nombre', '')
            apellidos = request.json.get('apellidos', '')
            correo = request.json.get('correo', '')
            password = request.json.get('password', '')
            #Validación de los campos que no esten vacios
            if all([nombre, apellidos, correo, password]):
                #Validación de los campos que no contengan caracteres especiales 
                if re.match(valid_name_pattern, nombre) and re.match(valid_name_pattern, apellidos) and re.match(valid_email_pattern, correo):
                    #Instancia de la clase Usuarios con paramateros nombre, apellidos y correo
                    usuario = Usuarios(nombre, apellidos, correo)
                    # Verificación de que el usuario no este registrado en la base de datos
                    if usuario.verify_user() is False:
                        # Encriptación de la contraseña con el metodo generate_password_hash de la libreria werkzeug.security
                        password_hash = generate_password_hash(password)
                        # Registro del usuario en la base de datos con el metodo register_user de la clase Usuarios 
                        if usuario.register_user(password_hash):
                            # Respuesta del servidor con el mensaje de que el usuario se registro correctamente
                            response_data = {"message": "Usuario registrado exitosamente", "status": 200}
                            return make_response(jsonify(response_data), 200)
                        else:
                            # Respuesta del servidor con el mensaje de que el usuario no se registro correctamente
                            response_data = {"message": "Error al registrar usuario", "status": 400}
                            return make_response(jsonify(response_data), 400)
                    else:
                        # Respuesta del servidor con el mensaje de que el usuario ya esta registrado
                        response_data = {"message": "Usuario ya registrado", "status": 400}
                        return make_response(jsonify(response_data), 400)
                else:
                    # Respuesta del servidor con el mensaje de Error al registrar usuario campos inválido
                    response_data = {"message": "Error al registrar usuario campos inválidos", "status": 400}
                    return make_response(jsonify(response_data), 400)
            else:
                # Respuesta del servidor con el mensaje de Error al registrar usuario campos vacíos
                response_data = {"message": "Error al registrar usuario campos vacíos", "status": 400}
                return make_response(jsonify(response_data), 400)
        except Exception as e:
            # Respuesta del servidor con el mensaje en caso de haber un error en la API
            response_data = {"message": "Ocurrio un error en la API", "status": 400}
            return make_response(jsonify(response_data), 400)
    else:
        # Respuesta del servidor con el mensaje de que el metodo no es permitido
        response_data = {"message": "Método no permitido", "status": 405}
        return make_response(jsonify(response_data), 405)




    