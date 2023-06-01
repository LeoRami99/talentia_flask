from flask import Flask, Blueprint, make_response, request
from flask.json import jsonify
from api.cursos.clase.CursoDB import CursoDB


api_curso = Blueprint('api_curso', __name__, url_prefix='/curso')

""" 
    Endpoint para la creación de cursos y la visualización de estos mismos
"""

@api_curso.route('/create', methods=['POST', 'GET'])
def create():
    
    # jsonn request
    if request.method == 'POST':
        try:
            datos=request.get_json()
            if len(datos) > 0 or datos is "{}":
                titulo_curso = datos.get('title')
                descripcion_curso = datos.get('description')
                imagen_portada = datos.get('imagen_portada')
                imagen_card = datos.get('imagen_card')
                trailer = datos.get('url_video_intro')
                precio = datos.get('price')
                id_instructor = 1
                estado = 1
                
                if titulo_curso is not None and descripcion_curso is not None and imagen_portada is not None and imagen_card is not None and trailer is not None and precio is not None and id_instructor is not None:
                    curso = CursoDB(imagen_portada, imagen_card, titulo_curso, descripcion_curso, trailer, precio, id_instructor)
                    curso_id = curso.create_curso()
                    if datos.get('sections')!=None:
                        for seccion in datos.get('sections'):
                            seccion_id = CursoDB.create_section(curso_id, seccion['headerTitle'], 1)
                            if seccion.get('items')!=None:
                                for subsection in seccion.get('items'):
                                    CursoDB.create_subsection(seccion_id, subsection['title'], subsection['url'])
                    response_data = {"message": "Curso creado", "status": 200}
                    return make_response(jsonify(response_data), 200)
                else:
                    response_data = {"message": "No hay datos", "status": 400}
                    return make_response(jsonify(response_data), 400)
            else:
                response_data = {"message": "No hay datos", "status": 400}
                return make_response(jsonify(response_data), 400)
        except Exception as e:
            # print(e)
            response_data = {"message": "Error en el servidor", "status": 500}
            return make_response(jsonify(response_data), 500) 
""" Este endpoint es para subir las imagenes de portada y carda de cada curso , se debe enviar por form-data """

@api_curso.route('/upload_imagenes_curso', methods=['POST'])
def  upload_imagenes_curso():
    print("hola")
    if request.method=="POST":
        print(request.data)
        try:
            
            # se optiene por formularo las imagenes de portada y card
            imagen_portada = request.files['imagen_portada']
            imagen_card = request.files['imagen_card']
            # se hace una condición en el caso de que las imagenes no esten vacias 
            # vacias se refiere que no se hayan enviado imagenes
            if imagen_portada.filename != " " or imagen_card.filename != " ":
                # se cambia el nombre de la imagen para evitar que se repitan en el servidor
                imagen_portada.filename = "portada_"+imagen_portada.filename
                imagen_card.filename = "card_"+imagen_card.filename
                # se suben las imagenes al servidor
                # Esta ruta es la ruta donde se guardan las imagenes en el servidor, pero puede cambiar en producción
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

