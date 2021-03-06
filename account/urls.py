from django.urls import path
from account import views
urlpatterns = [
    path('account/user/', views.UserAPIView.as_view()),
    path('account/<int:pk>/', views.DetailAPIView.as_view()),
    path('account/profile/<str:handle>/', views.ProfileAPIView.as_view()),
]

