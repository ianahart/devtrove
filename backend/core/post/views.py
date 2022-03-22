from rest_framework import  viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

class PostView(APIView):
    """
    A View dev posts.
    """
    def get(self, request):
        http_method_names = ['get']
        permission_classes = [IsAuthenticated, ]
        return Response('authenticated request', status=status.HTTP_200_OK)



