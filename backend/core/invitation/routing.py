# pyright: reportGeneralTypeIssues=false
from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/invitation/(?P<user_id>[-\w]+)/$', consumers.Consumer.as_asgi()),
]

