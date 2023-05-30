from flask import Flask, Blueprint, make_response, request
from flask.json import jsonify


api_curso = Blueprint('api_curso', __name__, url_prefix='/curso')

""" 
    Endpoint para la creación de cursos y la visualización de estos mismos
"""

@api_curso.route('/create', methods=['POST', 'GET'])
def create():
    return {
        "message": "Hola desde curso"
    }
def create_seccion():
    return {
        "message": "Hola desde seccion"
    }
def create_subseccion():
    return {
        "message": "Hola desde subseccion"
    }
#Subida de imagenes en el curso
@api_curso.route('/upload_imagenes_curso', methods=['POST'])
def  upload_imagenes_curso():
    if request.method=="POST":
        try:
            # se optiene por formularo las imagenes de portada y card
            imagen_portada = request.files['imagen_portada']
            imagen_card = request.files['imagen_card']
            if imagen_portada.filename != " " or imagen_card.filename != " ":
                # se cambia el nombre de la imagen para evitar que se repitan en el servidor
                imagen_portada.filename = "portada_"+imagen_portada.filename
                imagen_card.filename = "card_"+imagen_card.filename

                # se suben las imagenes al servidor
                imagen_portada.save("imagenes/curso/"+imagen_portada.filename)
                imagen_card.save("imagenes/curso/"+imagen_card.filename)
                response_data = {
                    "message": "Imagenes subidas correctamente",
                    "status:": 200,
                    # el nombre de la imagen y la extensión
                    "imagen_portada": imagen_portada.filename,
                    "imagen_card": imagen_card.filename
                }
                return make_response(jsonify(response_data), 200)
            else:
                response_data = {"message": "No hay imagenes", "status": 400}
                return jsonify (response_data, 400)
        except Exception as e:
            print(e)
            response_data = {"message": "Error al subir las imagenes", "status": 500}
            return jsonify (response_data, 500)
    else:
        response_data = {"message": "Metodo no permitido", "status": 405}
        return jsonify (response_data, 405)

