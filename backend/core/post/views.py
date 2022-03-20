from rest_framework import  viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class PostViewSet(viewsets.ViewSet):
    """
    A Viewset for getting posts.
    """
    def list(self, request):
        permission_classes = (IsAuthenticated,)

        return Response('authenticated request', status=status.HTTP_200_OK)


