from django.contrib import admin
from django.urls import path
from post import views



urlpatterns = [
    path('posts/', views.ListCreateAPIView.as_view()),
    # path('posts/scrape/', views.ListCreateAPIView.as_view()),
    path('posts/search/', views.SearchAPIView.as_view()),
    path('posts/newest/', views.NewestAPIView.as_view()),
    path('posts/discussed/', views.DiscussedAPIView.as_view()),
    path('posts/upvoted/', views.UpVotedAPIView.as_view()),
    path('posts/devtrove-posts/', views.DevTroveListCreateAPIView.as_view()),
    path('posts/devtrove-posts/delete/', views.DevTroveDeleteAPIView.as_view()),
    path('posts/devtrove-posts/<int:pk>/', views.DevTroveDetailAPIView.as_view()),
    path('posts/<int:pk>/', views.DetailAPIView.as_view())
]

