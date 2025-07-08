#!/usr/bin/env python3
# Standard library imports
# Remote library imports
from flask import request, session
from flask_restful import Resource
from flask_login import login_required, current_user, login_user, logout_user
# Local imports
from config import app, db, api, login_manager
from models import User, Trip, Place, Event
from schemas import UserSchema, TripSchema, PlaceWithEventsSchema, EventSchema, PlaceSchema
# Views go here!
user_schema = UserSchema()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class Signup(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return {'error': 'Username and password required'}, 400
        
        if User.query.filter_by(username=username).first():
            return {'error': 'Username already taken'}, 400
        
        try:
            new_user = User(username=username, password_hash=password)
            db.session.add(new_user)
            db.session.commit()

            login_user(new_user)
            return user_schema.dump(new_user), 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500

class Login(Resource):
    def post(self):
        data = request.get_json()
        username=data.get('username')
        password=data.get('password')

        user = User.query.filter_by(username=username).first()

        if user:
            if user.check_password(password):
                login_user(user)
                return user_schema.dump(user), 200
            else:
                return {'error': 'Invalid password'}, 401
        else:
            return {'error': 'Invalid username'}, 401

class CheckSession(Resource):
    def get(self):
        if not current_user.is_authenticated:
            return {'error': 'User not logged in'}, 401

        return user_schema.dump(current_user), 200

class Logout(Resource):
    def delete(self):
        logout_user()
        return {}, 204



@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Logout, '/logout', endpoint='logout')

if __name__ == '__main__':
    app.run(port=5555, debug=True)