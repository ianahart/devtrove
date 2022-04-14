from rest_framework import serializers
from bs4.element import NavigableString, ResultSet
from bs4 import BeautifulSoup
import requests
import logging
from .models import Post
from .services.scraper import Scraper
logger = logging.getLogger('django')


class PostSerializer(serializers.ModelSerializer):
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

    def create(self, **validated_data):
        try:
            covers = validated_data['validated_data']
            home_page = requests.post(covers)
            scraper = Scraper(home_page.text, 25)
            scraper.parse_covers()
            covers = scraper.get_covers()

            rows = []
            if isinstance(covers, list):
                for cover in covers:
                    details_page = cover['details_url']
                    page = requests.post(details_page)

                    scraper = Scraper(page.text)
                    scraper.collect_details()
                    snippet, cover_image, logo = scraper.get_details()
                    cover['cover_image'] = str(cover_image)
                    cover['snippet'] = str(snippet)
                    cover['logo'] = str(logo)

                    rows.append(
                        Post(title=cover['title'],
                        tags=cover['tags'],
                        logo=cover['logo'],
                        author=cover['author'],
                        min_to_read=cover['min_to_read'],
                        cover_image=cover['cover_image'],
                        snippet=cover['snippet'],
                        details_url=cover['details_url'],
                        published_date=cover['published_date'],
                        author_pic=cover['author_pic'],
                        slug=cover['slug']))


            else:
                raise ValueError

            Post.objects.bulk_create(rows)
            return validated_data
        except (KeyError, ValueError) as e:
            logger.error(msg='Unable to save scraped articles.')


