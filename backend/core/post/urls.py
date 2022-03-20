from django.contrib import admin
from django.urls import path, include
from post import views

from rest_framework import routers

routes = routers.SimpleRouter()

routes.register(r'posts', views.PostViewSet, basename='Post')

urlpatterns = [
    *routes.urls
]

