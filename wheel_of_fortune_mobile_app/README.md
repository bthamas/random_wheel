# 🎯 Szerencsekerék Mobil Alkalmazás

Egy teljes funkcionalitású szerencsekerék mobil alkalmazás Flutter-rel készítve, amely minden app store-ba feltehető.

## ✨ Funkciók

### 🎡 **Szerencsekerék**
- **Dinamikus kerék** - tetszőleges számú elemmel
- **Valós pörgetés animáció** - 1-3 másodperc között
- **Pontos nyertes kiszámítás** - a nyíl által mutatott elem nyer
- **Nyertes kiemelés** - a nyertes szegmens külön kiemelve

### 📱 **Mobil Interakciók**
- **Telefon rázása** - pörgetés indítása
- **Vibráció visszajelzés** - pörgetés közben
- **Érintés kezelés** - kerékre koppintás
- **Billentyűzet támogatás** - Enter gomb

### 📊 **Statisztikák**
- **Összes pörgetés** számláló
- **Nyerési arányok** - kördiagram
- **Részletes statisztikák** - minden elemhez
- **Utolsó nyerés** - dátum és idő
- **Színkódolt dátumok** - Ma, Tegnap, X napja

### 🎨 **Témák**
- **Eredeti** - Klasszikus lila
- **Minimalista** - Tiszta, egyszerű
- **Neon** - Futurisztikus

### 💾 **Adatmentés**
- **Helyi tárolás** - SharedPreferences
- **Automatikus mentés** - minden változtatásnál
- **Adatok megmaradnak** - alkalmazás újraindítás után

## 🚀 Telepítés és Futtatás

### Előfeltételek
- Flutter SDK (3.2.3+)
- Android Studio / Xcode
- Fizikai eszköz vagy emulátor

### Lépések
```bash
# Függőségek telepítése
flutter pub get

# Android alkalmazás futtatása
flutter run

# iOS alkalmazás futtatása (csak macOS-en)
flutter run -d ios
```

## 📦 App Store Közzététel

### Android (Google Play Store)
```bash
# Release build
flutter build apk --release

# App Bundle (ajánlott)
flutter build appbundle --release
```

### iOS (App Store)
```bash
# Release build
flutter build ios --release

# Xcode-ban archive és upload
```

## 🛠️ Technikai Részletek

### Függőségek
- **shared_preferences** - Adatmentés
- **vibration** - Vibráció kezelés
- **sensors_plus** - Telefon rázás észlelése
- **fl_chart** - Statisztikai grafikonok
- **intl** - Dátum formázás

### Architektúra
- **StatefulWidget** - Állapotkezelés
- **CustomPainter** - Kerék rajzolás
- **AnimationController** - Animációk
- **StreamSubscription** - Szenzor események

### Platform Támogatás
- ✅ **Android** - Teljes támogatás
- ✅ **iOS** - Teljes támogatás
- ✅ **Web** - Alapvető támogatás

## 📱 Képernyőképek

### Főképernyő
- Szerencsekerék középen
- Pörgetés gomb alul
- Elem hozzáadás panel
- Statisztikák és beállítások gombok

### Statisztikák
- Összefoglaló kártyák
- Nyerési arányok kördiagram
- Részletes elemek listája
- Színkódolt dátumok

### Beállítások
- Téma választás
- Eredeti, Minimalista, Neon

## 🎯 Használat

1. **Elemek hozzáadása** - Írd be a nevet és nyomd meg az Enter-t
2. **Pörgetés** - Nyomd meg a Pörgetés gombot vagy rázd meg a telefont
3. **Statisztikák** - Nézd meg a részletes adatokat
4. **Témák** - Változtasd meg a kinézetet

## 🔧 Testreszabás

### Új témák hozzáadása
```dart
final Map<String, Map<String, Color>> themes = {
  'új_téma': {
    'primary': Colors.red,
    'secondary': Colors.orange,
    'accent': Colors.yellow,
  },
};
```

### Kerék színek módosítása
```dart
final List<Color> wheelColors = [
  Colors.red,
  Colors.blue,
  // ... további színek
];
```

## 📄 Licenc

MIT License - szabadon felhasználható és módosítható.

## 🤝 Közreműködés

1. Fork a projektet
2. Hozz létre egy feature branch-et
3. Commit a változtatásokat
4. Push a branch-re
5. Nyiss egy Pull Request-et

---

**Készítette Flutter-rel ❤️**
