from datetime import timedelta, date, datetime
from django.core.exceptions import BadRequest
from django.db.utils import DatabaseError
from rest_framework import status
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from .serializers import PostCreateSerializer, PostSerializer
from .models import Post

class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    def get(self, request):
        try:
            posts = Post.objects.get_posts(
                request.user.is_authenticated,
                                           request.user)
            serializer = PostSerializer(posts, many=True)
            if serializer.data:
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({
                                'error': 'No results found.',
                            }, status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                                'message': 'Something went wrong.',
                            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def post(self, request):
        try:
            serializer = PostCreateSerializer(data=request.data)
            if serializer.is_valid():
                result = serializer.create(validated_data=serializer.data['url'])
                return Response(
                                {'message': 'Scraping posts.'},
                                status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({
                            'message': 'Something went wrong'
                            },status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DetailAPIView(APIView):
    def get(self, request, pk=None):
        try:
            if pk is None:
                raise BadRequest
            post = Post.objects.get_post(pk=pk,
                                         is_authenticated=request.user.is_authenticated,
                                         user=request.user)
            serializer = PostSerializer(post)
            if serializer.data:
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({
                                'error': 'No results found.',
                            }, status.HTTP_404_NOT_FOUND)

        except BadRequest:
            return Response(
                {'message': 'Something went wrong'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                            )



