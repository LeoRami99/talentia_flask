from flask import Flask, Blueprint, make_response, request
from flask.json import jsonify
from api.cursos.clase.CursoDB import CursoDB
from werkzeug.exceptions import HTTPException
# from flask_socketio import emit
# from api import socketio





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
            print(datos)
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
                categoria = datos.get("categoria")
                print(titulo_curso, descripcion_curso, imagen_portada, imagen_card, trailer, precio, id_instructor)
                if titulo_curso is not None and descripcion_curso is not None and imagen_portada is not None and imagen_card is not None and trailer is not None and precio is not None and id_instructor is not None and estado is not None and dificultad is not None and categoria is not None:
                    curso = CursoDB(imagen_portada, imagen_card, titulo_curso, descripcion_curso, trailer, precio, id_instructor, estado, dificultad)
                    curso_id = curso.create_curso()
                    # se crea la categoria para el curso
                    CursoDB.create_categoria(curso_id, categoria)
                    if datos.get('sections') is not None:
                        for seccion in datos.get('sections'):
                            seccion_id = CursoDB.create_section(curso_id, seccion['headerTitle'], seccion['descriptionSection'], 1)
                            if seccion.get('items') is not None:
                                for subsection in seccion.get('items'):
                                    CursoDB.create_subsection(seccion_id, subsection['title'], subsection['url'])
                    # emitir el evento para que se actualice la lista de cursos en el front end
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
    
@api_curso.route('/get-categorias', methods=['GET'])
def get_categorias():
    try:
        if request.method == 'GET':
            categorias = CursoDB.get_categorias()
            response_data = {"message": "Categorias obtenidas", "status": 200, "categorias": categorias}
            return make_response(jsonify(response_data), 200)
        else:
            response_data = {"message": "Metodo no permitido", "status": 405}
            return jsonify (response_data, 405)
    except Exception as e:
        print(e)
        response_data = {"message": "Error en el servidor", "status": 500}
        return jsonify(response_data), 500
    
""" Endpoints para actualizar la información de los cursos, secciones y subsecciones """
@api_curso.route('/update-curso', methods=['PUT'])
def update_curso():
    if request.method == "PUT":
        try:
            data = request.get_json()
            #Se declara varibles para guardar cada uno de los datos que se van a actualizar
            id_curso = data['id']
            imagen_portada = data['imagen_portada']
            imagen_card = data['imagen_card']
            titulo = data['titulo']
            descripcion = data['descripcion']
            trailer = data['trailer']
            precio = data['precio']
            estado = data['estado']
            dificultad = data['dificultad']
            secciones = data['secciones']
            categoria_id =  data['categoria_id']
            if all([id_curso, imagen_portada, imagen_card, titulo, descripcion, trailer, precio, estado, dificultad, secciones, categoria_id]):
                #Se actualiza la información del curso
                if CursoDB.actualizar_curso(imagen_portada, imagen_card, titulo, descripcion, trailer, precio, estado, dificultad, id_curso):
                #Se recorre la lista de secciones y se actualiza la información de cada una
                    CursoDB.actualizar_categoria(id_curso, categoria_id)
                    for seccion in secciones:
                        id_seccion = seccion['id']
                        id_curso = seccion['curso_id']
                        titulo_seccion = seccion['titulo']
                        descripcion_seccion = seccion['descripcion']
                        CursoDB.actualizar_seccion(titulo_seccion, descripcion_seccion, id_seccion, id_curso)
                        #Se recorre la lista de subsecciones y se actualiza la información de cada una
                        for subseccion in seccion['subsecciones']:
                            id_seccion = subseccion['id_seccion']
                            id_subseccion = subseccion['id_subseccion']
                            titulo_subseccion = subseccion['titulo']
                            contenido_subseccion = subseccion['contenido']
                            CursoDB.actualizar_subseccion(titulo_subseccion,contenido_subseccion, id_seccion, id_subseccion)
                    response_data = {"message": "Curso actualizado", "status": 200}
                    return jsonify(response_data), 200
                else:
                    response_data = {"message": "Error al actualizar el curso", "status": 500}
                    return jsonify(response_data), 500
            else:
                print("No entro")
                return jsonify(data)        
            # return jsonify(data) 
        except Exception as e:
            print(e)
            return jsonify ({"message": "Error en el servidor", "status": 500}, 500)
    else:
        response_data = {"message": "Metodo no permitido", "status": 405}
        return jsonify (response_data, 405)
    


# metodo para desactivar curso
@api_curso.route('/estado-curso/', methods=['PUT'])
def desactivar_curso():
    if request.method == "PUT":
        try:
            data = request.get_json()
            id_curso = data['id']
            estado_curso = data['estado']
            if all([id_curso]):
                if CursoDB.actualizar_estado(id_curso, estado_curso):
                    response_data = {"message": "Curso desactivado", "status": 200}
                    return jsonify(response_data), 200
                else:
                    response_data = {"message": "Error al desactivar el curso", "status": 500}
                    return jsonify(response_data), 500
            else:
                response_data = {"message": "Error al desactivar el curso", "status": 500}
                return jsonify(response_data), 500
            
        except Exception as e:
            print(e)
            return jsonify ({"message": "Error en el servidor", "status": 500}, 500)
    else:
        response_data = {"message": "Metodo no permitido", "status": 405}
        return jsonify (response_data, 405)
    
# metodo para eliminar curso
""" Al eliminar el curso se elimina también la se secciones, subsecciones y categorias relacionadas"""
@api_curso.route('/delete-curso/', methods=['DELETE'])
def delete_curso():
    if request.method == "DELETE":
        # print("entro al metodo delete")
        try:
            data =  request.get_json()
            print("Esta es la data para eliminar:", data)
            id_curso = data['id']
            if all([id_curso]):
                secciones = data['secciones']
                for seccion in secciones:
                    for subseccion in seccion['subsecciones']:
                        CursoDB.eliminar_subsecciones(subseccion['id_seccion'])
                    CursoDB.eliminar_secciones(id_curso, seccion['id'])
                # categorias 
                CursoDB.eliminar_categoria(id_curso)
                if CursoDB.eliminar_curso(id_curso):
                    response_data = {"message": "Curso eliminado", "status": 200}
                    return jsonify(response_data), 200
        except Exception as e:
            print(e)
            return jsonify({'message': "Error en el servidor", "status": 500}, 500)
    else:
        response_data = {"message": "Método no permitido", "status": 405}
        return jsonify(response_data), 405

        
    

        


