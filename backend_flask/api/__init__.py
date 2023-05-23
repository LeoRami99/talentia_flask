from flask import Flask
# cors
from flask_cors import CORS
# instancia de los blueprints de la api
from api.usuarios.api_usuario import api_usuario
def createApi():
    app = Flask(__name__)
    # cors
    CORS(app)
    # registro de los blueprints
    app.register_blueprint(api_usuario)
    # hacer el manejo de errores 
    @app.errorhandler(404)
    def page_not_found(e):
        return {
            'message': 'La ruta solicitada no existe'
        }, 404



    return app
    