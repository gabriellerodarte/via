from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from flask_login import UserMixin
from datetime import date, datetime

from config import db, bcrypt

trip_place_association = db.Table(
    'trip_place_association',
    db.Column('trip_id', db.Integer, db.ForeignKey('trips.id')),
    db.Column('place_id', db.Integer, db.ForeignKey('places.id'))
)

class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    trips = db.relationship('Trip', back_populates='user', cascade='all, delete-orphan')

    @validates("username")
    def validate_username(self, key, value):
        if not value or not isinstance(value, str):
            raise ValueError("Username must be a non-empty string.")
        return value

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

class Trip(db.Model):
    __tablename__ = "trips"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', back_populates='trips')
    events = db.relationship('Event', back_populates='trip')
    places = db.relationship('Place', secondary=trip_place_association, back_populates='trips')

    __table_args__ = (
        db.CheckConstraint(
            "start_date <= end_date",
            name="check_start_date_before_end_date"
        ),
    )

    @validates("user_id")
    def validate_user(self, key, user_id):
        if not db.session.get(User, user_id):
            raise ValueError("User not found.")
        return user_id


    @validates("name")
    def validate_name(self, key, value):
        if not value or not isinstance(value, str):
            raise ValueError("Trip name is required and must be a string.")
        return value.strip()

    @validates("start_date", "end_date")
    def validate_dates(self, key, value):
        if not isinstance(value, date):
            raise ValueError(f'{key} is required and must be a valid date object.')
        return value

class Place(db.Model):
    __tablename__ = "places"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    address = db.Column(db.String, unique=True, nullable=False)

    events = db.relationship('Event', back_populates='place')
    trips = db.relationship('Trip', secondary=trip_place_association, back_populates='places')

    @validates("name")
    def validate_place_name(self, key, value):
        if not value or not isinstance(value, str):
            raise ValueError("Place name is required and must be a string.")
        return value.strip()

    @validates("address")
    def validate_address(self, key, value):
        if not value or not isinstance(value, str):
            raise ValueError("Address is required and must be a string.")
        return value.strip()

class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    planning_status = db.Column(db.String, nullable=False, default='tentative')
    location = db.Column(db.String, nullable=False)
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)

    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    place_id = db.Column(db.Integer, db.ForeignKey('places.id'), nullable=False)

    trip = db.relationship('Trip', back_populates='events')
    place = db.relationship('Place', back_populates='events')

    __table_args__ = (
        db.CheckConstraint(
            "planning_status IN ('confirmed', 'tentative')",
            name='check_planning_status_valid'
        ),
        db.CheckConstraint(
            "(start_time IS NULL or end_time IS NULL OR start_time <= end_time)",
            name='check_start_time_before_end_time_or_null'
        ),
    )

    @validates("title")
    def validate_title(self, key, value):
        if not value or not isinstance(value, str):
            raise ValueError("Event title is required and must be a string.")
        return value.strip()

    @validates("planning_status")
    def validate_status(self, key, value):
        allowed = ["tentative", "confirmed"]
        if value not in allowed:
            raise ValueError("Planning status must be 'tentative' or 'confirmed'.")
        return value

    @validates("start_time", "end_time")
    def validate_event_times(self, key, value):
        if value is not None and not isinstance(value, datetime):
            raise ValueError(f'{key} must be a valid datetime or null.')
        return value

    @validates("trip_id")
    def validate_trip(self, key, trip_id):
        if not db.session.get(Trip, trip_id):
            raise ValueError("Trip not found.")
        return trip_id

    @validates("place_id")
    def validate_place(self, key, place_id):
        if not db.session.get(Place, place_id):
            raise ValueError("Place not found.")
        return place_id