from django.contrib import admin
from django.urls import path, include
from auth import views
from rest_framework import routers

routes = routers.SimpleRouter()

routes.register(r'auth/login', views.LoginViewSet, basename='auth-login')
# routes.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')
routes.register(r'auth/logout', views.LogoutViewSet, basename='auth-logout')

urlpatterns = [
    *routes.urls
]

