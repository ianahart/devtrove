from django.urls import path
from history import views
urlpatterns = [
    path('history/', views.ListCreateAPIView.as_view()),
    path('history/<int:pk>/', views.DetailAPIView.as_view()),
]

