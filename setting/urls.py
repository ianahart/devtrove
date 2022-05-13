from django.urls import path
from . import views
urlpatterns = [
    path('settings/theme/<int:pk>/', views.ThemeAPIView.as_view()),
    path('settings/language/<int:pk>/', views.PreferredLanguageAPIView.as_view())
]
