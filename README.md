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
        surveyId: 'your survey id', // required, can be overridden later
        customerId: '', // optional, can be overridden later
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
          surveyId: 'your survey id', // required, can be overridden later
          customerId: '', // optional, can be overridden later
        },
      });
      // window.Prometix = {};
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

1. <PrometixProvider /> — komponen React untuk integrasi penuh
2. usePrometix() — React hook untuk kontrol programatik
3. window.Prometix — API global untuk integrasi via embed script
