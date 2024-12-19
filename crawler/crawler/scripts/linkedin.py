import os
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from crawler.spiders.webpage_spider import WebpageSpider

def main():
    # Get Scrapy settings
    settings = get_project_settings()
    
    # Set custom settings for LinkedIn
    settings.update({
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'DOWNLOAD_DELAY': 2,  # Be polite with requests
        'COOKIES_ENABLED': False,
    })
    
    # Create output directory if it doesn't exist
    output_dir = 'linkedin_help'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Initialize the crawler process
    process = CrawlerProcess(settings)
    
    # Configure spider parameters
    spider_kwargs = {
        'url': 'https://www.linkedin.com/help/linkedin',
        'limit': 100,  # Crawl up to 100 help pages
        'output_dir': output_dir,
        'exclude_patterns': 'legal,careers,jobs'  # Exclude legal, careers, and jobs pages
    }
    
    # Start the crawler
    process.crawl(WebpageSpider, **spider_kwargs)
    process.start()
