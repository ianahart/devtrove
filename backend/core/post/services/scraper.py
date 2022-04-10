from bs4.element import NavigableString, ResultSet
import requests
from bs4 import BeautifulSoup
import logging
logger = logging.getLogger('django')

class Scraper ():
    cover_photo: str | ResultSet

    def __init__(self,  content, limit = 20):
        self.__content = content
        self.__limit = limit
        self.soup = BeautifulSoup(content, 'html.parser')

    def get_covers(self):
        return self.content

    def get_cover_photo(self) -> str | ResultSet:
        return self.cover_photo

    def parse_cover_photo(self) -> None:
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
               print(str(e))

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
            print(e)

    def format(self, cover: dict):
        exclude, formatted = ['details_url', 'cover_image'], {}
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
                cover = {
                    'title':title,
                    'tags': tags,
                    'author':author,
                    'min_to_read': min_to_read,
                    'published_date': published_date,
                    'cover_image': None,
                    'author_pic': author_pic['src'],
                    'details_url': f'https://www.dev.to{details_url}',

                }
                covers.append(self.format(cover))
            return covers
        except ValueError as e:
            logger.error(msg='Unable to find children of the dev cover element.')
            print(e)
            return None
