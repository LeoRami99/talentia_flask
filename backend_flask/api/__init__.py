import os
import flask_monitoringdashboard as dashboard
from flask import Flask
from dotenv import load_dotenv
# JWT for auth 
from flask_jwt_extended import JWTManager
# cors
from flask_cors import CORS
# instancia de los blueprints de la api

# uso de sockets 
from flask_socketio import SocketIO
socketio = SocketIO()
# Api de usuario
from api.usuarios.api_usuario import api_usuario
# Api de cursos
from api.cursos.api_curso import api_curso

load_dotenv()
def createApi():
    app = Flask(__name__, static_folder='../imagenes', static_url_path='/curso-imagenes')
    dashboard.bind(app)
    socketio.init_app(app)
    CORS(app)
    app.config['SECRET_KEY'] = os.environ.get('MY_SECRET_KEY')
    # configuraciones de la llave secreta para JWT
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
    #configuración de JWT
    jwt=JWTManager(app)
    # cors

    # registro de los blueprints
    app.register_blueprint(api_usuario)
    app.register_blueprint(api_curso)
    # hacer el manejo de errores 
    @app.errorhandler(404)
    def page_not_found(e):
        return {
            'message': 'La ruta solicitada no existe'
        }, 404



    return app
    