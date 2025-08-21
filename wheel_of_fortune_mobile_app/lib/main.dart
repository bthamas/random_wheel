import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vibration/vibration.dart';
import 'package:sensors_plus/sensors_plus.dart';
import 'package:fl_chart/fl_chart.dart';
import 'dart:math';
import 'dart:async';
import 'package:intl/intl.dart';

void main() {
  runApp(const WheelOfFortuneApp());
}

class WheelOfFortuneApp extends StatelessWidget {
  const WheelOfFortuneApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Szerencsekerék',
      theme: ThemeData(
        primarySwatch: Colors.purple,
        fontFamily: 'Poppins',
        useMaterial3: true,
      ),
      home: const WheelOfFortuneScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class WheelOfFortuneScreen extends StatefulWidget {
  const WheelOfFortuneScreen({super.key});

  @override
  State<WheelOfFortuneScreen> createState() => _WheelOfFortuneScreenState();
}

class _WheelOfFortuneScreenState extends State<WheelOfFortuneScreen>
    with TickerProviderStateMixin {
  final List<String> items = [];
  final TextEditingController itemController = TextEditingController();
  final List<Color> wheelColors = [
    Colors.red,
    Colors.teal,
    Colors.blue,
    Colors.lightGreen,
    Colors.amber,
    Colors.purple,
    Colors.orange,
    Colors.pink,
    Colors.indigo,
    Colors.cyan,
  ];

  bool isSpinning = false;
  double wheelRotation = 0.0;
  String? winner;
  late AnimationController spinController;
  late AnimationController winnerController;
  late Animation<double> spinAnimation;
  late Animation<double> winnerAnimation;

  // Statistics
  Map<String, dynamic> statistics = {
    'totalSpins': 0,
    'itemStats': <String, dynamic>{},
    'spinHistory': <Map<String, dynamic>>[],
  };

  // Theme
  String currentTheme = 'eredeti';
  final Map<String, Map<String, Color>> themes = {
    'eredeti': {
      'primary': Colors.purple,
      'secondary': Colors.deepPurple,
      'accent': Colors.orange,
    },
    'minimalista': {
      'primary': Colors.grey,
      'secondary': Colors.grey.shade300,
      'accent': Colors.grey.shade600,
    },
    'neon': {
      'primary': Colors.cyan,
      'secondary': Colors.pink,
      'accent': Colors.cyan,
    },
  };

  // Shake detection
  StreamSubscription<AccelerometerEvent>? _accelerometerSubscription;
  double _lastAcceleration = 0.0;
  static const double _shakeThreshold = 15.0;

  @override
  void initState() {
    super.initState();
    _loadData();
    _setupAnimations();
    _setupShakeDetection();
  }

  void _setupAnimations() {
    spinController = AnimationController(
      duration: const Duration(milliseconds: 3000),
      vsync: this,
    );

    winnerController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );

    spinAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: spinController,
      curve: Curves.easeOutCubic,
    ));

    winnerAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: winnerController,
      curve: Curves.elasticOut,
    ));
  }

  void _setupShakeDetection() {
    _accelerometerSubscription = accelerometerEvents.listen((AccelerometerEvent event) {
      double acceleration = sqrt(event.x * event.x + event.y * event.y + event.z * event.z);
      double delta = acceleration - _lastAcceleration;
      _lastAcceleration = acceleration;

      if (delta > _shakeThreshold && !isSpinning && items.isNotEmpty) {
        _spinWheel();
      }
    });
  }

  Future<void> _loadData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      items.addAll(prefs.getStringList('items') ?? []);
      currentTheme = prefs.getString('theme') ?? 'eredeti';
      statistics = {
        'totalSpins': prefs.getInt('totalSpins') ?? 0,
        'itemStats': Map<String, dynamic>.from(
          prefs.getStringList('itemStats')?.map((e) => MapEntry(e.split(':')[0], {
            'wins': int.parse(e.split(':')[1]),
            'lastWin': prefs.getString('lastWin_${e.split(':')[0]}'),
          })) ?? {},
        ),
        'spinHistory': [],
      };
    });
  }

  Future<void> _saveData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('items', items);
    await prefs.setString('theme', currentTheme);
    await prefs.setInt('totalSpins', statistics['totalSpins']);
    
    // Save item stats
    List<String> itemStatsList = [];
    for (var entry in statistics['itemStats'].entries) {
      itemStatsList.add('${entry.key}:${entry.value['wins']}');
      if (entry.value['lastWin'] != null) {
        await prefs.setString('lastWin_${entry.key}', entry.value['lastWin']);
      }
    }
    await prefs.setStringList('itemStats', itemStatsList);
  }

  void _addItem() {
    if (itemController.text.trim().isNotEmpty) {
      setState(() {
        items.add(itemController.text.trim());
        itemController.clear();
      });
      _saveData();
    }
  }

  void _removeItem(String item) {
    setState(() {
      items.remove(item);
    });
    _saveData();
  }

  void _clearAllItems() {
    setState(() {
      items.clear();
    });
    _saveData();
  }

  void _spinWheel() {
    if (items.isEmpty || isSpinning) return;

    setState(() {
      isSpinning = true;
    });

    // Random spin duration and rotations
    final random = Random();
    final spinDuration = 1000 + random.nextInt(2000); // 1-3 seconds
    final rotations = 3 + random.nextInt(5); // 3-7 full rotations
    final finalAngle = random.nextDouble() * 360; // Random final position

    spinController.duration = Duration(milliseconds: spinDuration);
    spinAnimation = Tween<double>(
      begin: wheelRotation,
      end: wheelRotation + (rotations * 360) + finalAngle,
    ).animate(CurvedAnimation(
      parent: spinController,
      curve: Curves.easeOutCubic,
    ));

    spinController.forward().then((_) {
      _determineWinner(finalAngle);
    });

    // Vibration feedback
    Vibration.vibrate(duration: 100);
  }

  void _determineWinner(double finalAngle) {
    if (items.isEmpty) return;

    final segmentAngle = 360 / items.length;
    final normalizedAngle = (360 - finalAngle) % 360; // Normalize to clockwise
    final winningIndex = (normalizedAngle / segmentAngle).floor() % items.length;
    final winningItem = items[winningIndex];

    setState(() {
      winner = winningItem;
      isSpinning = false;
      wheelRotation = spinAnimation.value;
    });

    _updateStatistics(winningItem);
    _showWinnerDialog();
  }

  void _updateStatistics(String winningItem) {
    setState(() {
      statistics['totalSpins']++;
      
      if (!statistics['itemStats'].containsKey(winningItem)) {
        statistics['itemStats'][winningItem] = {
          'wins': 0,
          'lastWin': null,
        };
      }
      
      statistics['itemStats'][winningItem]['wins']++;
      statistics['itemStats'][winningItem]['lastWin'] = DateTime.now().toIso8601String();
      
      statistics['spinHistory'].add({
        'item': winningItem,
        'timestamp': DateTime.now().toIso8601String(),
      });
    });
    
    _saveData();
  }

  void _showWinnerDialog() {
    winnerController.forward();
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AnimatedBuilder(
        animation: winnerAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: winnerAnimation.value,
            child: AlertDialog(
              backgroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              title: const Text(
                '🎉 Nyertes! 🎉',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.red,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              content: Text(
                winner!,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                ),
              ),
              actions: [
                Center(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                      winnerController.reverse();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.purple,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(25),
                      ),
                    ),
                    child: const Text('OK'),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  void _showStatistics() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.9,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (context, scrollController) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.purple,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Statisztikák',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.close, color: Colors.white),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: ListView(
                  controller: scrollController,
                  padding: const EdgeInsets.all(20),
                  children: [
                    // Summary cards
                    Row(
                      children: [
                        Expanded(
                          child: _buildStatCard(
                            'Összes pörgetés',
                            statistics['totalSpins'].toString(),
                            Icons.rotate_right,
                            Colors.blue,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: _buildStatCard(
                            'Elemek',
                            items.length.toString(),
                            Icons.list,
                            Colors.green,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    
                    // Pie chart
                    if (statistics['totalSpins'] > 0) ...[
                      const Text(
                        'Nyerési arányok',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 10),
                      SizedBox(
                        height: 200,
                        child: PieChart(
                          PieChartData(
                            sections: _buildPieChartSections(),
                            centerSpaceRadius: 40,
                            sectionsSpace: 2,
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],
                    
                    // Detailed stats
                    const Text(
                      'Részletes statisztikák',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    ..._buildDetailedStats(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 30),
          const SizedBox(height: 10),
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              color: color.withOpacity(0.8),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  List<PieChartSectionData> _buildPieChartSections() {
    if (statistics['totalSpins'] == 0) return [];
    
    final sections = <PieChartSectionData>[];
    final sortedStats = statistics['itemStats'].entries.toList()
      ..sort((a, b) => b.value['wins'].compareTo(a.value['wins']));
    
    for (int i = 0; i < sortedStats.length && i < wheelColors.length; i++) {
      final item = sortedStats[i];
      final percentage = (item.value['wins'] / statistics['totalSpins'] * 100).round();
      
      sections.add(PieChartSectionData(
        color: wheelColors[i],
        value: item.value['wins'].toDouble(),
        title: '$percentage%',
        radius: 60,
        titleStyle: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ));
    }
    
    return sections;
  }

  List<Widget> _buildDetailedStats() {
    if (statistics['totalSpins'] == 0) {
      return [
        const Center(
          child: Padding(
            padding: EdgeInsets.all(20),
            child: Text(
              'Még nincs pörgetés!',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),
          ),
        ),
      ];
    }

    final sortedStats = statistics['itemStats'].entries.toList()
      ..sort((a, b) => b.value['wins'].compareTo(a.value['wins']));

    return sortedStats.map((entry) {
      final item = entry.key;
      final stats = entry.value;
      final lastWin = stats['lastWin'] != null 
          ? DateTime.parse(stats['lastWin'])
          : null;
      
      String lastWinText = 'Még nem nyert';
      Color lastWinColor = Colors.grey;
      
      if (lastWin != null) {
        final now = DateTime.now();
        final diff = now.difference(lastWin).inDays;
        
        if (diff == 0) {
          lastWinText = 'Ma ${DateFormat('HH:mm').format(lastWin)}';
          lastWinColor = Colors.red;
        } else if (diff == 1) {
          lastWinText = 'Tegnap ${DateFormat('HH:mm').format(lastWin)}';
          lastWinColor = Colors.orange;
        } else if (diff <= 7) {
          lastWinText = '$diff napja';
          lastWinColor = Colors.blue;
        } else {
          lastWinText = DateFormat('yyyy.MM.dd').format(lastWin);
          lastWinColor = Colors.grey;
        }
      }

      return Card(
        margin: const EdgeInsets.only(bottom: 10),
        child: ListTile(
          title: Text(
            item,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          subtitle: Text('Utolsó nyerés: $lastWinText'),
          trailing: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                '${stats['wins']}',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                'nyerés',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
          leading: CircleAvatar(
            backgroundColor: wheelColors[items.indexOf(item) % wheelColors.length],
            child: Text(
              item[0].toUpperCase(),
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
      );
    }).toList();
  }

  void _showSettings() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.purple,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Beállítások',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, color: Colors.white),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: themes.entries.map((theme) {
                  final isSelected = currentTheme == theme.key;
                  return ListTile(
                    leading: CircleAvatar(
                      backgroundColor: theme.value['primary'],
                      child: Icon(
                        Icons.palette,
                        color: Colors.white,
                      ),
                    ),
                    title: Text(
                      theme.key == 'eredeti' ? 'Eredeti' :
                      theme.key == 'minimalista' ? 'Minimalista' :
                      'Neon',
                      style: TextStyle(
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                      ),
                    ),
                    trailing: isSelected ? const Icon(Icons.check, color: Colors.green) : null,
                    onTap: () {
                      setState(() {
                        currentTheme = theme.key;
                      });
                      _saveData();
                      Navigator.pop(context);
                    },
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = themes[currentTheme]!;
    
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              theme['primary']!,
              theme['secondary']!,
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Szerencsekerék',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Row(
                      children: [
                        IconButton(
                          onPressed: _showStatistics,
                          icon: const Icon(Icons.bar_chart, color: Colors.white),
                        ),
                        IconButton(
                          onPressed: _showSettings,
                          icon: const Icon(Icons.settings, color: Colors.white),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              
              // Wheel
              Expanded(
                child: Center(
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Wheel
                      AnimatedBuilder(
                        animation: spinAnimation,
                        builder: (context, child) {
                          return Transform.rotate(
                            angle: spinAnimation.value * pi / 180,
                            child: Container(
                              width: 300,
                              height: 300,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.white, width: 8),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.3),
                                    blurRadius: 20,
                                    offset: const Offset(0, 10),
                                  ),
                                ],
                              ),
                              child: CustomPaint(
                                painter: WheelPainter(
                                  items: items,
                                  colors: wheelColors,
                                  winner: winner,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                      
                      // Pointer
                      Positioned(
                        right: -20,
                        child: Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: Colors.red,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.3),
                                blurRadius: 10,
                                offset: const Offset(0, 5),
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.arrow_forward,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              
              // Controls
              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    // Spin button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: isSpinning ? null : _spinWheel,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: theme['accent'],
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(25),
                          ),
                          elevation: 5,
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(isSpinning ? Icons.hourglass_empty : Icons.play_arrow),
                            const SizedBox(width: 10),
                            Text(
                              isSpinning ? 'Pörgetés...' : 'Pörgetés',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 10),
                    Text(
                      'Vagy rázd meg a telefont!',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.8),
                        fontSize: 14,
                      ),
                    ),
                    
                    const SizedBox(height: 20),
                    
                    // Add item section
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.95),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 10,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: itemController,
                                  decoration: InputDecoration(
                                    hintText: 'Írd be az elemet...',
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(25),
                                    ),
                                    contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 20,
                                      vertical: 15,
                                    ),
                                  ),
                                  onSubmitted: (_) => _addItem(),
                                ),
                              ),
                              const SizedBox(width: 10),
                              ElevatedButton(
                                onPressed: _addItem,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: theme['primary'],
                                  foregroundColor: Colors.white,
                                  shape: const CircleBorder(),
                                  padding: const EdgeInsets.all(15),
                                ),
                                child: const Icon(Icons.add),
                              ),
                            ],
                          ),
                          
                          const SizedBox(height: 15),
                          
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Elemek: ${items.length}',
                                style: TextStyle(
                                  color: Colors.grey[600],
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              if (items.isNotEmpty)
                                TextButton(
                                  onPressed: _clearAllItems,
                                  style: TextButton.styleFrom(
                                    foregroundColor: Colors.red,
                                  ),
                                  child: const Text('Összes törlése'),
                                ),
                            ],
                          ),
                          
                          if (items.isNotEmpty) ...[
                            const SizedBox(height: 15),
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: items.map((item) {
                                final color = wheelColors[items.indexOf(item) % wheelColors.length];
                                return Chip(
                                  label: Text(
                                    item,
                                    style: const TextStyle(color: Colors.white),
                                  ),
                                  backgroundColor: color,
                                  deleteIcon: const Icon(Icons.close, color: Colors.white, size: 18),
                                  onDeleted: () => _removeItem(item),
                                );
                              }).toList(),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    spinController.dispose();
    winnerController.dispose();
    _accelerometerSubscription?.cancel();
    super.dispose();
  }
}

class WheelPainter extends CustomPainter {
  final List<String> items;
  final List<Color> colors;
  final String? winner;

  WheelPainter({
    required this.items,
    required this.colors,
    this.winner,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (items.isEmpty) return;

    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;
    final segmentAngle = 2 * pi / items.length;

    for (int i = 0; i < items.length; i++) {
      final startAngle = i * segmentAngle;
      final endAngle = (i + 1) * segmentAngle;
      final color = colors[i % colors.length];

      // Draw segment
      final paint = Paint()
        ..color = winner == items[i] ? color.withOpacity(0.8) : color
        ..style = PaintingStyle.fill;

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle,
        segmentAngle,
        true,
        paint,
      );

      // Draw text
      final textPainter = TextPainter(
        text: TextSpan(
          text: items[i],
          style: const TextStyle(
            color: Colors.white,
            fontSize: 14,
            fontWeight: FontWeight.bold,
          ),
        ),
        textDirection: TextDirection.ltr,
      );
      textPainter.layout();

      final textAngle = startAngle + segmentAngle / 2;
      final textRadius = radius * 0.7;
      final textX = center.dx + textRadius * cos(textAngle) - textPainter.width / 2;
      final textY = center.dy + textRadius * sin(textAngle) - textPainter.height / 2;

      canvas.save();
      canvas.translate(textX + textPainter.width / 2, textY + textPainter.height / 2);
      canvas.rotate(textAngle + pi / 2);
      textPainter.paint(canvas, Offset(-textPainter.width / 2, -textPainter.height / 2));
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
