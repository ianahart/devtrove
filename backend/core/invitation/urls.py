from django.urls import path
from invitation import views

urlpatterns = [
    path('invitations/', views.ListCreateAPIView.as_view()),
    path('invitations/<int:pk>/', views.DetailAPIView.as_view())
]
