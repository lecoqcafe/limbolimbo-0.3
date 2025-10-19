# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.101] - 2025-10-19

### Added
- Cache-busting system for CSV files to ensure real-time updates across all pages
- Force fresh fetch with `no-store` cache policy and anti-cache headers
- Timestamp-based query parameters to bypass browser cache

### Fixed
- French character encoding issues (é, è, à, etc.) by implementing Windows-1252 decoder
- CSV header normalization to handle encoding variations
- Browser caching preventing CSV updates from appearing immediately on the live site

### Changed
- CSV parser now uses `windows-1252` encoding instead of `utf-8`
- Enhanced fetch requests with explicit cache control headers
- Improved CSV parsing reliability for special characters

### Technical Details
- All CSV files now include `?t=${Date.now()}` parameter for cache invalidation
- Fetch requests configured with `Cache-Control: no-cache, no-store, must-revalidate`
- Added `Pragma: no-cache` header for legacy browser support
- Character encoding automatically handles French accents and special characters
