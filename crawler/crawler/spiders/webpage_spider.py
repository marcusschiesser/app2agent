import os
from urllib.parse import urljoin, urlparse
from scrapy import Spider, Request
import html2text

class WebpageSpider(Spider):
    name = 'webpage'
    
    def __init__(self, url=None, limit=10, output_dir='pages', exclude_patterns=None, *args, **kwargs):
        super(WebpageSpider, self).__init__(*args, **kwargs)
        self.start_urls = [url] if url else []
        self.limit = int(limit)
        self.output_dir = output_dir
        self.pages_crawled = 0
        self.base_url = url
        self.exclude_patterns = exclude_patterns.split(',') if exclude_patterns else []
        self.html_converter = html2text.HTML2Text()
        self.html_converter.ignore_links = False
        self.html_converter.ignore_images = False
        self.html_converter.body_width = 0  # Don't wrap lines
        
        # Create output directory if it doesn't exist
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
    
    def should_follow_url(self, url):
        # Check if URL matches any exclude pattern
        path = urlparse(url).path.lstrip('/')
        return not any(path.startswith(pattern) for pattern in self.exclude_patterns)
    
    def parse(self, response):
        # Check limit before processing
        if self.pages_crawled >= self.limit:
            self.crawler.engine.close_spider(self, 'Reached page limit')
            return
        
        # Get relative path from URL
        relative_path = urlparse(response.url).path.strip('/')
        if not relative_path:
            relative_path = 'index'
        
        # Create directory structure and filename
        path_parts = relative_path.split('/')
        dir_path = os.path.join(self.output_dir, *path_parts[:-1])
        os.makedirs(dir_path, exist_ok=True)
        
        # Create the full file path
        filepath = os.path.join(self.output_dir, *path_parts) + '.md'
        
        # Extract main content
        main_content = response.css('main').get() or response.css('article').get()
        if not main_content:
            main_content = response.css('body').get()
        
        # Convert HTML to Markdown
        markdown_content = self.html_converter.handle(main_content) if main_content else ''
        
        # Save the markdown file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f'# {response.css("title::text").get() or response.url}\n\n')
            f.write(markdown_content)
        
        self.pages_crawled += 1
        
        # Follow links if we haven't reached the limit
        if self.pages_crawled < self.limit:
            for href in response.css('a::attr(href)').getall():
                url = urljoin(response.url, href)
                # Only follow links from the same domain and not excluded
                if (urlparse(url).netloc == urlparse(self.base_url).netloc and 
                    self.should_follow_url(url)):
                    yield Request(url, callback=self.parse)
