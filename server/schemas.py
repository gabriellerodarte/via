from config import app, db, api, ma
from marshmallow import post_dump
from models import User, Trip, Place, Event

class NewEventSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Event
        load_instance = True
    place = ma.Nested("PlaceSchema")
    trip = ma.Nested(lambda: TripSchema(only=('id',)))

new_event_schema = NewEventSchema()

class EventSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Event
        load_instance = True

    id = ma.auto_field()
    title = ma.auto_field()
    planning_status = ma.auto_field()
    location = ma.auto_field()
    start_time = ma.auto_field()
    end_time = ma.auto_field()

event_schema = EventSchema()
events_schema = EventSchema(many=True)

class PlaceWithEventsSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Place
        load_instance = True

    id = ma.auto_field()
    name = ma.auto_field()
    address = ma.auto_field()

placewithevent_schema = PlaceWithEventsSchema()
placewithevents_schema = PlaceWithEventsSchema(many=True)

class TripSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Trip
        load_instance = True

    id = ma.auto_field()
    name = ma.auto_field()
    start_date = ma.auto_field()
    end_date = ma.auto_field()
    places = ma.Nested(PlaceWithEventsSchema, many=True)

    @post_dump(pass_original=True)
    def attach_filtered_events(self, data, original_trip, **kwargs):
        trip_id = original_trip.id
        for idx, place_data in enumerate(data["places"]):
            original_place = original_trip.places[idx]
            filtered_events = Event.query.filter_by(
                trip_id=trip_id,
                place_id=original_place.id
            ).all()
            place_data["events"] = EventSchema(many=True).dump(filtered_events)
        return data

trip_schema = TripSchema()

class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User

    id = ma.auto_field()
    username = ma.auto_field()
    trips = ma.Nested(TripSchema, many=True)

user_schema = UserSchema()

class PlaceSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Place
        load_instance = True

place_schema = PlaceSchema()
places_schema = PlaceSchema(many=True)