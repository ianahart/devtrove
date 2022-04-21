from django.core.exceptions import BadRequest
from django.core.paginator import EmptyPage
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from .serializers import PostCreateSerializer, PostSearchRetrieveSerializer, PostSearchCreateSerializer, PostSerializer
from .models import Post


class DiscussedAPIView(APIView):
    def get(self, request):
        try:
            return Response(
                {'message': 'success'},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print(e, type(e))
            return Response(
                {'message': 'Something went wrong.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class NewestAPIView(APIView):
    def get(self, request):
        try:
            newest_posts = Post.objects.get_posts(
                request.user.is_authenticated,request.user)

            serializer = PostSerializer(newest_posts, many=True)
            if serializer.data:
                return Response(serializer.data, status=status.HTTP_200_OK)

                return Response({
                            'message': 'success'
                               }, status=status.HTTP_200_OK)
            else:
                return Response({
                                    'message': 'No posts were found.'
                                }, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({
                               'message': 'Something went wrong.'
                           }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SearchAPIView(APIView):
    def post(self, request):
        try:
            serializer = PostSearchCreateSerializer(data=request.data)
            if serializer.is_valid():

                search_results, pagination = serializer.create(serializer.data)
                if search_results is None and pagination is None:
                    raise BadRequest

                search_results = PostSearchRetrieveSerializer(search_results, many=True)
                return Response(
                    {'message': 'success',
                     'search_results': search_results.data,
                     'pagination': pagination,
                    },
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response({
                    'message': 'Bad request check spelling.',
                    'error': serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST
                )
        except (TypeError, EmptyPage, BadRequest, ) as e:
            print(e)
            if isinstance(e, BadRequest) or isinstance(e, EmptyPage):
                return Response({
                    'error': 'no results',
                    'search_results': [],
                    'pagination': {'page': 1, 'has_next_page' : False}
                }, status=status.HTTP_400_BAD_REQUEST)

            return Response(
                {'message': 'Something went wrong.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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
        except (AttributeError, ValueError ):
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



