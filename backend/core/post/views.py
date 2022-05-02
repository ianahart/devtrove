from django.core.exceptions import BadRequest, PermissionDenied
from django.core.exceptions import BadRequest
from django.core.paginator import EmptyPage
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.parsers import FormParser, MultiPartParser
from account.permissions import AccountPermission
from .serializers import DevtrovePostSerializer, DevtrovePostUpdateSerializer, PostCreateSerializer, DevtrovePostMinimalSerializer, DevtrovePostCreateSerializer, PostSearchRetrieveSerializer, PostSearchCreateSerializer, PostSerializer
from .models import Post
import json


class DevTroveDetailAPIView(APIView):

    permission_classes = [IsAuthenticatedOrReadOnly, AccountPermission, ]
    parser_classes = [ MultiPartParser, FormParser, ]


    def get(self, request, pk=None):
        try:
            if pk is None:
                raise BadRequest
            post = Post.objects.get(pk=pk)
            serializer = DevtrovePostSerializer(post)
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

    def patch(self, request, pk=None):
        try:
            post = Post.objects.get(pk=pk)
            self.check_object_permissions(request, post.user)

            main_serializer = DevtrovePostUpdateSerializer(data=request.data)


            if main_serializer.is_valid():
                main_serializer.update(main_serializer.validated_data)

            else:
                return Response(
                    {
                        'error': main_serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST)
            return Response(
                    {
                        'message': 'success',
                    }, status=status.HTTP_200_OK)
        except (Exception, PermissionDenied, ) as e:
            return Response(
                    {
                        'message': 'Something went wrong.',
                    }, status.HTTP_500_INTERNAL_SERVER_ERROR)


class DevTroveListCreateAPIView(APIView):

   permission_classes = [IsAuthenticatedOrReadOnly, ]


   def get(self, request):
       try:
           ownership, allowed_params, query_param = None, ['public', 'private'] ,''
           ownership, page = list(request.query_params.values())

           if ownership not in allowed_params:
                raise BadRequest('Invalid query parameters.')

           posts = Post.objects.get_devtrove_posts(
                ownership, request.user, 'devtrove_post', int(page))

           serializer = PostSerializer(posts['posts'], many=True)

           return Response(
                    {
                        'posts': serializer.data,
                        'pagination': {
                            'page': posts['cur_page'],
                            'has_next': posts['has_next']
                            },
                    }, status=status.HTTP_200_OK,
                )
       except (IndexError, BadRequest, Exception, ) as e:
           if isinstance(e, BadRequest):
                return Response({
                                'message': 'Bad Request.',
                                 'error':str(e)
                                }, status=status.HTTP_400_BAD_REQUEST)
           return Response(
            {
                'message': 'Something went wrong.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



   def post(self, request):
        try:
            if request.user.id != request.data['user']:
                raise PermissionDenied('You do not have access.')

            serializer = DevtrovePostCreateSerializer(data=request.data)
            if serializer.is_valid():
                result = serializer.create(validated_data=serializer.data)

                if isinstance(result, dict):
                    raise ValueError(str(result['error']))

                serializer = DevtrovePostMinimalSerializer(result)
                return Response(
                                {'message': 'success',
                                    'devtrove_post': serializer.data
                                    },
                                status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except (BadRequest, ValueError, PermissionDenied ) as e:
            if isinstance(e, ValueError):
                return Response({
                        'error': str(e),
                    },status=status.HTTP_400_BAD_REQUEST)

            if isinstance(e, PermissionDenied):
                return Response({
                                    'message': str(e),
                                },status=status.HTTP_403_FORBIDDEN)
            return Response({
                            'message': 'Something went wrong'
                            },status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class UpVotedAPIView(APIView):
    def get(self, request):
        try:
            posts = Post.objects.upvoted_posts(
                request.user.is_authenticated, request.user
            )
            serializer = PostSerializer(posts, many=True)
            return Response(
                {
                    'message': 'success',
                    'posts': serializer.data,
                },
                status=status.HTTP_200_OK
            )

        except (Exception, ValueError, EmptyPage ) as e:
            if isinstance(e, ValueError) or isinstance(e, EmptyPage):
                return Response({'posts': []}, status=status.HTTP_404_NOT_FOUND)
            return Response(
                {'message': 'Something went wrong.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DiscussedAPIView(APIView):
    def get(self, request):
        try:
            posts, pagination = Post.objects.most_discussed_posts(
                request.user.is_authenticated, request.user, request.query_params['page']
            )
            if len(posts) == 0 and len(pagination) == 0:
                raise ValueError
            serializer = PostSerializer(posts, many=True)


            return Response(
                {
                    'message': 'success',
                    'posts': serializer.data,
                    'pagination': pagination
                },
                status=status.HTTP_200_OK
            )

        except (Exception, ValueError, EmptyPage ) as e:
            data = {'posts': [], 'pagination': {'page': 1, 'has_next': False}}
            if isinstance(e, ValueError) or isinstance(e, EmptyPage):
                return Response(data, status=status.HTTP_404_NOT_FOUND)
            return Response(
                {'message': 'Something went wrong.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class NewestAPIView(APIView):
    def get(self, request):
        try:
            page = False
            posts, pagination = Post.objects.get_posts(
                request.user.is_authenticated,page, request.user) #type: ignore

            if len(posts) == 0 and len(pagination) == 0:
                raise ValueError

            serializer = PostSerializer(posts, many=True)

            if serializer.data:
                return Response({'posts': serializer.data, 'pagination': pagination}, status=status.HTTP_200_OK)

                return Response({
                            'message': 'success'
                               }, status=status.HTTP_200_OK)
            else:
                return Response({
                                    'message': 'No posts were found.'
                                }, status=status.HTTP_404_NOT_FOUND)
        except Exception:
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
            page = request.query_params['page']
            posts, pagination = Post.objects.get_posts(
                request.user.is_authenticated,
                page,request.user) # type:ignore

            if len(posts) == 0 and len(pagination) == 0:
                raise ValueError

            serializer = PostSerializer(posts, many=True)
            if serializer.data:
                return Response({'posts': serializer.data, 'pagination': pagination}, status=status.HTTP_200_OK)
            return Response({
                                'error': 'No results found.',
                            }, status.HTTP_404_NOT_FOUND)
        except Exception:
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



