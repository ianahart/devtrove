from django.urls import path
from . import views
urlpatterns = [
    path('settings/<int:pk>/', views.DetailAPIView.as_view())
]
