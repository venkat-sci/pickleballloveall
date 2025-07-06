# Uploads Directory

This directory contains user-uploaded files such as profile pictures.

## Profile Pictures

- Location: `/profile-pictures/`
- Max size: 5MB
- Allowed formats: JPG, PNG, GIF, WebP
- Files are automatically named with timestamps to avoid conflicts

## Security Notes

- Files are served statically through the `/uploads` endpoint
- File type validation is performed on upload
- File size limits are enforced
- Directory traversal is prevented
