from flask import Flask
from api import createApi, socketio
app = createApi()

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
    # app.run(debug=True, host='0.0.0.0')