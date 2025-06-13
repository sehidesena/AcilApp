# AcilApp 🚨

AcilApp, acil durumlarda kullanıcıların konumunu paylaşmasını, yakınındaki hastane, polis ve zabıta noktalarını harita üzerinde görmesini ve acil kişilere hızlıca ulaşmasını sağlayan modern bir mobil uygulamadır. Proje, React Native ve Expo ile geliştirilmiştir.

## Özellikler

- 📍 **Konum Tespiti:** Kullanıcının anlık konumunu alır ve haritada gösterir.
- 🏥 **Yakındaki Acil Noktalar:** Google Places API ile yakın hastane, polis ve zabıta noktalarını listeler ve haritada işaretler.
- 📲 **Acil Kişilere SMS:** Tanımlı acil kişilere tek tuşla konum içeren SMS gönderir.
- 👤 **Kullanıcı Bilgileri:** Kullanıcı sağlık ve iletişim bilgilerini kaydedip yönetebilir.
- 🔒 **Firebase Entegrasyonu:** Kullanıcı verileri güvenli şekilde Firestore'da saklanır.

## Kurulum

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/kullanici-adi/acilapp.git
   cd acilapp
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Gerekli ortam değişkenlerini ve API anahtarlarını `app.json` veya `.env` dosyasına ekleyin.
4. Uygulamayı başlatın:
   ```bash
   npx expo start
   ```

## Kullanılan Teknolojiler

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Firebase (Firestore)](https://firebase.google.com/)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)

## Ekran Görüntüleri

> Uygulamanın ekran görüntülerini buraya ekleyebilirsiniz.

## Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! Lütfen önce bir issue açın ve değişiklikleriniz için bir pull request gönderin.

1. Fork'layın ve yeni bir branch oluşturun.
2. Değişikliklerinizi yapın.
3. Test edin ve commit'leyin.
4. Pull request gönderin.

## Lisans

MIT

---

Her türlü öneri ve geri bildirim için iletişime geçebilirsiniz.
