from django.urls import path
from bookmark import views
urlpatterns = [
    path('bookmarks/', views.ListCreateAPIView.as_view()),
    path('bookmarks/<int:pk>/', views.DetailAPIView.as_view()),
]

