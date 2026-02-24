from flask_restx import Namespace, Resource, fields
from app.services import facade

api = Namespace("places", description="Place operations")

amenity_model = api.model("Amenity", {
    "id": fields.String,
    "name": fields.String
})

user_model = api.model("User", {
    "id": fields.String,
    "first_name": fields.String,
    "last_name": fields.String,
    "email": fields.String
})

review_model = api.model("Review", {
    "id": fields.String,
    "text": fields.String,
    "rating": fields.Integer,
    "user_id": fields.String
})

place_model = api.model("Place", {
    "title": fields.String(required=True),
    "description": fields.String,
    "price": fields.Float(required=True),
    "latitude": fields.Float(required=True),
    "longitude": fields.Float(required=True),
    "owner_id": fields.String(required=True),
    "amenities": fields.List(fields.String)
})


@api.route("/")
class PlaceList(Resource):

    @api.expect(place_model)
    def post(self):
        try:
            place = facade.create_place(api.payload)
            return place.to_dict(), 201
        except ValueError as e:
            return {"error": str(e)}, 400

    def get(self):
        places = facade.get_all_places()
        return [p.to_dict() for p in places], 200


@api.route("/<place_id>")
class PlaceResource(Resource):

    def get(self, place_id):
        place = facade.get_place(place_id)
        if not place:
            return {"error": "Place not found"}, 404
        return place.to_dict(), 200

    @api.expect(place_model)
    def put(self, place_id):
        place = facade.update_place(place_id, api.payload)
        if not place:
            return {"error": "Place not found"}, 404
        return {"message": "Place updated successfully"}, 200


@api.route("/<place_id>/reviews")
class PlaceReviewList(Resource):

    def get(self, place_id):
        reviews = facade.get_reviews_by_place(place_id)
        if reviews is None:
            return {"error": "Place not found"}, 404
        return [r.to_dict() for r in reviews], 200
