from flask import Flask, Blueprint, make_response, request
from flask.json import jsonify
from api.cursos.clase.CursoDB import CursoDB
from werkzeug.exceptions import HTTPException
from flask_socketio import emit
from api import socketio





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
            if True:
                titulo_curso = datos.get('title')
                descripcion_curso = datos.get('description')
                imagen_portada = datos.get('imagen_portada')
                imagen_card = datos.get('imagen_card')
                trailer = datos.get('url_video_intro')
                precio = datos.get('price')
                id_instructor = 1
                estado = 1
                dificultad = datos.get("dificultad")
                print(titulo_curso, descripcion_curso, imagen_portada, imagen_card, trailer, precio, id_instructor)
                if titulo_curso is not None and descripcion_curso is not None and imagen_portada is not None and imagen_card is not None and trailer is not None and precio is not None and id_instructor is not None:
                    curso = CursoDB(imagen_portada, imagen_card, titulo_curso, descripcion_curso, trailer, precio, id_instructor, estado, dificultad)
                    curso_id = curso.create_curso()
                    if datos.get('sections') is not None:
                        for seccion in datos.get('sections'):
                            seccion_id = CursoDB.create_section(curso_id, seccion['headerTitle'], 1)
                            if seccion.get('items') is not None:
                                for subsection in seccion.get('items'):
                                    CursoDB.create_subsection(seccion_id, subsection['title'], subsection['url'])
                    # emitir el evento para que se actualice la lista de cursos en el front end
                    socketio.emit('update_courses', {'data': 'update'})

                    response_data = {"message": "Curso creado", "status": 200}
                    return make_response(jsonify(response_data), 200)
                else:
                    response_data = {"message": "No hay datos", "status": 400}
                    return make_response(jsonify(response_data), 400)
            else:
                response_data = {"message": "No hay datos", "status": 400}
                return make_response(jsonify(response_data), 400)
        except Exception as e:
            print(e)
            response_data = {"message": "Error en el servidor", "status": 500}
            return make_response(jsonify(response_data), 500) 
""" Este endpoint es para subir las imagenes de portada y carda de cada curso , se debe enviar por form-data """

@api_curso.route('/upload_imagenes_curso', methods=['POST'])
def  upload_imagenes_curso():
    if request.method=="POST":
        print(request.data)
        try:
            #se optiene por formularo las imagenes de portada y card
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
# @api_curso.route('/get-all-cursos', methods=['GET'])
# def get_all_cursos():
#     if request.method == 'GET':
#         try:
#             cursos = CursoDB.get_cursos()
#             emit('cursos', cursos)
#             return jsonify(cursos), 200
#         except Exception as e:
#             print(e)
#             response_data = {"message": "Error en el servidor", "status": 500}
#             return make_response(jsonify(response_data), 500) 
#     else:
#         response_data = {"message": "Metodo no permitido", "status": 405}
#         return jsonify (response_data, 405)
    
""" Socket para mostrar todos los cursos en tiempo real """
@socketio.on('get_all_cursos')
def socket_get_all_cursos():
    try:
        cursos = CursoDB.get_cursos()
        # enviar los cursos a todos los clientes conectados
        emit('cursos', cursos)
    except Exception as e:
        print(e)
        emit('error', {'message': "Error en el servidor", 'status': 500})


    
@api_curso.route('/get-cursos', methods=['GET'])
def get_cursos():
    try:
        cursos = CursoDB.get_cursos()
        response_data = {"message": "Cursos obtenidos", "status": 200, "cursos": cursos}
        return jsonify(response_data), 200
    except Exception as e:
        print(e)
        response_data = {"message": "Error en el servidor", "status": 500}
        return jsonify(response_data), 500
    
@api_curso.route('/get-curso/<int:id_curso>', methods=['GET'])
def get_curso(id_curso):
    try:
        if request.method == 'GET':
            curso = CursoDB.get_curso(id_curso)
            if curso:
                response_data = {"message": "Curso obtenido", "status": 200, "curso": curso}
                return jsonify(response_data), 200
            else:
                response_data = {"message": "Curso no encontrado", "status": 404}
                return jsonify(response_data), 404
        else:
            response_data = {"message": "Metodo no permitido", "status": 405}
            return jsonify (response_data, 405)
    except Exception as e:
        print(e)
        response_data = {"message": "Error en el servidor", "status": 500}
        return jsonify(response_data), 500
    
    

