from django.contrib import admin
from django.urls import path
from post import views



urlpatterns = [
    path('posts/', views.ListCreateAPIView.as_view())
]

