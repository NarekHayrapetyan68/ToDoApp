import pytest
import sys
import os

# Add the parent directory (where pyBack is located) to sys.path

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from pyBack.app import app as flask_app,db
from pyBack.config import  TestConfig


@pytest.fixture
def app():
    flask_app.config.from_object(TestConfig)

    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def auth_headers(client):
    # Simulate user login
    user_data = {
        'username': 'testuser',
        'password': 'password123'
    }

    # Send a POST request to the login endpoint
    response = client.post('/login', json=user_data)

    # Assert the response status is 200 OK
    assert response.status_code == 200

    # Extract the token from the response (assuming it's returned in JSON)
    token = response.json.get('access_token')

    # Return the authorization header with the token
    return {
        'Authorization': f'Bearer {token}'
    }

