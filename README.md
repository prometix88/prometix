# PROMETIX

**Prometix** adalah widget feedback ringan berbasis React + TailwindCSS yang dapat di-embed langsung di HTML atau diintegrasikan ke aplikasi React. Cocok untuk mengumpulkan umpan balik pengguna secara cepat dan mudah.

## 🚀 Fitur

- ⚛️ Dibuat dengan React 19
- 🎨 Styling otomatis dengan Tailwind CSS
- 🧩 Bisa di-embed via `<script>` atau di-install via NPM
- 💬 Modal feedback dengan ilustrasi dan rating
- 🔒 Cegah feedback ganda (dukungan userId/anonymousId)

## 📦 Instalasi

### 🔧 Via NPM (untuk aplikasi React)

```bash
npm install prometix
```

```javascript
import { PrometixProvider } from 'prometix';

export default function App() {
  return (
    <PrometixProvider
      config={{
        surveyId: 'your survey id', // can be overridden later, required if hideFeedbackButton is false
        customerId: '', //  can be overridden later, required if hideFeedbackButton is false,
        meta: {
          company: 'ABC',
        }, //opsional
      }}
    >
      {/* ...your app... */}
    </PrometixProvider>
  );
}
```

### 🌐 Via Embed Script

Tambahkan script berikut ke HTML Anda:

```html
<script src="https://cdn.jsdelivr.net/npm/prometix@latest/prometix.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    if (window?.Prometix?.init) {
      window.Prometix.init({
        config: {
          surveyId: 'your survey id', // can be overridden later, required if hideFeedbackButton is false
          customerId: '', //  can be overridden later, required if hideFeedbackButton is false
          meta: {
            company: 'ABC',
          }, //opsional
        },
      });
    } else {
      console.error('Prometix.init is not available');
    }
  });
</script>
```

## 🧑‍💻 Usage

### React Component

```javascript
// EXAMPLE
import { usePrometix } from 'prometix';
export default function App() {
  const { showFeedbackModal } = usePrometix();
  const handleOrder = async() => {
    try {
      // ...your code...
      // after success you can call showFeedbackModal()
      showFeedbackModal({customerId:'your customer id', surverId:'your survey id'}); //if user has not given feedback, it will show modal
    }catch{

    }
  }
  return (
    <button onClick={handleOrder}>Show Feedback Modal</button>
    {/* ...your app... */}
  )
```

## 🧩 Komponen & API Prometix

Prometix menyediakan tiga cara utama untuk diintegrasikan:

1. `<PrometixProvider />` — komponen React untuk integrasi penuh
2. usePrometix() — React hook untuk kontrol programatik
3. window.Prometix — API global untuk integrasi via embed script

### 📚 Konfigurasi

```typeScript
  type FeedbackConfig = {
    title: string;
    thankyou: string;
    textSubmitted: string;
    textButton: string;
    descriptionScore: string;
    illustration: string;
    followupQuestion: string;

    api: {
      submit: {
        method: string; // contoh: 'POST'
        url: string;    // endpoint untuk mengirim feedback
      };
      check: {
        method: string; // contoh: 'GET'
        url: string;    // endpoint untuk memeriksa apakah feedback sudah dikirim
      };
      surveyContent: {
        method: string; // contoh: 'POST'
        url: string;    // endpoint untuk mengambil isi survei
      }
    };

    customerId: string;           // ID unik untuk user (userId atau anonim)
    surveyId: string;             // ID survei untuk membedakan sesi feedback
    meta:Record<string,any>       //opsional
    hideFeedbackButton: boolean;  // Jika true, tombol trigger feedback disembunyikan
  };
```

#### Example

```typeScript
  const config: FeedbackConfig = {
    title: 'Seberapa besar kemungkinan kamu merekomendasikan kami?',
    thankyou: 'Terima kasih atas feedback kamu!',
    textSubmitted: 'Feedback berhasil dikirim.',
    textButton: 'Kirim',
    descriptionScore: '0 = Tidak sama sekali, 10 = Sangat mungkin',
    illustration: 'https://domain.com/images/ilustrasi-feedback.svg',
    followupQuestion:'Apa alasan Anda?'

    api: {
      submit: {
        method: 'POST',
        url: 'https://api.kamu.com/feedback/kirim',
      },
      check: {
        method: 'POST',
        url: 'https://api.kamu.com/feedback/cek',
      },
      surveyContent: {
        method: 'POST',
        url: 'https://api.kamu.com/feedback/content',
      },
    },

    customerId: 'user-123',          // atau UUID jika anonim
    surveyId: 'nps-q3-2025',
    hideFeedbackButton: false,
  };
```

### Catatan Tambahan

- customerId bisa berupa ID user (jika login), atau UUID yang dihasilkan otomatis untuk pengguna anonim.

- surveyId bisa digunakan untuk membedakan feedback berdasarkan periode waktu, fitur tertentu, atau eksperimen.

- hideFeedbackButton jika diatur true, maka tombol feedback tidak akan muncul secara otomatis — berguna jika kamu ingin memicu feedback lewat tombol sendiri menggunakan usePrometix() atau window.Prometix.handler.

## 🌐 window.Prometix

Prometix juga dapat digunakan di luar React dengan menyisipkan script embed (UMD build) di HTML. Setelah script dimuat, akan tersedia object global bernama window.Prometix.

window.Prometix berisi:

```json
{
  "title": "", // string
  "thankyou": "", // string
  "textSubmitted": "", // string
  "textButton": "", // string
  "illustration": "", // string
  "followupQuestion": "", // string
  "api": {
    "submit": {
      "url": "", // string
      "method": "" // string
    },
    "check": {
      "url": "", // string
      "method": "" // string
    },
    "surveyContent": {
      "url": "", // string
      "method": "" // string
    }
  },
  "customerId": "", // string
  "surveyId": "", // string
  "meta":{},//object
  "hideFeedbackButton": boolean, // boolean
  "handler": {
    "showFeedbackModal": function, // function
    "hideFeedbackModal": function, // function
  }
}
```

## Contributing

If you would like to contribute to this project, please fork this repository and create a pull request. We welcome suggestions and improvements!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
