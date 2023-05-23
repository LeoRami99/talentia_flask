from flask import Blueprint, make_response, request
from flask.json import jsonify
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from api.usuarios.clase.UsuariosDB import Usuarios

api_usuario = Blueprint('api_usuario', __name__, url_prefix='/user')
@api_usuario.route('/signup', methods=['POST', 'GET'])
def signup():
    if request.method == 'POST':
        nombre = request.json['nombre']
        apellidos = request.json['apellidos']
        correo = request.json['correo']
        password = request.json['password']
        password = generate_password_hash(password)
        # verficar que nombre y apellidos y correo tengan caracteres validos usadno regex
        if nombre != "" and apellidos != "" and correo != "" and password != "":
            # if nombre.match(r'^[a-zA-ZÀ-ÿ\s]{1,40}$') and apellidos.match(r'^[a-zA-ZÀ-ÿ\s]{1,40}$') and correo.match(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$'):
            usuario = Usuarios(nombre, apellidos, correo)
            if usuario.register_user(password):
                response_data={"message": "Usuario registrado exitosamente", "status": 200}
                return make_response(jsonify(response_data), 200)
            else:
                response_data={"message": "Error al registrar usuario","status": 400}
                return make_response(jsonify(response_data), 400)
            # else:
            #     return jsonify({"message": "Error al registrar usuario campos invalidos"}), 400
        else:
            response_data={"message": "Error al registrar usuario campos vacios", "status": 400}
            return make_response(jsonify(response_data), 400)
    else:
        response_data={"message": "Metodo no permitido", "status": 405}
        return make_response(jsonify(response_data), 405)




    