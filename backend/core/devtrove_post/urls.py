from django.contrib import admin
from django.urls import path
from devtrove_post import views

urlpatterns = [
    path('devtrove-posts/', views.ListCreateAPIView.as_view()),
    path('devtrove-posts/<int:pk>/', views.DetailAPIView.as_view()),
]


