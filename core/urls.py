from django.contrib import admin
from django.urls import path, include

from rest_framework import routers




router = routers.SimpleRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(('account.urls', 'account'))),
    path('api/v1/', include(('auth.urls', 'auth'))),
    path('api/v1/', include(('post.urls', 'post'))),
    path('api/v1/', include(('comment.urls', 'comment'))),
    path('api/v1/', include(('upvote.urls', 'upvote'))),
    path('api/v1/', include(('like.urls', 'like'))),
    path('api/v1/', include(('bookmark.urls', 'bookmark'))),
    path('api/v1/', include(('history.urls', 'history'))),
    path('api/v1/', include(('setting.urls', 'setting'))),
    path('api/v1/', include(('group.urls', 'group'))),
    path('api/v1/', include(('invitation.urls', 'invitation'))),
    path('api/v1/', include(('chat.urls', 'chat')))
]



