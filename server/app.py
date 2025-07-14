#!/usr/bin/env python3
# Standard library imports
# Remote library imports
from flask import request, session
from flask_restful import Resource
from flask_login import login_required, current_user, login_user, logout_user
from datetime import datetime
from sqlalchemy.orm import joinedload

# Local imports
from config import app, db, api, login_manager
from models import User, Trip, Place, Event
from schemas import UserSchema, TripSchema, PlaceWithEventsSchema, EventSchema, PlaceSchema

user_schema = UserSchema()
trip_schema = TripSchema()
place_schema = PlaceSchema()
places_schema = PlaceSchema(many=True)
placewithevent_schema = PlaceWithEventsSchema()
placeswithevent_schema = PlaceWithEventsSchema(many=True)
event_schema = EventSchema()

@login_manager.user_loader
def load_user(user_id):
    return User.query.options(
        joinedload(User.trips).joinedload(Trip.places).joinedload(Place.events),
        joinedload(User.trips).joinedload(Trip.events)
        ).get(int(user_id))

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
        print("Current user JSON: ", user_schema.dump(current_user))
        return user_schema.dump(current_user), 200

class Logout(Resource):
    def delete(self):
        logout_user()
        return {}, 204
        
class TripResource(Resource):
    @login_required
    def post(self):
        data = request.get_json()
        name = data.get('name')
        start_date = datetime.strptime(data.get('start_date'), '%Y-%m-%d').date()
        end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d').date()
        
        if not name or not start_date or not end_date:
            return {'error': 'Trip name, start_date and end_date are required'}, 400

        if start_date and end_date and start_date > end_date:
            return {'error': 'Start date must be before end date'}, 400

        try:
            new_trip = Trip(
                name=name, 
                start_date=start_date,
                end_date=end_date, 
                user_id=current_user.id, 
            )
            db.session.add(new_trip)
            db.session.commit()

            return trip_schema.dump(new_trip), 200
        except Exception as e:
            return {'error': str(e)}, 500            
            

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
        location= data.get('location')
        start_time_str = data.get('start_time')
        end_time_str = data.get('end_time')
        trip_id = data.get('trip_id')
        place_id = data.get('place_id')

        start_time = (
            datetime.strptime(start_time_str, '%Y-%m-%dT%H:%M')
            if start_time_str else None
        )

        end_time = (
            datetime.strptime(end_time_str, '%Y-%m-%dT%H:%M')
            if end_time_str else None
        )

        if start_time and end_time and end_time <= start_time:
            return {"error": "End time must be after start time."}, 400

        if not title or not planning_status or not trip_id or not place_id:
            return {'error': 'Title, planning_status, trip_id, and place_id are required'}, 400
        
        if planning_status not in ['tentative', 'confirmed']:
            return {'error': 'Invalid planning_status value'}, 400

        if start_time and end_time and start_time >= end_time:
            return {'error': 'Start time must be before end time'}, 400

        trip = Trip.query.get(trip_id)
        place = Place.query.get(place_id)

        if not trip or not place:
            return {'error': 'Invalid trip or place ID'}, 400
        try:
            new_event = Event(
                title=title, 
                planning_status=planning_status,
                location=location,
                start_time=start_time,
                end_time=end_time, 
                trip_id=trip_id, 
                place_id=place_id
            )
            db.session.add(new_event)
            if place not in trip.places:
                trip.places.append(place)

            db.session.commit()

            return event_schema.dump(new_event), 200
        except Exception as e:
            return {'error': str(e)}, 500
            
class EventById(Resource):
    @login_required
    def patch(self, id):
        event = current_user.events.filter_by(id=id).first()

        if not event:
            return {'error': 'Event not found'}, 404

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
        event = current_user.events.filter_by(id=id).first()
        # will this work ?? can i access events directly since its flask login?
        if not event:
            return {'error': 'Event not found'}, 404
        
        try:
            db.session.delete(event)
            db.session.commit()

            # check if last event (check within current user ? not all?)
            if not Event.query.filter_by(trip_id=trip.id, place_id=place.id).first():
                trip.places.remove(place)
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
api.add_resource(TripResource, '/trips', endpoint='trips')
api.add_resource(PlaceResource, '/places', endpoint='places')
api.add_resource(EventResource, '/events', endpoint='events')
api.add_resource(EventById, '/events/<int:id>', endpoint='event_by_id')

if __name__ == '__main__':
    app.run(port=5555, debug=True)