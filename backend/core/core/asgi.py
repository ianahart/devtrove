import os
from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
import chat.routing
import invitation.routing
from .channelsmiddleware import TokenAuthMiddleware
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": TokenAuthMiddleware(
        URLRouter(
            chat.routing.websocket_urlpatterns +
            invitation.routing.websocket_urlpatterns
        )
    ),
})



