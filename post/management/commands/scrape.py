from django.core.management.base import BaseCommand, CommandError
from post.models import Post
from tag.models import Tag
from post.services import sitepoint_scraper, scraper
import requests
import logging
logger = logging.getLogger('django')

class Command(BaseCommand):
    help = 'Gets scraped posts from specific websites.'

    def create_post(self, cover):
        exists = Post.objects.all().filter(title=cover['title']).first()
        if exists:
            return
        post = (
            Post(title=cover['title'],
            tags=cover['tags'],
            author=cover['author'],
            logo=str(cover['logo']) if 'logo' in cover else None,
            cover_image=cover['cover_image'],
            snippet=cover['snippet'],
            details_url=cover['details_url'],
            published_date=cover['published_date'],
            author_pic=cover['author_pic'],
            slug=cover['slug']))
        post.save()
        post.refresh_from_db()
        for tag in cover['tags']:
            tag = Tag(post_id=post.id, text=tag) #type:ignore
            tag.save()
   

    def handle(self, *args, **options):
        try:
            sitepoint = requests.get('https://www.sitepoint.com/blog/')
            devto = requests.get('https://www.dev.to')
            # Scraper second parameter must be greater than 1 post
            sp_scraper = sitepoint_scraper.SitePointsScraper(sitepoint.text, 2)
            dt_scraper = scraper.Scraper(devto.text, 2)

            sp_scraper.parse_post_cover()
            dt_scraper.parse_covers()

            sp_covers = sp_scraper.get_post_covers() 
            dt_covers = dt_scraper.get_covers()
            rows = []
            if isinstance(sp_covers, list) and isinstance(dt_covers, list):
                for cover in dt_covers + sp_covers:
                    if isinstance(cover, dict):
                        if 'www.dev.to' in cover['details_url']:
                            details_page = cover['details_url']
                            page = requests.post(details_page)
                            scraper_dets = scraper.Scraper(page.text)
                            scraper_dets.collect_details()
                            snippet, cover_image, logo = scraper_dets.get_details()
                            cover['cover_image'] = str(cover_image)
                            cover['snippet'] = str(snippet)
                            cover['logo'] = str(logo)
                        self.create_post(cover)
            self.stdout.write(self.style.SUCCESS('Successfully scraped posts'))

        except (KeyError, ValueError, Exception) as e:
            self.stdout.write(self.style.ERROR(str(e)))
            logger.error(msg='Unable to save scrape sitepoint articles.')
            self.stdout.write(self.style.ERROR('Something went wrong scraping posts.'))
