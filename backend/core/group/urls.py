from django.contrib import admin
from django.urls import path
from group import views



urlpatterns = [
    path('groups/', views.ListCreateAPIView.as_view()),
    path('groups/users/', views.GroupUserListCreateAPIView.as_view()),
    path('groups/users/<int:pk>/', views.GroupUserDetailAPIView.as_view()),
]


