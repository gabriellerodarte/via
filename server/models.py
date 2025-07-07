from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

trip_place_association = db.Table(
    'trip_place_association',
    db.Column('trip_id', db.Integer, db.ForeignKey('trips.id')),
    db.Column('place_id', db.Integer, db.ForeignKey('places.id'))
)

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    trips = db.relationship('Trip', back_populates='user', cascade='all, delete-orphan')

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
        )
    )

class Place(db.Model):
    __tablename__ = "places"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    address = db.Column(db.String, unique=True, nullable=False)

    events = db.relationship('Event', back_populates='place')
    trips = db.relationship('Trip', secondary=trip_place_association, back_populates='places')

class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    planning_status = db.Column(db.String, nullable=False, default='tentative')
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