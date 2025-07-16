from config import app, db, api, ma
from marshmallow import post_dump
from models import User, Trip, Place, Event


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
    events = ma.Method("get_events")

    def get_events(self, place):
        trip_id = self.context.get("trip_id")
        filtered = [e for e in place.events if e.trip_id == trip_id]
        return EventSchema(many=True).dump(filtered)

placewithevent_schema = PlaceWithEventsSchema()
placewithevents_schema = PlaceWithEventsSchema(many=True)

# class TripPlaceSchema(ma.SQLAlchemySchema):
#     class Meta:
#         model = Event
        
#     id = ma.auto_field()
#     place = ma.Nested(PlaceSchema)

class TripSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Trip
        load_instance = True

    id = ma.auto_field()
    name = ma.auto_field()
    start_date = ma.auto_field()
    end_date = ma.auto_field()
    # places = ma.Pluck(TripPlaceSchema, 'place', many=True)
    places = ma.Method("get_trip_places")

    def get_trip_places(self, trip):
        place_set = {e.place for e in trip.events}
        schema = PlaceWithEventsSchema(many=True)
        schema.context["trip_id"] = trip.id
        return schema.dump(list(place_set))

trip_schema = TripSchema()

class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True

    id = ma.auto_field()
    username = ma.auto_field()
    trips = ma.Nested(TripSchema, many=True)

user_schema = UserSchema()

class PlaceSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Place
        load_instance = True
    
    id = ma.auto_field()
    name = ma.auto_field()
    address = ma.auto_field()

place_schema = PlaceSchema()
places_schema = PlaceSchema(many=True)

class NewEventSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Event
        load_instance = True

    id = ma.auto_field()
    title = ma.auto_field()
    planning_status = ma.auto_field()
    location = ma.auto_field()
    start_time = ma.auto_field()
    end_time = ma.auto_field()

    place = ma.Nested(PlaceSchema)
    trip = ma.Nested(lambda: TripSchema(only=('id',)))

new_event_schema = NewEventSchema()
