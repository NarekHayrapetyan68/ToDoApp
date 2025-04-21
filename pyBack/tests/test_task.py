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
    client.post("/auth/register", json={
        "username": "decodeuser",
        "email": "decode@example.com",
        "password": "decodepass"
    })
    login_res = client.post("/auth/login", json={
        "email": "decode@example.com",
        "password": "decodepass"
    })

    print("Login status:", login_res.status_code)
    print("Login data:", login_res.get_data(as_text=True))

    assert login_res.status_code == 200
    assert login_res.is_json
    token = login_res.get_json()["token"]

    decode_res = client.post("/auth/decode", json={"token": token})
    assert decode_res.status_code == 200
    assert "sub" in decode_res.get_json()

def test_decode_invalid_token(client):
    fake_token = "this.is.a.fake.token"
    decode_res = client.post("/auth/decode", json={"token": fake_token})
    assert decode_res.status_code == 400
    assert "error" in decode_res.json
