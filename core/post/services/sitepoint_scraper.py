# pyright:  reportOptionalSubscript=false
import requests
from bs4 import BeautifulSoup
from bs4.element import NavigableString, Tag, ResultSet
import logging
logger = logging.getLogger('django')

class SitePointsScraper():

    def __init__(self, content, limit):
        self.soup = BeautifulSoup(content, 'html.parser')
        self.content = content
        self.limit = limit
        self.posts = []


    def get_post_covers(self):
        return self.posts

    def parse_post_cover(self):
        try:
            posts, content = [], None

            soup = self.soup.body
            if soup is None:
                raise ValueError('No content to parse.')

            section = soup.find_all('section')
            if section is not None:
                content = section[1]

            if content is None:
                raise ValueError('No posts to parse.')

            for node in content.contents[0:self.limit]:
                node = self.__dissect(node)
                self.posts.append(node)
        except (Exception, ValueError) as e:
            logger.error('The parsing of overall sitepoint cover has failed.', str(e))



    def __logo(self):
        logo = ''
        res = requests.get('https://www.sitepoint.com/community/')
        self.soup = BeautifulSoup(res.text, 'html.parser')
        links = self.soup.head.find_all('link')

        for link in links:
            if 'apple-touch-icon' in link['rel']:
                logo = link['href']

        return logo

    def __dissect(self, node: Tag):
        try:
            image, title, post = None, '' ,{}
            if node.img:
                image = node.img['src']
            post['cover_image'] = image if image is not None else '[]'
            if node.a:
                post['details_url'] = 'https://www.sitepoint.com%s'%(node.a['href'])
                post['slug'] = node.a['href']



                post['logo'] = self.__logo()
                post['min_to_read'] = ''

            author, snippet = node.find_all('p') if node.find_all('p') else (None, None)
            if author and snippet:
                post['snippet'] = snippet.text
                post['author'] = author.span.text.split('By ')[1]

                full_post = self.__details(post)
                return full_post

        except (TypeError, ValueError, ) as e:
            logger.error('Unable to scraoe the details page of sitepoint', str(e))


    def __details(self, post):
        try:

            if 'details_url' in post:
                res = requests.get(post['details_url'])
                header, author_pic, logo = None, None, None

                self.soup = BeautifulSoup(res.text, 'html.parser')
                if self.soup.body is not None:
                    headers = self.soup.body.find_all('header')
                    if len(headers) > 1:
                        header = headers[1]
                        logo = headers[0].nav.div.svg
                        img_container = header.find_all('div')[1]
                        post['title'] = header.h1.text if header is not None else ''
                        post['author_pic'] = img_container.div.a.img['src']
                        post['published_date'] = img_container.div.div.time.text.split(',')[0]
                        tags = [f'#{tag.text}' for tag in headers[1].ul.contents]
                        post['tags'] = tags if tags else []

            return post

        except (TypeError, ValueError, ) as e:
            logger.error(str(e), ' sitepoint scraper')



