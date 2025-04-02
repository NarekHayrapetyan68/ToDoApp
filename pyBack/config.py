import os

class Config:
    SECRET_KEY = "supersecretkey"
    SQLALCHEMY_DATABASE_URI = "sqlite:///todo.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_COOKIE_NAME = 'access_token_cookie'
    JWT_COOKIE_SECURE = False  # Set to True in production if using HTTPS
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_SECRET_KEY = "d1669b13b759c3c84df0926c23e59ccce01c7bea412d95fae553dc3871d0d8f8eb68d991a7eefd944e7491eb875b16f9ef25d6e26cc79789b80744aefcc32687"