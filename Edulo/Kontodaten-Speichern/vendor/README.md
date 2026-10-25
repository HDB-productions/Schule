# Eingebundene QR-Bibliotheken

- `qrcode.js`: qrcode-generator, Version/Tag **js2.0.4**, Kazuhiko Arase. [Originalquelle](https://github.com/kazuhikoarase/qrcode-generator/blob/js2.0.4/js/dist/qrcode.js), MIT-Lizenz in `LICENSE-qrcode.txt`. SHA-256 `79ec86f82856005b1c887905cfccfcfbec3821ca61c7fd5a952faa5f778f791c`. Der Build bettet Encoder und vollständige Lizenz in die einzelne Widgetdatei ein und kapselt die UMD-Erkennung, damit kein vorhandener AMD-Loader der Edulo-App verändert wird.
- `jsQR.js`: jsQR **1.4.0**, nur für den unabhängigen Testdecoder in `qr.test.cjs`. [Projekt](https://github.com/cozmo/jsQR), [versionierte Paketquelle](https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js), Apache-2.0-Lizenz in `jsQR.LICENSE`. Dieser Decoder wird **nicht** ins Widget eingebunden.

Im Widgetbetrieb werden keine Bibliotheken aus dem Netz geladen.
