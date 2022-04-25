from django.urls import path
from auth import views
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
        path('auth/register/', views.RegisterView.as_view()),
        path('auth/refresh/', TokenRefreshView.as_view()),
        path('auth/login/', views.TokenObtainPairView.as_view()),
        path('auth/logout/', views.LogoutView.as_view()),
    path('auth/<int:pk>/change-password/', views.ChangePasswordAPIView.as_view())
]

