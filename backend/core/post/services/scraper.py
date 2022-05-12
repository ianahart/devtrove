from bs4.element import NavigableString, Tag, ResultSet
from typing import Union
import requests
from bs4 import BeautifulSoup
import logging
logger = logging.getLogger('django')

class Scraper ():
    cover_photo: str | ResultSet
    snippet = ''

    def __init__(self,  content, limit = 20):
        self.__content = content
        self.__limit = limit
        self.soup = BeautifulSoup(content, 'html.parser')
        self.logo = ''

    def get_covers(self):
        return self.content


    def get_details(self):
        return self.snippet, self.cover_photo, self.logo


    def collect_details(self):
        try:
            self.__parse_snippet()
            self.__parse_cover_photo()
            self.__parse_logo()
        except Exception as e:
            logger.error('Unable to retrieve cover_photo and first paragraph of details.')



    def __parse_logo(self):
        try:
            self.logo = self.soup.head.find(type='image/x-icon')
            print(self.logo, 'asFDSFDS@#$%@#FWEDS')
            if not isinstance(self.logo, NavigableString):
                if hasattr(self.logo, 'href'):
                    self.logo = self.logo.get('href')
                else:
                    self.logo = ''
            else:
                self.logo = ''
        except ValueError:
            logger.error('Unable to retrieve logo for article\'s website.')


    def __parse_snippet(self):
        try:
            self.snippet = self.soup.find(class_='crayons-article__main')
            if isinstance(self.snippet, Tag):
                snippet = self.snippet.div.p
                if not snippet:
                    snippet = ''
                else:
                    snippet = snippet.get_text()
                exists = snippet[3:-4] if snippet else ''
                if not exists:
                    raise ValueError
                self.snippet = snippet
            else:
                raise ValueError
        except ValueError:
            self.snippet = ''
            logger.error('Unable to scrape first paragraph of details page.')


    def __parse_cover_photo(self) -> None:
        try:
            self.content = self.soup.article
            if not self.content:
                raise ValueError

            self.cover_photo = self.content.find_all(
                    'img',
                    class_="crayons-article__cover__image"
                    )

            target = 'src='
            text_node = ''

            for element in self.cover_photo:
                element = str(element)
                text_node, = [attr for attr in element.split(' ') if attr.startswith(target)]
                if target not in text_node:
                    raise ValueError
            if len(text_node):
                self.cover_photo = text_node.split(target)[1].replace('"', '')
        except (TypeError, ValueError) as e:
               logger.error(msg='Unable to scrape cover photo for dev article.')

    def parse_covers(self):
        try:
            self.content = self.soup.main.find('div', id='substories')
            if not isinstance(self.content, NavigableString):
                pass
                children = self.content.find_all(class_='crayons-story')
                if children is not None:
                     self.content = self.__parse_cover_children(children)
        except Exception as e:
            logger.error(msg='Unable to scrape covers for dev articles.')

    def format(self, cover: dict):
        exclude, formatted = ['details_url',  'snippet', 'cover_image'], {}
        for key, value in cover.items():
            if isinstance(value, list):
                formatted[key] = [item for item in value if item != '\n']
            else:
                formatted[key] = ' '.join(value.split()) if key not in exclude else value
        return formatted


    def __parse_cover_children(self, children) -> list[dict] | None:
        try:
            covers = []

            for index, child in enumerate(children):
                if index + 1 == self.__limit:
                    break
                published_date = child.find('time').text
                author = child.find(class_='profile-preview-card').button.text
                title = child.find(class_='crayons-story__title').text
                min_to_read = child.find(class_='crayons-story__save').small.text

                details_url = child.find(class_='crayons-story__title').a
                author_pic = child.find(class_='crayons-story__author-pic').a.img

                tag = child.find(class_='crayons-story__tags')
                tags = [tag.text for tag in list(tag.children)]
                details_url = details_url['href']
                index = details_url.rfind('/')
                slug = details_url[index:]
                cover = {
                    'title':title,
                    'tags': tags,
                    'author':author,
                    'min_to_read': min_to_read,
                    'published_date': published_date,
                    'cover_image': None,
                    'snippet': None,
                    'author_pic': author_pic['src'],
                    'details_url': f'https://www.dev.to{details_url}',
                    'slug': slug

                }
                covers.append(self.format(cover))
            return covers
        except ValueError as e:
            logger.error(msg='Unable to find children of the dev cover element.')
            return None
