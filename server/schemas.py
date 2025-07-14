from config import ma
from models import User, Trip, Place, Event

class NewEventSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Event
        load_instance = True
    place = ma.Nested("PlaceSchema")
    trip = ma.Nested(lambda: TripSchema(only=('id',)))

class EventSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Event
        load_instance = True

class PlaceWithEventsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Place
        load_instance = True
    events = ma.Nested("EventSchema", many=True)

class TripSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Trip
        load_instance = True
    places = ma.Nested("PlaceWithEventsSchema", many=True)

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        fields = ["id", "username", "trips"]
    trips = ma.Nested("TripSchema", many=True)

class PlaceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Place
        load_instance = True