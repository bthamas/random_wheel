# Szerencsekerék - Wheel of Fortune

A modern, mobile-friendly wheel of fortune web application with statistics and beautiful animations.

## 🚀 Features

### Core Functionality
- **Interactive Wheel**: Beautiful spinning wheel with customizable items
- **Statistics Dashboard**: Comprehensive tracking of spins, wins, and trends
- **Multiple Themes**: 12 unique visual themes including 2 completely different layouts
- **Mobile Optimized**: Touch-friendly interface with shake-to-spin functionality
- **Responsive Design**: Works perfectly on all device sizes

### New Layout Themes (Completely Different Designs)
1. **Hexagonal Grid Theme**: Geometric hexagonal design with dark blue aesthetic
2. **Vertical Timeline Theme**: Vertical layout with timeline-style presentation

### Performance Improvements
- **DOM Caching**: Optimized DOM element access for better performance
- **Event Delegation**: Efficient event handling for theme selection
- **CSS Optimizations**: Hardware acceleration and reduced motion support
- **Error Handling**: Comprehensive error boundaries and fallbacks

### Accessibility & Readability
- **Improved Contrast**: Better text readability across all themes
- **Reduced Motion**: Respects user's motion preferences
- **Keyboard Navigation**: Full keyboard support (Space/Enter to spin)
- **Touch Gestures**: Swipe support for mobile devices

## 🎨 Available Themes

1. **Eredeti** - Classic purple design
2. **Minimalista** - Clean, minimalist white design
3. **3D Modern** - Modern 3D effects with blue gradients
4. **Neon Cyberpunk** - Futuristic neon aesthetic
5. **Nature Organic** - Natural green theme
6. **Sunset Warm** - Warm orange/red sunset colors
7. **Ocean Deep** - Deep blue ocean theme
8. **Royal Purple** - Elegant royal purple
9. **Retro Vintage** - Vintage retro aesthetic
10. **Space Galaxy** - Cosmic space theme with stars
11. **Candy Sweet** - Sweet pink candy theme
12. **Hexagonal Grid** - Geometric hexagonal layout (NEW!)
13. **Vertical Timeline** - Vertical timeline layout (NEW!)

## 🛠️ Technical Improvements

### Bug Fixes
- Fixed Python command compatibility (now uses `python3`)
- Improved error handling throughout the application
- Fixed theme readability issues
- Added fallback elements for missing DOM components

### Performance Enhancements
- DOM element caching for faster access
- Event delegation for theme selection
- CSS hardware acceleration
- Optimized animations with reduced motion support
- Better memory management

### Code Quality
- Comprehensive error handling
- Input validation and sanitization
- Performance monitoring and optimization
- Better separation of concerns

## 🚀 Getting Started

### Prerequisites
- Python 3.x
- Modern web browser

### Installation
1. Clone the repository:
```bash
git clone https://github.com/bthamas.dev/Random_wheel.git
cd Random_wheel
```

2. Start the development server:
```bash
npm start
# or
python3 -m http.server 8000
```

3. Open your browser and navigate to `http://localhost:8000`

## 📱 Mobile Features

- **Touch Gestures**: Swipe left/right to spin
- **Shake Detection**: Shake your device to spin the wheel
- **Responsive Design**: Optimized for all screen sizes
- **Touch Feedback**: Visual feedback for touch interactions

## 🎯 Usage

1. **Add Items**: Type item names and press Enter or click the add button
2. **Spin the Wheel**: Click the spin button, press Space/Enter, or shake your device
3. **View Statistics**: Click the statistics button to see detailed analytics
4. **Change Themes**: Click the settings button to choose from 12 different themes
5. **Customize**: Add, remove, or clear items as needed

## 🔧 Customization

### Adding New Themes
Themes are defined in `styles.css` and follow a consistent naming convention:
```css
.theme-your-theme-name {
    /* Your theme styles */
}
```

### Modifying Colors
Update the color palette in `script.js`:
```javascript
this.colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', /* ... */
];
```

## 📊 Statistics Features

- **Total Spins**: Track overall usage
- **Win Distribution**: See which items win most often
- **Time-based Analysis**: Monthly, weekly, and yearly statistics
- **Interactive Charts**: Pie charts and bar graphs
- **Detailed History**: Complete spin history with timestamps

## 🌟 Recent Updates

### Version 2.0 - Major Improvements
- ✅ Added 2 completely different layout themes
- ✅ Fixed all theme readability issues
- ✅ Improved performance with DOM caching
- ✅ Enhanced error handling and fallbacks
- ✅ Better mobile optimization
- ✅ Accessibility improvements
- ✅ Performance optimizations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Optimized for performance and accessibility
- Designed with user experience in mind

## 📞 Support

If you encounter any issues or have suggestions for improvements, please open an issue on GitHub.

---

**Made with ❤️ for better user experiences**
