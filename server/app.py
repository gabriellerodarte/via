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

user_schema = UserSchema()
place_schema = PlaceSchema()
places_schema = PlaceSchema(many=True)
event_schema = EventSchema()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorized():
    return {'error': 'Unauthorized: Please login'}, 401

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
            new_user = User(username=username)
            new_user.password_hash = password
            db.session.add(new_user)
            db.session.commit()

            login_user(new_user)
            return user_schema.dump(new_user), 201
        except Exception as e:
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
    @login_required
    def get(self):
        print("Is authenticated: ", current_user.is_authenticated)
        print("Current user: ", current_user)
        return user_schema.dump(current_user), 200

class Logout(Resource):
    def delete(self):
        logout_user()
        return {}, 204

class PlaceResource(Resource):
    @login_required
    def get(self):
        try:
            places = Place.query.all()
            return places_schema.dump(places), 200
        except Exception as e:
            return {'error': str(e)}, 500
    
    @login_required
    def post(self):
        data = request.get_json()
        name = data.get('name')
        address = data.get('address')

        if not name or not address:
            return {'error': 'Name and address are required'}, 400
        
        try:
            new_place = Place(name=name, address=address)
            db.session.add(new_place)
            db.session.commit()

            return place_schema.dump(new_place), 201
        except Exception as e:
            return {'error': str(e)}, 500

class EventResource(Resource):
    @login_required
    def post(self):
        data = request.get_json()
        title = data.get('title')
        planning_status = data.get('planning_status', 'tentative')
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        trip_id = data.get('trip_id')
        place_id = data.get('place_id')

        if not title or not planning_status or not trip_id or not place_id:
            return {'error': 'Title, planning_status, trip_id, and place_id are required'}, 400
        
        if planning_status not in ['tentative', 'confirmed']:
            return {'error': 'Invalid planning_status value'}, 400

        if start_time and end_time and start_time >= end_time:
            return {'error': 'Start time must be before end time'}, 400

        try:
            new_event = Event(
                title=title, 
                planning_status=planning_status,
                start_time=start_time,
                end_time=end_time, 
                trip_id=trip_id, 
                place_id=place_id
            )
            db.session.add(new_event)
            db.session.commit()

            return event_schema.dump(new_event), 200
        except Exception as e:
            return {'error': str(e)}, 500
            
class EventById(Resource):
    @login_required
    def patch(self, id):
        event = Event.query.filter_by(id=id).first()

        if not event:
            return {'error': 'Event not found'}, 404

        if current_user.id != event.trip.user_id:
            return {'error': 'Unauthorized to access this resource'}, 403
        
        try:
            data = request.get_json()
            for attr, value in data.items():
                setattr(event, attr, value)
            
            db.session.add(event)
            db.session.commit()

            return event_schema.dump(event), 200
        except Exception as e:
            return {'error': str(e)}, 500
    
    @login_required
    def delete(self, id):
        event = Event.query.filter_by(id=id).first()

        if not event:
            return {'error': 'Event not found'}, 404

        if current_user.id != event.trip.user_id:
            return {'error': 'Unauthorized to access this resource'}, 403
        
        try:
            db.session.delete(event)
            db.session.commit()

            return {}, 204
        except Exception as e:
            return {'error': str(e)}, 500

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(PlaceResource, '/places', endpoint='places')
api.add_resource(EventResource, '/events', endpoint='events')
api.add_resource(EventById, '/events/<int:id>', endpoint='event_by_id')

if __name__ == '__main__':
    app.run(port=5555, debug=True)