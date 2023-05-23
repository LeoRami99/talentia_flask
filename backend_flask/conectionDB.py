from pymysql import connect

def conectionDatabase():
    host="localhost"
    user="root"
    password=""
    db="talentia"
    try:
        conection = connect(host=host, user=user, password=password, database=db)
        return conection
    except Exception as e:
        print(e)
        return None

    