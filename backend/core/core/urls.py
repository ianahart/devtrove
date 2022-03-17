from django.contrib import admin
from django.urls import path, include
from account import views

from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'api/v1/account', views.UserViewSet, basename='CustomUser')

urlpatterns = [
    path('admin/', admin.site.urls),
]
urlpatterns += router.urls
