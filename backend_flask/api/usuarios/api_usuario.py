from flask import Blueprint

api_usuario = Blueprint('api_usuario', __name__, url_prefix='/api/usuario')
@api_usuario.route('/hola', methods=['GET'])
def hola():
    return {
        'message': 'Hola desde la API de usuarios'
    }

