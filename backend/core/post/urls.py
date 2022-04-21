from django.contrib import admin
from django.urls import path
from post import views



urlpatterns = [
    path('posts/', views.ListCreateAPIView.as_view()),
    path('posts/search/', views.SearchAPIView.as_view()),
    path('posts/newest/', views.NewestAPIView.as_view()),
    path('posts/discussed/', views.DiscussedAPIView.as_view()),
    path('posts/<int:pk>/', views.DetailAPIView.as_view())
]

