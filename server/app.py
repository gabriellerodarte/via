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
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

