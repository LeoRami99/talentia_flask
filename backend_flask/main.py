from flask import Flask
from api import createApi
app = createApi()
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')