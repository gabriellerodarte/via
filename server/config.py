from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_login import LoginManager
from sqlalchemy import MetaData


app = Flask(__name__)
app.secret_key = b'57a53b21b4ed7d43c6014a08c6005b844395fa624412d7e4859d41c89725c893'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True
app.json.compact = False

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)
ma = Marshmallow(app)
login_manager = LoginManager(app)

api = Api(app)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
bcrypt = Bcrypt(app)