# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.102] - 2025-10-20

### Fixed
- All CSV files now uniformly encoded in UTF-8 for consistent French character display
- Fixed encoding issues across opp_id.csv and opp_cat.csv
- NotFound page now uses design system tokens instead of hardcoded colors
- NotFound page text now in French

### Changed
- CSV parser simplified to use UTF-8 encoding only
- Category "Partage" renamed to "Internet" with Wifi icon
- Category "Récompenses" icon changed to DollarSign
- All application text consistently in French

## [0.1.101] - 2025-10-19

### Added
- Cache-busting system for CSV files to ensure real-time updates across all pages
- Force fresh fetch with `no-store` cache policy and anti-cache headers
- Timestamp-based query parameters to bypass browser cache

### Fixed
- French character encoding issues (é, è, à, etc.)
- CSV header normalization to handle encoding variations
- Browser caching preventing CSV updates from appearing immediately on the live site
