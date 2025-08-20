# 🎡 Random Wheel

A modern, mobile-friendly wheel of fortune web application with statistics and beautiful animations.

![Random Wheel Demo](https://img.shields.io/badge/Status-Ready-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## ✨ Features

### 🎯 Core Functionality
- **Dynamic wheel** that can hold any number of items
- **Fair random spinning** with 0.5-1.5 second duration
- **Beautiful animations** with smooth transitions
- **Winner display** with blinking and jumping effects

### 📱 Mobile Support
- **Fully responsive design** that works on all devices
- **Touch controls**: Tap, swipe, and shake to spin
- **Mobile-optimized UI** with larger touch targets
- **Shake detection** for phone shaking to trigger spin

### 📊 Statistics Dashboard
- **Comprehensive tracking** of all spins and winners
- **Percentage calculations** for each item's win rate
- **Most/least frequent** winners tracking
- **Detailed analytics** with win counts and odds
- **Persistent storage** using localStorage

### 🎨 Visual Design
- **Modern gradient background** (purple to blue)
- **Vibrant wheel segments** with different colors
- **Color coordination** - item tags match wheel colors
- **Smooth animations** throughout the interface
- **Professional typography** using Poppins font

### 🎯 User Experience
- **Easy item addition**: Just type and press Enter
- **Multiple spin triggers**: Button, Space, Enter, swipe, shake
- **Visual feedback** for all interactions
- **Intuitive controls** that work on both desktop and mobile

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Random_wheel.git
   cd Random_wheel
   ```

2. **Open in browser**
   ```bash
   # Using Python (if available)
   python -m http.server 8000
   
   # Or simply open index.html in your browser
   ```

3. **Start using**
   - Add items by typing and pressing Enter
   - Spin the wheel using the button or keyboard shortcuts
   - View statistics by clicking the "Statisztikák" button

## 🎮 How to Use

### Adding Items
1. Type the item name in the input field
2. Press **Enter** or click the **+** button
3. Items appear as colored tags below

### Spinning the Wheel
- **Desktop**: Click "Pörgetés" button, press **Space** or **Enter**
- **Mobile**: 
  - Tap the "Pörgetés" button
  - Swipe left/right
  - Shake your phone

### Managing Items
- **Remove individual**: Click the **X** on any item tag
- **Remove all**: Click "Összes törlése" button
- **View count**: See how many items are in the list

### Statistics
- Click **"Statisztikák"** button in the top right
- View total spins, win percentages, and detailed analytics
- Data persists between sessions

## 🛠️ Technologies

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Tailwind CSS
- **JavaScript (ES6+)**: Vanilla JS with classes
- **SVG**: Precise wheel segments
- **LocalStorage**: Persistent statistics
- **Font Awesome**: Icons
- **Google Fonts**: Poppins typography

## 📱 Mobile Features

- **Touch Controls**: Tap, swipe, and shake gestures
- **Responsive Design**: Adapts to all screen sizes
- **Touch-Friendly**: Large buttons and touch targets
- **Device Motion**: Shake to spin functionality
- **Prevent Zoom**: Optimized for mobile viewing

## 🎨 Design Features

- **Color Coordination**: Item tags match wheel segment colors
- **Smooth Animations**: Professional spinning and winner effects
- **Modern UI**: Glassmorphism and gradient effects
- **Accessibility**: High contrast and readable text
- **Cross-Browser**: Works on all modern browsers

## 📊 Statistics Features

- **Real-time Tracking**: Every spin is recorded
- **Win Percentages**: Calculated automatically
- **Trend Analysis**: Most and least frequent winners
- **Persistent Data**: Saved in browser localStorage
- **Detailed Reports**: Comprehensive analytics dashboard

## 🔧 Development

### Project Structure
```
Random_wheel/
├── index.html          # Main HTML file
├── script.js           # JavaScript functionality
├── script.ts           # TypeScript version (for reference)
├── styles.css          # CSS styles (legacy)
├── README.md           # Project documentation
├── package.json        # Project metadata
├── LICENSE             # MIT License
├── .gitignore          # Git ignore rules
└── GITHUB_SETUP.md     # GitHub setup guide
```

### Running Locally
```bash
# Simple HTTP server
python -m http.server 8000

# Or use any local server
npx serve .
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tailwind CSS** for the beautiful styling framework
- **Font Awesome** for the icons
- **Google Fonts** for the Poppins typography
- **SVG** for precise wheel rendering

## 📞 Support

If you have any questions or issues, please:
1. Check the [Issues](https://github.com/yourusername/Random_wheel/issues) page
2. Create a new issue if your problem isn't already listed
3. Include details about your browser and device

---

**Made with ❤️ for fair and fun random selection!**

![Random Wheel](https://img.shields.io/badge/Random-Wheel-ff6b6b)
