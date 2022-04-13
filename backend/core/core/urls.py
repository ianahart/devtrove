from django.contrib import admin
from django.urls import path, include

from rest_framework import routers




router = routers.SimpleRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(('account.urls', 'account'))),
    path('api/v1/', include(('auth.urls', 'auth'))),
    path('api/v1/', include(('post.urls', 'post'))),
    path('api/v1/', include(('comment.urls', 'comment')))
]



