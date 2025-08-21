class WheelOfFortune {
    constructor() {
        this.items = [];
        this.isSpinning = false;
        this.statistics = {
            totalSpins: 0,
            itemStats: {},
            spinHistory: []
        };

        // Optimized color palette with better contrast
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
        ];

        // Performance optimization: Cache DOM elements
        this.domElements = {};
        
        this.init();
        this.loadStatistics();
        this.loadTheme();
    }

    init() {
        // Initialize DOM elements with caching for better performance
        this.domElements = {
            wheel: document.getElementById('wheel'),
            itemInput: document.getElementById('itemInput'),
            itemInputMobile: document.getElementById('itemInputMobile'),
            addBtn: document.getElementById('addBtn'),
            addBtnMobile: document.getElementById('addBtnMobile'),
            itemsList: document.getElementById('itemsList'),
            itemsListMobile: document.getElementById('itemsListMobile'),
            itemCount: document.getElementById('itemCount'),
            itemCountMobile: document.getElementById('itemCountMobile'),
            clearAllBtn: document.getElementById('clearAllBtn'),
            clearAllBtnMobile: document.getElementById('clearAllBtnMobile'),
            spinBtn: document.getElementById('spinBtn'),
            spinBtnMobile: document.getElementById('spinBtnMobile'),
            winnerDisplay: document.getElementById('winner'),
            winnerText: document.getElementById('winnerText'),
            statsBtn: document.getElementById('statsBtn'),
            statsModal: document.getElementById('statsModal'),
            closeStats: document.getElementById('closeStats'),
            settingsBtn: document.getElementById('settingsBtn'),
            settingsModal: document.getElementById('settingsModal'),
            closeSettings: document.getElementById('closeSettings')
        };

        // Validate DOM elements exist
        this.validateDOMElements();
        
        this.bindEvents();
        this.addSampleItems();
    }

    validateDOMElements() {
        const missingElements = [];
        for (const [key, element] of Object.entries(this.domElements)) {
            if (!element) {
                missingElements.push(key);
            }
        }
        
        if (missingElements.length > 0) {
            console.error('Missing DOM elements:', missingElements);
            // Fallback: try to create basic functionality
            this.createFallbackElements();
        }
    }

    createFallbackElements() {
        // Create minimal fallback if critical elements are missing
        if (!this.domElements.wheel) {
            this.domElements.wheel = document.createElement('div');
            this.domElements.wheel.id = 'wheel';
            this.domElements.wheel.className = 'w-96 h-96 rounded-full bg-gray-200 flex items-center justify-center';
            document.body.appendChild(this.domElements.wheel);
        }
    }

    bindEvents() {
        // Performance optimization: Use event delegation where possible
        
        // Add item events (PC)
        if (this.domElements.itemInput) {
            this.domElements.itemInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addItem();
                }
            });
        }

        if (this.domElements.addBtn) {
            this.domElements.addBtn.addEventListener('click', () => {
                this.addItem();
            });
        }

        // Add item events (Mobile)
        if (this.domElements.itemInputMobile) {
            this.domElements.itemInputMobile.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addItemMobile();
                }
            });
        }

        if (this.domElements.addBtnMobile) {
            this.domElements.addBtnMobile.addEventListener('click', () => {
                this.addItemMobile();
            });
        }

        // Clear all button
        if (this.domElements.clearAllBtn) {
            this.domElements.clearAllBtn.addEventListener('click', () => {
                this.clearAllItems();
            });
        }

        // Mobile clear all button
        if (this.domElements.clearAllBtnMobile) {
            this.domElements.clearAllBtnMobile.addEventListener('click', () => {
                this.clearAllItems();
            });
        }

        // Spin events
        if (this.domElements.spinBtn) {
            this.domElements.spinBtn.addEventListener('click', () => {
                this.spinWheel();
            });
        }

        // Mobile spin events
        if (this.domElements.spinBtnMobile) {
            this.domElements.spinBtnMobile.addEventListener('click', () => {
                this.spinWheel();
            });
        }

        // Wheel click events
        if (this.domElements.wheel) {
            this.domElements.wheel.addEventListener('click', () => {
                if (!this.isSpinning && this.items.length > 0) {
                    this.spinWheel();
                }
            });
        }

        // Global keyboard events
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
        if (this.domElements.winnerDisplay) {
            this.domElements.winnerDisplay.addEventListener('click', () => {
                this.hideWinner();
            });
        }

        // Statistics modal
        if (this.domElements.statsBtn) {
            this.domElements.statsBtn.addEventListener('click', () => {
                this.showStatistics();
            });
        }

        if (this.domElements.closeStats) {
            this.domElements.closeStats.addEventListener('click', () => {
                this.hideStatistics();
            });
        }

        // Clear statistics button
        const clearStatsBtn = document.getElementById('clearStatsBtn');
        if (clearStatsBtn) {
            clearStatsBtn.addEventListener('click', () => {
                this.clearStatistics();
            });
        }

        // Settings events
        if (this.domElements.settingsBtn) {
            this.domElements.settingsBtn.addEventListener('click', () => {
                this.showSettings();
            });
        }

        if (this.domElements.closeSettings) {
            this.domElements.closeSettings.addEventListener('click', () => {
                this.hideSettings();
            });
        }

        if (this.domElements.settingsModal) {
            this.domElements.settingsModal.addEventListener('click', (e) => {
                if (e.target === this.domElements.settingsModal) {
                    this.hideSettings();
                }
            });
        }

        // Theme selection events with performance optimization
        this.bindThemeEvents();

        if (this.domElements.statsModal) {
            this.domElements.statsModal.addEventListener('click', (e) => {
                if (e.target === this.domElements.statsModal) {
                    this.hideStatistics();
                }
            });
        }

        // Mobile shake detection
        this.initShakeDetection();
    }

    bindThemeEvents() {
        // Performance optimization: Use event delegation for theme cards
        const settingsContent = this.domElements.settingsModal?.querySelector('.p-6');
        if (settingsContent) {
            settingsContent.addEventListener('click', (e) => {
                const themeCard = e.target.closest('.theme-card');
                if (themeCard) {
                    const theme = themeCard.getAttribute('data-theme');
                    if (theme) {
                        this.applyTheme(theme);
                    }
                }
            });
        }
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
        try {
            const item = this.domElements.itemInput?.value?.trim();
            if (item && !this.items.includes(item)) {
                this.items.push(item);
                this.domElements.itemInput.value = '';
                this.updateWheel();
                this.updateItemsList();
                this.saveStatistics();
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    }

    addItemMobile() {
        try {
            const item = this.domElements.itemInputMobile?.value?.trim();
            if (item && !this.items.includes(item)) {
                this.items.push(item);
                this.domElements.itemInputMobile.value = '';
                this.updateWheel();
                this.updateItemsList();
                this.saveStatistics();
            }
        } catch (error) {
            console.error('Error adding mobile item:', error);
        }
    }

    removeItem(item) {
        try {
            const index = this.items.indexOf(item);
            if (index > -1) {
                this.items.splice(index, 1);
                this.updateWheel();
                this.updateItemsList();
                this.saveStatistics();
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    }

    clearAllItems() {
        try {
            this.items = [];
            this.updateWheel();
            this.updateItemsList();
            this.saveStatistics();
        } catch (error) {
            console.error('Error clearing items:', error);
        }
    }

    updateWheel() {
        if (!this.domElements.wheel) return;
        
        this.domElements.wheel.innerHTML = '';
        
        if (this.items.length === 0) {
            this.domElements.wheel.innerHTML = '<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-600 text-xl">Adj hozzá elemeket!</div>';
            return;
        }

        // Performance optimization: Use DocumentFragment for better DOM manipulation
        const fragment = document.createDocumentFragment();
        
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

            // Add text with improved readability
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

        fragment.appendChild(svg);
        this.domElements.wheel.appendChild(fragment);
    }

    updateItemsList() {
        try {
            // Clear both lists
            if (this.domElements.itemsList) {
                this.domElements.itemsList.innerHTML = '';
            }
            if (this.domElements.itemsListMobile) {
                this.domElements.itemsListMobile.innerHTML = '';
            }
            
            // Update item counts
            if (this.domElements.itemCount) {
                this.domElements.itemCount.textContent = this.items.length.toString();
            }
            if (this.domElements.itemCountMobile) {
                this.domElements.itemCountMobile.textContent = this.items.length.toString();
            }
            
            // Update clear all button states
            if (this.domElements.clearAllBtn) {
                this.domElements.clearAllBtn.disabled = this.items.length === 0;
            }
            if (this.domElements.clearAllBtnMobile) {
                this.domElements.clearAllBtnMobile.disabled = this.items.length === 0;
            }
            
            this.items.forEach((item, index) => {
                const color = this.colors[index % this.colors.length];
                
                // Convert hex color to RGB for better text contrast calculation
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                
                // Calculate luminance to determine if we need dark or light text
                const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                const textColor = luminance > 0.5 ? '#000000' : '#ffffff';
                
                // Create PC version (vertical list)
                if (this.domElements.itemsList) {
                    const itemTagPC = document.createElement('div');
                    itemTagPC.className = 'px-4 py-2 rounded-full text-sm flex items-center justify-between animate-slide-in shadow-lg font-semibold';
                    itemTagPC.style.backgroundColor = color;
                    itemTagPC.style.color = textColor;
                    
                    itemTagPC.innerHTML = `
                        <span>${item}</span>
                        <button class="bg-white/30 border-none w-5 h-5 rounded-full cursor-pointer flex items-center justify-center text-xs transition-all duration-300 hover:bg-white/50 hover:scale-110" onclick="wheelApp.removeItem('${item}')" style="color: ${textColor};">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    this.domElements.itemsList.appendChild(itemTagPC);
                }
                
                // Create mobile version (horizontal wrap)
                if (this.domElements.itemsListMobile) {
                    const itemTagMobile = document.createElement('div');
                    itemTagMobile.className = 'px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-slide-in shadow-lg font-semibold';
                    itemTagMobile.style.backgroundColor = color;
                    itemTagMobile.style.color = textColor;
                    
                    itemTagMobile.innerHTML = `
                        <span>${item}</span>
                        <button class="bg-white/30 border-none w-5 h-5 rounded-full cursor-pointer flex items-center justify-center text-xs transition-all duration-300 hover:bg-white/50 hover:scale-110" onclick="wheelApp.removeItem('${item}')" style="color: ${textColor};">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    this.domElements.itemsListMobile.appendChild(itemTagMobile);
                }
            });
        } catch (error) {
            console.error('Error updating items list:', error);
        }
    }

    spinWheel() {
        if (this.isSpinning || this.items.length === 0 || !this.domElements.wheel) return;

        try {
            this.isSpinning = true;
            
            // Disable spin buttons
            if (this.domElements.spinBtn) {
                this.domElements.spinBtn.disabled = true;
                this.domElements.spinBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Pörgetés...';
            }
            if (this.domElements.spinBtnMobile) {
                this.domElements.spinBtnMobile.disabled = true;
                this.domElements.spinBtnMobile.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Pörgetés...';
            }

            // Performance optimization: Use requestAnimationFrame for smoother animation
            const spinDuration = Math.random() * 1000 + 500;
            
            // FAIR APPROACH: Let the wheel spin randomly and determine winner from final position
            const segmentAngle = 360 / this.items.length;
            
            // Random final angle with multiple rotations (clockwise rotation)
            const baseRotations = 3 + Math.random() * 4; // 3-7 full rotations
            const finalAngle = (baseRotations * 360) + Math.random() * 360;
            
            // Calculate winning segment
            let pointerAngle = (-finalAngle) % 360;
            if (pointerAngle < 0) pointerAngle += 360;
            
            let adjustedAngle = pointerAngle + 90;
            if (adjustedAngle >= 360) adjustedAngle -= 360;
            
            const winningIndex = Math.floor(adjustedAngle / segmentAngle) % this.items.length;
            const winner = this.items[winningIndex];

            // Use CSS transform for better performance
            this.domElements.wheel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.1, 0.1, 0.25, 1)`;
            this.domElements.wheel.style.transform = `rotate(${finalAngle}deg)`;
            
            // Update statistics and show winner after animation completes
            setTimeout(() => {
                this.updateStatistics(winner);
                this.highlightWinningSegment(winner);
                
                // Show winner after a short delay
                setTimeout(() => {
                    this.showWinner(winner);
                    this.isSpinning = false;
                    
                    // Re-enable spin buttons
                    if (this.domElements.spinBtn) {
                        this.domElements.spinBtn.disabled = false;
                        this.domElements.spinBtn.innerHTML = '<i class="fas fa-play"></i> Pörgetés';
                    }
                    if (this.domElements.spinBtnMobile) {
                        this.domElements.spinBtnMobile.disabled = false;
                        this.domElements.spinBtnMobile.innerHTML = '<i class="fas fa-play"></i> Pörgetés';
                    }
                }, 500);
                
            }, spinDuration);
        } catch (error) {
            console.error('Error spinning wheel:', error);
            this.isSpinning = false;
            // Re-enable buttons on error
            if (this.domElements.spinBtn) {
                this.domElements.spinBtn.disabled = false;
                this.domElements.spinBtn.innerHTML = '<i class="fas fa-play"></i> Pörgetés';
            }
            if (this.domElements.spinBtnMobile) {
                this.domElements.spinBtnMobile.disabled = false;
                this.domElements.spinBtnMobile.innerHTML = '<i class="fas fa-play"></i> Pörgetés';
            }
        }
    }

    highlightWinningSegment(winner) {
        try {
            // Remove any previous highlights
            const allSegments = this.domElements.wheel?.querySelectorAll('.wheel-segment');
            if (allSegments) {
                allSegments.forEach(segment => {
                    segment.classList.remove('winning-segment');
                    segment.style.filter = '';
                });
                
                // Find and highlight the winning segment
                const winnerIndex = this.items.indexOf(winner);
                if (winnerIndex >= 0) {
                    const winningSegment = this.domElements.wheel.querySelector(`[data-index="${winnerIndex}"]`);
                    if (winningSegment) {
                        winningSegment.classList.add('winning-segment');
                        winningSegment.style.filter = 'drop-shadow(0 0 15px rgba(255,255,255,0.8)) brightness(1.2)';
                    }
                }
            }
        } catch (error) {
            console.error('Error highlighting winning segment:', error);
        }
    }

    showWinner(winner) {
        try {
            if (this.domElements.winnerText) {
                this.domElements.winnerText.textContent = winner;
            }
            if (this.domElements.winnerDisplay) {
                this.domElements.winnerDisplay.classList.remove('hidden');
            }
            
            // Add celebration animation
            document.body.classList.add('animate-shake');
            setTimeout(() => {
                document.body.classList.remove('animate-shake');
            }, 500);
            
            // Auto hide after 3 seconds
            setTimeout(() => {
                this.hideWinner();
            }, 3000);
        } catch (error) {
            console.error('Error showing winner:', error);
        }
    }

    hideWinner() {
        try {
            if (this.domElements.winnerDisplay) {
                this.domElements.winnerDisplay.classList.add('hidden');
            }
            
            // Remove highlight when hiding winner
            const allSegments = this.domElements.wheel?.querySelectorAll('.wheel-segment');
            if (allSegments) {
                allSegments.forEach(segment => {
                    segment.classList.remove('winning-segment');
                    segment.style.filter = '';
                });
            }
        } catch (error) {
            console.error('Error hiding winner:', error);
        }
    }

    updateStatistics(winner) {
        try {
            this.statistics.totalSpins++;
            
            if (!this.statistics.itemStats[winner]) {
                this.statistics.itemStats[winner] = {
                    wins: 0,
                    percentage: 0,
                    lastWin: null,
                    winsThisMonth: 0,
                    winsThisWeek: 0,
                    winsThisYear: 0
                };
            }
            
            this.statistics.itemStats[winner].wins++;
            
            // Update last win date
            const now = new Date();
            this.statistics.itemStats[winner].lastWin = now.toISOString();
            
            // Update time-based statistics
            this.updateTimeBasedStats(winner, now);
            
            // Update percentages
            Object.keys(this.statistics.itemStats).forEach(item => {
                this.statistics.itemStats[item].percentage = 
                    parseFloat(((this.statistics.itemStats[item].wins / this.statistics.totalSpins) * 100).toFixed(1));
            });
            
            this.statistics.spinHistory.push({
                winner: winner,
                date: now.toISOString(),
                timestamp: now.getTime()
            });
            
            this.saveStatistics();
        } catch (error) {
            console.error('Error updating statistics:', error);
        }
    }

    updateTimeBasedStats(winner, date) {
        try {
            const currentYear = date.getFullYear();
            const currentMonth = date.getMonth();
            const currentWeek = this.getWeekNumber(date);
            
            // Reset time-based stats for all items
            Object.keys(this.statistics.itemStats).forEach(item => {
                if (!this.statistics.itemStats[item].winsThisMonth) this.statistics.itemStats[item].winsThisMonth = 0;
                if (!this.statistics.itemStats[item].winsThisWeek) this.statistics.itemStats[item].winsThisWeek = 0;
                if (!this.statistics.itemStats[item].winsThisYear) this.statistics.itemStats[item].winsThisYear = 0;
            });
            
            // Recalculate time-based stats
            this.statistics.spinHistory.forEach(spin => {
                const spinDate = new Date(spin.date);
                const spinYear = spinDate.getFullYear();
                const spinMonth = spinDate.getMonth();
                const spinWeek = this.getWeekNumber(spinDate);
                
                if (spin.winner === winner) {
                    if (spinYear === currentYear) {
                        this.statistics.itemStats[winner].winsThisYear++;
                        if (spinMonth === currentMonth) {
                            this.statistics.itemStats[winner].winsThisMonth++;
                            if (spinWeek === currentWeek) {
                                this.statistics.itemStats[winner].winsThisWeek++;
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error updating time-based stats:', error);
        }
    }

    getWeekNumber(date) {
        try {
            const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
            const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
            return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        } catch (error) {
            console.error('Error calculating week number:', error);
            return 1;
        }
    }

    showStatistics() {
        try {
            this.updateStatisticsDisplay();
            if (this.domElements.statsModal) {
                this.domElements.statsModal.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error showing statistics:', error);
        }
    }

    hideStatistics() {
        try {
            if (this.domElements.statsModal) {
                this.domElements.statsModal.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error hiding statistics:', error);
        }
    }

    clearStatistics() {
        try {
            if (confirm('Biztosan törölni szeretnéd az összes statisztikát? Ez a művelet nem vonható vissza!')) {
                // Reset statistics
                this.statistics = {
                    totalSpins: 0,
                    itemStats: {},
                    spinHistory: []
                };
                
                // Save to localStorage
                this.saveStatistics();
                
                // Update display
                this.updateStatisticsDisplay();
                
                // Show confirmation
                this.showClearConfirmation();
            }
        } catch (error) {
            console.error('Error clearing statistics:', error);
        }
    }

    showClearConfirmation() {
        try {
            // Create a temporary confirmation message
            const confirmation = document.createElement('div');
            confirmation.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce';
            confirmation.innerHTML = '<i class="fas fa-check mr-2"></i>Statisztikák törölve!';
            
            document.body.appendChild(confirmation);
            
            // Remove after 3 seconds
            setTimeout(() => {
                if (confirmation.parentNode) {
                    confirmation.remove();
                }
            }, 3000);
        } catch (error) {
            console.error('Error showing clear confirmation:', error);
        }
    }

    showSettings() {
        try {
            if (this.domElements.settingsModal) {
                this.domElements.settingsModal.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error showing settings:', error);
        }
    }

    hideSettings() {
        try {
            if (this.domElements.settingsModal) {
                this.domElements.settingsModal.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error hiding settings:', error);
        }
    }

    applyTheme(theme) {
        try {
            // Remove all existing theme classes
            document.body.className = '';
            
            // Apply new theme
            document.body.classList.add(`theme-${theme}`);
            
            // Save theme preference
            localStorage.setItem('selectedTheme', theme);
            
            // Hide settings modal
            this.hideSettings();
        } catch (error) {
            console.error('Error applying theme:', error);
        }
    }

    loadTheme() {
        try {
            const savedTheme = localStorage.getItem('selectedTheme');
            if (savedTheme) {
                this.applyTheme(savedTheme);
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    }

    updateStatisticsDisplay() {
        try {
            // Update summary stats
            const totalSpinsElement = document.getElementById('totalSpins');
            if (totalSpinsElement) {
                totalSpinsElement.textContent = this.statistics.totalSpins.toString();
            }
            
            const uniqueItemsElement = document.getElementById('uniqueItems');
            if (uniqueItemsElement) {
                uniqueItemsElement.textContent = this.items.length.toString();
            }
            
            // Find most and least frequent winners
            const sortedStats = Object.entries(this.statistics.itemStats)
                .sort((a, b) => b[1].wins - a[1].wins);
            
            if (sortedStats.length > 0) {
                const mostFrequentElement = document.getElementById('mostFrequent');
                if (mostFrequentElement) {
                    mostFrequentElement.textContent = sortedStats[0][0];
                }
                
                // Calculate average chance
                const averageChanceElement = document.getElementById('averageChance');
                if (averageChanceElement) {
                    const averageChance = this.items.length > 0 ? (100 / this.items.length).toFixed(1) : 0;
                    averageChanceElement.textContent = `${averageChance}%`;
                }
            } else {
                const averageChanceElement = document.getElementById('averageChance');
                if (averageChanceElement) {
                    averageChanceElement.textContent = '0%';
                }
            }
            
            // Update detailed stats table
            this.updateDetailedStatsTable(sortedStats);
            
            // Create charts
            this.createCharts();
        } catch (error) {
            console.error('Error updating statistics display:', error);
        }
    }

    updateDetailedStatsTable(sortedStats) {
        try {
            const detailedStatsTable = document.getElementById('detailedStatsTable');
            if (!detailedStatsTable) return;
            
            detailedStatsTable.innerHTML = '';
            
            if (this.statistics.totalSpins === 0) {
                detailedStatsTable.innerHTML = '<tr><td colspan="5" class="text-center text-gray-600 py-8">Még nincs pörgetés!</td></tr>';
            } else {
                sortedStats.forEach(([item, stats]) => {
                    // Format last win date
                    let lastWinText = 'Még nem nyert';
                    let lastWinColor = 'text-gray-500';
                    
                    if (stats.lastWin) {
                        const lastWinDate = new Date(stats.lastWin);
                        const now = new Date();
                        
                        // Set both dates to midnight for accurate day comparison
                        const lastWinDateOnly = new Date(lastWinDate.getFullYear(), lastWinDate.getMonth(), lastWinDate.getDate());
                        const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        
                        const diffTime = nowDateOnly - lastWinDateOnly;
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        
                        // Always show the exact date and time
                        const dateStr = lastWinDate.toLocaleDateString('hu-HU', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        });
                        const timeStr = lastWinDate.toLocaleTimeString('hu-HU', {
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                        
                        if (diffDays === 0) {
                            lastWinText = `Ma ${timeStr}`;
                            lastWinColor = 'text-red-600 font-bold';
                        } else if (diffDays === 1) {
                            lastWinText = `Tegnap ${timeStr}`;
                            lastWinColor = 'text-orange-600 font-semibold';
                        } else if (diffDays <= 7) {
                            lastWinText = `${dateStr} ${timeStr}`;
                            lastWinColor = 'text-yellow-600';
                        } else {
                            lastWinText = `${dateStr} ${timeStr}`;
                            lastWinColor = 'text-green-600';
                        }
                    }

                    const row = document.createElement('tr');
                    row.className = 'border-b border-gray-100 hover:bg-gray-50';
                    row.innerHTML = `
                        <td class="py-4 px-4">
                            <div class="flex items-center gap-3">
                                <div class="w-4 h-4 rounded-full" style="background-color: ${this.colors[this.items.indexOf(item) % this.colors.length]}"></div>
                                <span class="font-medium">${item}</span>
                            </div>
                        </td>
                        <td class="py-4 px-4 text-center font-semibold">${stats.wins}</td>
                        <td class="py-4 px-4 text-center">
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${stats.winsThisMonth > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}">
                                ${stats.winsThisMonth || 0}
                            </span>
                        </td>
                        <td class="py-4 px-4 text-center">
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${stats.winsThisWeek > 0 ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}">
                                ${stats.winsThisWeek || 0}
                            </span>
                        </td>
                        <td class="py-4 px-4 text-center ${lastWinColor} font-medium">${lastWinText}</td>
                    `;
                    detailedStatsTable.appendChild(row);
                });
            }
        } catch (error) {
            console.error('Error updating detailed stats table:', error);
        }
    }

    createCharts() {
        try {
            // Destroy existing charts
            if (this.pieChart) this.pieChart.destroy();
            if (this.barChart) this.barChart.destroy();

            const sortedStats = Object.entries(this.statistics.itemStats)
                .sort((a, b) => b[1].wins - a[1].wins);

            if (sortedStats.length === 0) return;

            // Pie Chart - Win Distribution
            const pieCtx = document.getElementById('pieChart')?.getContext('2d');
            if (pieCtx) {
                this.pieChart = new Chart(pieCtx, {
                    type: 'doughnut',
                    data: {
                        labels: sortedStats.map(([item]) => item),
                        datasets: [{
                            data: sortedStats.map(([, stats]) => stats.wins),
                            backgroundColor: sortedStats.map(([item]) => 
                                this.colors[this.items.indexOf(item) % this.colors.length]
                            ),
                            borderWidth: 3,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: { usePointStyle: true, padding: 20 }
                            }
                        }
                    }
                });
            }

            // Bar Chart - Win Counts
            const barCtx = document.getElementById('barChart')?.getContext('2d');
            if (barCtx) {
                this.barChart = new Chart(barCtx, {
                    type: 'bar',
                    data: {
                        labels: sortedStats.map(([item]) => item),
                        datasets: [{
                            label: 'Nyerések száma',
                            data: sortedStats.map(([, stats]) => stats.wins),
                            backgroundColor: sortedStats.map(([item]) => 
                                this.colors[this.items.indexOf(item) % this.colors.length] + '80'
                            ),
                            borderColor: sortedStats.map(([item]) => 
                                this.colors[this.items.indexOf(item) % this.colors.length]
                            ),
                            borderWidth: 2,
                            borderRadius: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: { stepSize: 1 }
                            }
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error creating charts:', error);
        }
    }

    saveStatistics() {
        try {
            localStorage.setItem('wheelStatistics', JSON.stringify(this.statistics));
        } catch (error) {
            console.error('Error saving statistics:', error);
        }
    }

    loadStatistics() {
        try {
            const saved = localStorage.getItem('wheelStatistics');
            if (saved) {
                this.statistics = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading statistics:', error);
            // Reset to default if corrupted
            this.statistics = {
                totalSpins: 0,
                itemStats: {},
                spinHistory: []
            };
        }
    }

    initShakeDetection() {
        try {
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
        } catch (error) {
            console.error('Error initializing shake detection:', error);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.wheelApp = new WheelOfFortune();
    } catch (error) {
        console.error('Error initializing Wheel of Fortune app:', error);
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed inset-0 bg-red-600 text-white flex items-center justify-center z-50';
        errorDiv.innerHTML = '<div class="text-center"><h1 class="text-2xl font-bold mb-4">Hiba történt</h1><p>Az alkalmazás betöltése során hiba történt. Kérjük, frissítsd az oldalt.</p></div>';
        document.body.appendChild(errorDiv);
    }
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

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.wheelApp && window.wheelApp.domElements.wheel) {
            window.wheelApp.updateWheel();
        }
    }, 250);
});

// Error boundary for unhandled errors
window.addEventListener('error', (event) => {
    console.error('Unhandled error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});