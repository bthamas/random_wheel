class WheelOfFortune {
    constructor() {
        this.items = [];
        this.isSpinning = false;
        this.statistics = {
            totalSpins: 0,
            itemStats: {},
            spinHistory: []
        };

        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
        ];

        this.init();
        this.loadStatistics();
    }

    init() {
        // Initialize DOM elements
        this.wheel = document.getElementById('wheel');
        this.itemInput = document.getElementById('itemInput');
        this.addBtn = document.getElementById('addBtn');
        this.itemsList = document.getElementById('itemsList');
        this.itemCount = document.getElementById('itemCount');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.spinBtn = document.getElementById('spinBtn');
        this.winnerDisplay = document.getElementById('winner');
        this.winnerText = document.getElementById('winnerText');
        this.statsBtn = document.getElementById('statsBtn');
        this.statsModal = document.getElementById('statsModal');
        this.closeStats = document.getElementById('closeStats');

        this.bindEvents();
        this.addSampleItems();
    }

    bindEvents() {
        // Add item events
        this.itemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addItem();
            }
        });

        this.addBtn.addEventListener('click', () => {
            this.addItem();
        });

        // Clear all button
        this.clearAllBtn.addEventListener('click', () => {
            this.clearAllItems();
        });

        // Spin events
        this.spinBtn.addEventListener('click', () => {
            this.spinWheel();
        });

        document.addEventListener('keydown', (e) => {
            // Only trigger spin if not typing in input field
            const activeElement = document.activeElement;
            const isTyping = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
            
            if ((e.key === ' ' || e.key === 'Enter') && !this.isSpinning && this.items.length > 0 && !isTyping) {
                e.preventDefault();
                this.spinWheel();
            }
        });

        // Winner display
        this.winnerDisplay.addEventListener('click', () => {
            this.hideWinner();
        });

        // Statistics modal
        this.statsBtn.addEventListener('click', () => {
            this.showStatistics();
        });

        this.closeStats.addEventListener('click', () => {
            this.hideStatistics();
        });

        this.statsModal.addEventListener('click', (e) => {
            if (e.target === this.statsModal) {
                this.hideStatistics();
            }
        });

        // Mobile shake detection
        this.initShakeDetection();
    }

    addSampleItems() {
        const sampleItems = ['Pizza', 'Hamburger', 'Sushi', 'Saláta', 'Pasta', 'Steak'];
        sampleItems.forEach(item => {
            this.items.push(item);
        });
        this.updateWheel();
        this.updateItemsList();
    }

    addItem() {
        const item = this.itemInput.value.trim();
        if (item && !this.items.includes(item)) {
            this.items.push(item);
            this.itemInput.value = '';
            this.updateWheel();
            this.updateItemsList();
            this.saveStatistics();
        }
    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            this.updateWheel();
            this.updateItemsList();
            this.saveStatistics();
        }
    }

    clearAllItems() {
        this.items = [];
        this.updateWheel();
        this.updateItemsList();
        this.saveStatistics();
    }

    updateWheel() {
        this.wheel.innerHTML = '';
        
        if (this.items.length === 0) {
            this.wheel.innerHTML = '<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-600 text-xl">Adj hozzá elemeket!</div>';
            return;
        }

        // Create SVG wheel
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 300 300');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';

        const centerX = 150;
        const centerY = 150;
        const radius = 140;
        const segmentAngle = 360 / this.items.length;

        this.items.forEach((item, index) => {
            const startAngle = (index * segmentAngle) - 90; // Start from top
            const endAngle = ((index + 1) * segmentAngle) - 90;
            const color = this.colors[index % this.colors.length];

            // Calculate path coordinates
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;

            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);

            const largeArcFlag = segmentAngle > 180 ? 1 : 0;

            // Create path for segment
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            path.setAttribute('d', pathData);
            path.setAttribute('fill', color);
            path.setAttribute('stroke', '#fff');
            path.setAttribute('stroke-width', '2');
            path.classList.add('wheel-segment');
            path.setAttribute('data-index', index.toString());

            svg.appendChild(path);

            // Add text
            const textAngle = startAngle + segmentAngle / 2;
            const textRadius = radius * 0.7;
            const textX = centerX + textRadius * Math.cos((textAngle * Math.PI) / 180);
            const textY = centerY + textRadius * Math.sin((textAngle * Math.PI) / 180);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', textX.toString());
            text.setAttribute('y', textY.toString());
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'central');
            text.setAttribute('fill', 'white');
            text.setAttribute('font-size', this.items.length > 8 ? '12' : '14');
            text.setAttribute('font-weight', '700');
            text.setAttribute('font-family', 'Poppins, sans-serif');
            text.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
            text.style.pointerEvents = 'none';
            
            // Rotate text for better readability
            let rotation = textAngle + 90;
            if (textAngle > 90 && textAngle < 270) {
                rotation = textAngle - 90;
            }
            text.setAttribute('transform', `rotate(${rotation} ${textX} ${textY})`);
            
            // Truncate long text
            let displayText = item;
            if (item.length > 10) {
                displayText = item.substring(0, 8) + '...';
            }
            text.textContent = displayText;

            svg.appendChild(text);
        });

        this.wheel.appendChild(svg);
    }

    updateItemsList() {
        this.itemsList.innerHTML = '';
        
        // Update item count
        this.itemCount.textContent = this.items.length.toString();
        
        // Update clear all button state
        this.clearAllBtn.disabled = this.items.length === 0;
        
        this.items.forEach((item, index) => {
            const itemTag = document.createElement('div');
            const color = this.colors[index % this.colors.length];
            
            // Convert hex color to RGB for better text contrast calculation
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            
            // Calculate luminance to determine if we need dark or light text
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            const textColor = luminance > 0.5 ? '#000000' : '#ffffff';
            
            itemTag.className = 'px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-slide-in shadow-lg font-semibold';
            itemTag.style.backgroundColor = color;
            itemTag.style.color = textColor;
            
            itemTag.innerHTML = `
                <span>${item}</span>
                <button class="bg-white/30 border-none w-5 h-5 rounded-full cursor-pointer flex items-center justify-center text-xs transition-all duration-300 hover:bg-white/50 hover:scale-110" onclick="wheelApp.removeItem('${item}')" style="color: ${textColor};">
                    <i class="fas fa-times"></i>
                </button>
            `;
            this.itemsList.appendChild(itemTag);
        });
    }

    spinWheel() {
        if (this.isSpinning || this.items.length === 0) return;

        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.spinBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Pörgetés...';

        // Random spin duration between 0.5-1.5 seconds (faster)
        const spinDuration = Math.random() * 1000 + 500;
        
        // FAIR APPROACH: Let the wheel spin randomly and determine winner from final position
        const segmentAngle = 360 / this.items.length;
        
        // Random final angle with multiple rotations (clockwise rotation)
        const baseRotations = 3 + Math.random() * 4; // 3-7 full rotations
        const finalAngle = (baseRotations * 360) + Math.random() * 360;
        
        // After the wheel stops, determine which segment is at the pointer (0 degrees)
        // The pointer is at 0 degrees (right side), so we need to find which segment
        // ends up at that position after the rotation
        
        // Since we rotate clockwise, the segment that was at (-finalAngle) degrees
        // will end up at 0 degrees (pointer position)
        // But our segments start at -90 degrees, so we need to adjust
        
        // Calculate which segment is at the pointer after rotation
        let pointerAngle = (-finalAngle) % 360;
        if (pointerAngle < 0) pointerAngle += 360;
        
        // Adjust for our segment starting position (-90 degrees)
        let adjustedAngle = pointerAngle + 90;
        if (adjustedAngle >= 360) adjustedAngle -= 360;
        
        // Find which segment this corresponds to
        const winningIndex = Math.floor(adjustedAngle / segmentAngle) % this.items.length;
        const winner = this.items[winningIndex];

        // Add real spinning animation with faster easing
        this.wheel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.1, 0.1, 0.25, 1)`;
        this.wheel.style.transform = `rotate(${finalAngle}deg)`;
        
        // Update statistics and show winner after animation completes
        setTimeout(() => {
            this.updateStatistics(winner);
            this.highlightWinningSegment(winner);
            
            // Show winner after a short delay
            setTimeout(() => {
                this.showWinner(winner);
                this.isSpinning = false;
                this.spinBtn.disabled = false;
                this.spinBtn.innerHTML = '<i class="fas fa-play"></i> Pörgetés';
            }, 500);
            
        }, spinDuration);
    }

    highlightWinningSegment(winner) {
        // Remove any previous highlights
        const allSegments = this.wheel.querySelectorAll('.wheel-segment');
        allSegments.forEach(segment => {
            segment.classList.remove('winning-segment');
            segment.style.filter = '';
        });
        
        // Find and highlight the winning segment
        const winnerIndex = this.items.indexOf(winner);
        if (winnerIndex >= 0) {
            const winningSegment = this.wheel.querySelector(`[data-index="${winnerIndex}"]`);
            if (winningSegment) {
                winningSegment.classList.add('winning-segment');
                winningSegment.style.filter = 'drop-shadow(0 0 15px rgba(255,255,255,0.8)) brightness(1.2)';
            }
        }
    }

    showWinner(winner) {
        this.winnerText.textContent = winner;
        this.winnerDisplay.classList.remove('hidden');
        
        // Add celebration animation
        document.body.classList.add('animate-shake');
        setTimeout(() => {
            document.body.classList.remove('animate-shake');
        }, 500);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            this.hideWinner();
        }, 3000);
    }

    hideWinner() {
        this.winnerDisplay.classList.add('hidden');
        
        // Remove highlight when hiding winner
        const allSegments = this.wheel.querySelectorAll('.wheel-segment');
        allSegments.forEach(segment => {
            segment.classList.remove('winning-segment');
            segment.style.filter = '';
        });
    }

    updateStatistics(winner) {
        this.statistics.totalSpins++;
        
        if (!this.statistics.itemStats[winner]) {
            this.statistics.itemStats[winner] = {
                wins: 0,
                percentage: 0
            };
        }
        
        this.statistics.itemStats[winner].wins++;
        
        // Update percentages
        Object.keys(this.statistics.itemStats).forEach(item => {
            this.statistics.itemStats[item].percentage = 
                parseFloat(((this.statistics.itemStats[item].wins / this.statistics.totalSpins) * 100).toFixed(1));
        });
        
        this.statistics.spinHistory.push({
            winner: winner,
            timestamp: new Date().toISOString(),
            totalItems: this.items.length
        });
        
        this.saveStatistics();
    }

    showStatistics() {
        this.updateStatisticsDisplay();
        this.statsModal.classList.remove('hidden');
    }

    hideStatistics() {
        this.statsModal.classList.add('hidden');
    }

    updateStatisticsDisplay() {
        // Update summary stats
        document.getElementById('totalSpins').textContent = this.statistics.totalSpins.toString();
        document.getElementById('uniqueItems').textContent = this.items.length.toString();
        
        // Find most and least frequent winners
        const sortedStats = Object.entries(this.statistics.itemStats)
            .sort((a, b) => b[1].wins - a[1].wins);
        
        if (sortedStats.length > 0) {
            document.getElementById('mostFrequent').textContent = `${sortedStats[0][0]} (${sortedStats[0][1].wins}x)`;
            document.getElementById('leastFrequent').textContent = `${sortedStats[sortedStats.length - 1][0]} (${sortedStats[sortedStats.length - 1][1].wins}x)`;
        }
        
        // Update detailed stats
        const detailedStats = document.getElementById('detailedStats');
        detailedStats.innerHTML = '';
        
        if (this.statistics.totalSpins === 0) {
            detailedStats.innerHTML = '<p class="text-center text-gray-600 py-5">Még nincs pörgetés!</p>';
            return;
        }
        
        sortedStats.forEach(([item, stats]) => {
            const statItem = document.createElement('div');
            statItem.className = 'bg-gray-50 p-5 rounded-xl border-l-4 border-purple-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-3';
            statItem.innerHTML = `
                <div class="flex-1 min-w-[200px]">
                    <div class="font-semibold text-gray-800 mb-1">${item}</div>
                    <div class="text-sm text-gray-600">
                        ${stats.wins} nyerés • ${stats.percentage}% esély
                    </div>
                </div>
                <div class="bg-purple-500 text-white px-4 py-2 rounded-full font-semibold text-sm self-end md:self-auto">
                    ${stats.percentage}%
                </div>
            `;
            detailedStats.appendChild(statItem);
        });
    }

    saveStatistics() {
        localStorage.setItem('wheelStatistics', JSON.stringify(this.statistics));
    }

    loadStatistics() {
        const saved = localStorage.getItem('wheelStatistics');
        if (saved) {
            this.statistics = JSON.parse(saved);
        }
    }

    initShakeDetection() {
        if ('DeviceMotionEvent' in window) {
            let lastUpdate = 0;
            let lastX = 0, lastY = 0, lastZ = 0;
            const threshold = 15;
            
            window.addEventListener('devicemotion', (event) => {
                const current = event.accelerationIncludingGravity;
                if (!current) return;
                
                const currentTime = new Date().getTime();
                if ((currentTime - lastUpdate) > 100) {
                    const diffTime = currentTime - lastUpdate;
                    lastUpdate = currentTime;
                    
                    const speed = Math.abs((current.x || 0) + (current.y || 0) + (current.z || 0) - lastX - lastY - lastZ) / diffTime * 10000;
                    
                    if (speed > threshold && !this.isSpinning && this.items.length > 0) {
                        this.spinWheel();
                    }
                    
                    lastX = current.x || 0;
                    lastY = current.y || 0;
                    lastZ = current.z || 0;
                }
            });
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.wheelApp = new WheelOfFortune();
});

// Add touch/swipe support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Detect swipe gesture
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        // Horizontal swipe detected
        if (window.wheelApp && !window.wheelApp.isSpinning && window.wheelApp.items.length > 0) {
            window.wheelApp.spinWheel();
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
});

// Add visual feedback for mobile interactions
document.addEventListener('touchstart', (e) => {
    if (e.target.classList.contains('bg-gradient-to-r')) {
        e.target.style.transform = 'scale(0.95)';
    }
});

document.addEventListener('touchend', (e) => {
    if (e.target.classList.contains('bg-gradient-to-r')) {
        e.target.style.transform = '';
    }
});

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);