from rest_framework import serializers
from bs4.element import NavigableString, ResultSet
from bs4 import BeautifulSoup
import requests
import logging
import re

from tag.models import Tag
from .models import Post
from .services.scraper import Scraper
from .services.sitepoint_scraper import SitePointsScraper
logger = logging.getLogger('django')

class DevtrovePostUpdateSerializer(serializers.ModelSerializer):
    tags = serializers.JSONField()
    title = serializers.CharField()
    cover_image = serializers.ImageField()
    class Meta:
        model = Post
        fields = ('tags', 'title', 'cover_image', 'post', )

    def validate_tags(self, value):
        if any(len(tag['tag']) > 50 for tag in value):
            raise serializers.ValidationError('Tags must be less than 50 characters.')

        return value


    def validate_title(self, value):
        if len(value) > 100:
            raise serializers.ValidationError('Title must be less than 100 characters.')

        return value

    def validate_cover_image(self, value):
        if value is None:
            raise serializers.ValidationError(
                'Please provide a cover image.')

        if value.size > 1200000:
            raise serializers.ValidationError(
                'Cover image must be under 1.2MB.')

        return value


    def update(self, validated_data):
        return Post.objects.update_devtrove_post(validated_data)



class DevtrovePostMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', )

class DevtrovePostSerializer(serializers.ModelSerializer):
    is_checked = serializers.BooleanField()
    class Meta:
        model= Post
        fields = ('post', 'title','is_checked', 'cover_image', 'author_pic', 'author', 'published_date',  )


class DevtrovePostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('user', 'post', 'author', 'author_pic')


    def validate(self, data):
        return data

    def create(self, validated_data):
        return Post.objects.create_devtrove_post(validated_data)

class PostSearchRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('cover_image', 'author', 'slug', 'id', 'title', )


class PostSearchCreateSerializer(serializers.ModelSerializer):
    search_term = serializers.CharField(max_length=200)
    page = serializers.IntegerField()

    class Meta:
        model = Post
        fields = ('search_term', 'page', )

    def validate(self, data):
        search_term = data['search_term']
        excludes = ['$', '{', '}', '[', ']', '<','>', '(', ')']

        matched = [False if char in excludes else True for char in search_term]
        if any(match == False for match in matched):
            raise serializers.ValidationError(
                    dict(search_term=['Invalid characters submitted.']))
        return data


    def create(self, validated_data):
        return Post.objects.search(**validated_data)


class PostHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = (
            'author',
            'title',
            'slug',
            'min_to_read',
            'logo',
            'cover_image'
        )

class PostBookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('title',
                  'id',
                  'slug',
                  'author',
                  'snippet',
                  'logo',
                  'author_pic',
                  'cover_image',
                  'published_date',
                  'details_url',
                  'tags',
                 'min_to_read'
                  )

 
class PostSerializer(serializers.ModelSerializer):
    comments_count = serializers.IntegerField()
    upvotes_count = serializers.IntegerField()
    cur_user_voted = serializers.BooleanField()
    cur_user_bookmarked = serializers.BooleanField()
    is_checked = serializers.BooleanField()
    class Meta:
        model = Post
        fields = ('title',
                  'id',
                  'is_checked',
                 'comments_count',
                 'upvotes_count',
                  'cur_user_voted',
                  'cur_user_bookmarked',
                  'type',
                  'slug',
                  'author',
                  'snippet',
                  'logo',
                  'author_pic',
                  'cover_image',
                  'published_date',
                  'details_url',
                  'tags',
                  'min_to_read',
                  'post',
                  'type',
                  'user',
                  )

class PostCreateSerializer(serializers.ModelSerializer):
    url = serializers.URLField(max_length=300)
    class Meta:
        model = Post
        fields = ('url', )


    def validate(self, data):
        if data is None or data == '':
            raise serializers.ValidationError(
                dict(url=['url is not formatted correctly.']))
        return data

