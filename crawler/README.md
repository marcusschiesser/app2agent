# Crawler

A web crawler that processes web content and saves it as markdown files while maintaining the original URL structure.

## Features

- Crawls websites and saves pages as markdown files
- Maintains original URL directory structure
- Configurable URL exclusion patterns
- Respects robots.txt rules
- Configurable crawl limit
- Clean markdown output with preserved links and images

## Installation

```bash
poetry install
```

## Usage

### Generic Crawler

To crawl any website and save its pages as markdown:

```bash
poetry run scrapy crawl webpage \
  -a url="https://example.com" \
  -a limit=10 \
  -a output_dir="pages" \
  -a exclude_patterns="legal,about"
```

### Parameters

- `url`: The starting URL to crawl (required)
- `limit`: Maximum number of pages to crawl (default: 10)
- `output_dir`: Directory to save markdown files (default: "pages")
- `exclude_patterns`: Comma-separated list of URL patterns to exclude (e.g., "legal,about")

### LinkedIn Help Crawler

A preconfigured crawler for LinkedIn Help pages:

```bash
poetry run linkedin
```

This will:

- Start from https://www.linkedin.com/help/linkedin
- Save pages in `linkedin_help` directory
- Exclude legal, careers, and jobs pages
- Limit to 100 pages
- Maintain original URL structure (e.g., `help/linkedin/answer/123.md`)
