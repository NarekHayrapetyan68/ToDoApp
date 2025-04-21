def test_register_user(client):
    res = client.post("/auth/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword"
    })
    assert res.status_code == 201
    assert res.json["message"] == "User registered successfully"

def test_login_success(client):
    # First, register the user
    client.post("/auth/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword"
    })
    # Then, login
    res = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "testpassword"
    })
    assert res.status_code == 200
    assert "token" in res.json

def test_login_invalid_password(client):
    client.post("/auth/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword"
    })
    res = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "wrongpassword"
    })
    assert res.status_code == 401
    assert res.json["message"] == "Invalid credentials"

def test_decode_valid_token(client):
    # Register & Login to get token
    client.post("/register", json={
        "username": "decodeuser",
        "email": "decode@example.com",
        "password": "decodepass"
    })
    login_res = client.post("/login", json={
        "email": "decode@example.com",
        "password": "decodepass"
    })
    token = login_res.json["token"]

    # Decode the token
    decode_res = client.post("/auth/decode", json={"token": token})
    assert decode_res.status_code == 200
    assert decode_res.json["sub"] is not None  # the user ID

def test_decode_invalid_token(client):
    fake_token = "this.is.a.fake.token"
    decode_res = client.post("/auth/decode", json={"token": fake_token})
    assert decode_res.status_code == 400
    assert "error" in decode_res.json
