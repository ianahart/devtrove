import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from .channelsmiddleware import TokenAuthMiddleware
#os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'

import django
django.setup()
import chat.routing
import invitation.routing

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": TokenAuthMiddleware(
        URLRouter(
            chat.routing.websocket_urlpatterns +
            invitation.routing.websocket_urlpatterns
        )
    ),
})



