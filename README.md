# ImEasy.ai Marketing Website

This is the marketing website for ImEasy.ai - The Easy Real Estate Platform.

## Viewing the Site

### Locally
Simply open `index.html` in your web browser.

### GitHub Pages
This site is configured to be hosted on GitHub Pages from the `/docs` directory.

To enable GitHub Pages:
1. Go to your repository settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select the branch you want to use (usually `main`)
4. Select `/docs` as the folder
5. Click "Save"

Your site will be available at: `https://[your-username].github.io/[repository-name]/`

## Structure

- `index.html` - Main marketing page
- `styles.css` - All styling with REI-inspired color palette
- `script.js` - Interactive features and animations
- `.nojekyll` - Ensures GitHub Pages processes the files correctly

## Customization

### Adding Images/Videos
Replace the placeholder divs with actual images or videos:

```html
<!-- Instead of: -->
<div class="placeholder-image">
    <span>Dashboard Preview</span>
</div>

<!-- Use: -->
<img src="path/to/image.png" alt="Dashboard Preview">
<!-- or -->
<video src="path/to/video.mp4" controls></video>
```

### Updating Colors
Edit the CSS variables in `styles.css`:

```css
:root {
    --color-primary: #2C5F2D;      /* Forest green */
    --color-accent: #E57A3C;        /* Warm terracotta */
    /* ... etc */
}
```

### Adding Content
Update the text, features, and sections directly in `index.html`.

## Features

- Responsive design for mobile, tablet, and desktop
- Smooth scrolling navigation
- Animated content reveals
- Basecamp-style feature showcasing
- REI-inspired simple, professional color palette
- Interactive hover effects
- Counter animations for statistics
- Placeholder sections for images and videos

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge
