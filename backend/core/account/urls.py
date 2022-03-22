from django.contrib import admin
from django.urls import path, include
from account import views

from rest_framework import routers

routes = routers.SimpleRouter()

urlpatterns = [
    path('account/<int:pk>/', views.UserView.as_view()),
]

#routes.register(r'account', views.UserViewSet, basename='CustomUser')
#urlpatterns = [
 #   *routes.urls
#]
