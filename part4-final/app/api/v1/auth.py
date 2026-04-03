from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.services import facade

api = Namespace('auth', description='Authentication operations')

# Model for input validation
login_model = api.model('Login', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password')
})

register_model = api.model('Register', {
    'first_name': fields.String(required=True, description='First name'),
    'last_name': fields.String(required=True, description='Last name'),
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password')
})


@api.route('/login')
class Login(Resource):
    @api.expect(login_model)
    def post(self):
        """
        Authenticate user and return a JWT token.

        Steps:
        1. Retrieve the user by email
        2. Verify the password with bcrypt
        3. Create a JWT with the user's id + is_admin claim
        4. Return the token
        """
        credentials = api.payload

        # Step 1: Retrieve the user based on the provided email
        user = facade.get_user_by_email(credentials['email'])

        # Step 2: Check if the user exists and the password is correct
        if not user or not user.verify_password(credentials['password']):
            return {'error': 'Invalid credentials'}, 401

        # Step 3: Create a JWT token with the user's id and is_admin flag
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={"is_admin": user.is_admin}
        )

        # Step 4: Return the JWT token to the client
        return {'access_token': access_token}, 200


@api.route('/register')
class Register(Resource):
    @api.expect(register_model)
    def post(self):
        """
        Public registration endpoint.
        Creates a new user and returns a JWT token.
        """
        data = api.payload

        # Check if email already exists
        existing = facade.get_user_by_email(data.get('email', ''))
        if existing:
            return {'error': 'Email already registered'}, 400

        try:
            user = facade.create_user(data)
        except ValueError as e:
            return {'error': str(e)}, 400

        # Auto-login: return JWT
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={"is_admin": user.is_admin}
        )

        return {
            'access_token': access_token,
            'user': user.to_dict()
        }, 201


@api.route('/protected')
class ProtectedResource(Resource):
    @jwt_required()
    def get(self):
        """A protected endpoint that requires a valid JWT token"""
        print("jwt------")
        print(get_jwt_identity())
        current_user = get_jwt_identity()

        return {'message': f'Hello, user {current_user}'}, 200
