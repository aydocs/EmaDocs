# 🚀 Adiox Framework - Hızlı Başlangıç

## Kurulum

Adiox framework'ü kullanmak için herhangi bir kurulum gerekmez. Dosyaları indirin ve HTML'inize dahil edin:

\`\`\`html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Adiox App</title>
  <!-- CSS -->
  <link rel="stylesheet" href="css/adiox.css">
</head>
<body>
  <div id="app">
    <!-- İçeriğiniz buraya -->
  </div>

  <!-- JavaScript -->
  <script src="js/adiox.js" type="module"></script>
</body>
</html>
\`\`\`

## Temel Kullanım

### 1. Web Components

Adiox, `adi-` prefix'i ile başlayan Web Components sunar:

\`\`\`html
<!-- Butonlar -->
<adi-button variant="primary">Birincil Buton</adi-button>
<adi-button variant="success" size="large">Büyük Buton</adi-button>
<adi-button variant="danger" disabled>Devre Dışı</adi-button>

<!-- Kartlar -->
<adi-card>
  <div slot="header">Başlık</div>
  <div slot="body">İçerik</div>
  <div slot="footer">Alt Bilgi</div>
</adi-card>

<!-- Input -->
<adi-input 
  label="E-posta" 
  type="email" 
  placeholder="ornek@email.com"
  required>
</adi-input>

<!-- Dropdown -->
<adi-dropdown label="Seçenekler">
  <button slot="item">Seçenek 1</button>
  <button slot="item">Seçenek 2</button>
  <button slot="item">Seçenek 3</button>
</adi-dropdown>
\`\`\`

### 2. JavaScript API

#### Toast Bildirimleri

\`\`\`javascript
// Basit toast
Adiox.UI.toast('İşlem başarılı!', 'success');

// Özelleştirilmiş toast
Adiox.UI.toast('Hata oluştu!', 'error', {
  duration: 5000,
  position: 'top-right'
});
\`\`\`

#### Modal Diyaloglar

\`\`\`javascript
// Basit modal
Adiox.UI.modal({
  title: 'Bildirim',
  content: 'İşlem tamamlandı!'
});

// Onay modalı
Adiox.UI.modal({
  title: 'Silme Onayı',
  content: 'Bu öğeyi silmek istediğinizden emin misiniz?',
  buttons: [
    { text: 'İptal', variant: 'outline' },
    { text: 'Sil', variant: 'danger' }
  ]
}).then(buttonIndex => {
  if (buttonIndex === 1) {
    // Silme işlemi
  }
});
\`\`\`

#### Reaktif Store

\`\`\`javascript
// Store oluştur
const userStore = Adiox.Store.create({
  name: 'Ahmet',
  age: 25,
  email: 'ahmet@example.com'
});

// Değer al
const name = userStore.get('name');

// Değer güncelle
userStore.set('age', 26);

// HTML'e bağla (otomatik güncelleme)
userStore.bind('name', '#userName');

// Değişiklikleri izle
userStore.watch('age', (newAge, oldAge) => {
  console.log(`Yaş ${oldAge}'dan ${newAge}'a değişti`);
});

// LocalStorage'a kaydet
userStore.persist('userData');
\`\`\`

#### SPA Router

\`\`\`javascript
// Route'ları tanımla
Adiox.Router.addRoute('/', () => {
  document.querySelector('#app').innerHTML = '<h1>Ana Sayfa</h1>';
});

Adiox.Router.addRoute('/about', () => {
  document.querySelector('#app').innerHTML = '<h1>Hakkında</h1>';
});

// Parametreli route
Adiox.Router.addRoute('/user/:id', (params) => {
  document.querySelector('#app').innerHTML = 
    `<h1>Kullanıcı: ${params.id}</h1>`;
});

// Router'ı başlat
Adiox.Router.init();

// Programatik navigasyon
Adiox.Router.navigate('/about');
\`\`\`

#### Animasyonlar

\`\`\`javascript
// Basit animasyon
Adiox.Animations.animate('#element', 'fadeIn');

// Özelleştirilmiş animasyon
Adiox.Animations.animate('#element', 'slideUp', {
  duration: 600,
  easing: 'ease-out',
  delay: 200
});

// Animasyon dizisi
Adiox.Animations.sequence([
  { element: '#box1', animation: 'fadeIn' },
  { element: '#box2', animation: 'slideUp' },
  { element: '#box3', animation: 'bounce' }
]);

// Scroll animasyonu
Adiox.Animations.onScroll('#element', 'fadeIn', {
  threshold: 0.5
});
\`\`\`

### 3. Utility Classes

Adiox, Tailwind benzeri utility class'lar sunar:

\`\`\`html
<!-- Spacing -->
<div class="p-4 m-2 px-6 py-3">İçerik</div>

<!-- Colors -->
<div class="bg-primary text-white">Birincil Renk</div>
<div class="bg-success text-white">Başarı Rengi</div>

<!-- Typography -->
<h1 class="text-4xl font-bold text-center">Başlık</h1>
<p class="text-lg text-gray-600">Paragraf</p>

<!-- Layout -->
<div class="flex items-center justify-between">
  <span>Sol</span>
  <span>Sağ</span>
</div>

<!-- Grid -->
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<!-- Responsive -->
<div class="text-sm md:text-lg lg:text-xl">
  Responsive Metin
</div>
\`\`\`

### 4. Dark Mode

\`\`\`javascript
// Dark mode'a geç
Adiox.Theme.setTheme('dark');

// Light mode'a geç
Adiox.Theme.setTheme('light');

// Tema değiştir (toggle)
Adiox.Theme.toggle();

// Mevcut temayı al
const theme = Adiox.Theme.getTheme(); // 'light' veya 'dark'
\`\`\`

### 5. Form Validation

\`\`\`javascript
// Form validasyonu
const form = document.querySelector('#myForm');

Adiox.Utils.validateForm(form, {
  email: {
    required: true,
    email: true
  },
  password: {
    required: true,
    minLength: 8
  }
});
\`\`\`

### 6. Utilities

\`\`\`javascript
// HTML sanitize (XSS koruması)
const safeHTML = Adiox.Utils.sanitizeHTML(userInput);

// Debounce
const debouncedSearch = Adiox.Utils.debounce((query) => {
  // Arama işlemi
}, 300);

// Throttle
const throttledScroll = Adiox.Utils.throttle(() => {
  // Scroll işlemi
}, 100);

// Format
const formatted = Adiox.Utils.formatDate(new Date(), 'DD/MM/YYYY');
const currency = Adiox.Utils.formatCurrency(1234.56, 'TRY');
\`\`\`

## Örnek Uygulama

\`\`\`html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo App - Adiox</title>
  <link rel="stylesheet" href="css/adiox.css">
</head>
<body>
  <div class="container py-8">
    <adi-card>
      <div slot="header">
        <h1 class="text-2xl font-bold">Todo Listesi</h1>
      </div>
      <div slot="body">
        <div class="flex gap-2 mb-4">
          <adi-input id="todoInput" placeholder="Yeni görev..."></adi-input>
          <adi-button id="addBtn" variant="primary">Ekle</adi-button>
        </div>
        <div id="todoList"></div>
      </div>
    </adi-card>
  </div>

  <script src="js/adiox.js" type="module"></script>
  <script type="module">
    // Store oluştur
    const todoStore = Adiox.Store.create({
      todos: []
    });

    // Todo ekle
    document.getElementById('addBtn').addEventListener('click', () => {
      const input = document.getElementById('todoInput');
      const text = input.value.trim();
      
      if (text) {
        const todos = todoStore.get('todos');
        todos.push({ id: Date.now(), text, done: false });
        todoStore.set('todos', todos);
        input.value = '';
        Adiox.UI.toast('Görev eklendi!', 'success');
      }
    });

    // Todo listesini render et
    todoStore.watch('todos', (todos) => {
      const list = document.getElementById('todoList');
      list.innerHTML = todos.map(todo => `
        <div class="flex items-center justify-between p-3 bg-gray-100 rounded mb-2">
          <span class="${todo.done ? 'line-through text-gray-500' : ''}">${todo.text}</span>
          <div class="flex gap-2">
            <adi-button size="small" variant="success" onclick="toggleTodo(${todo.id})">
              ${todo.done ? 'Geri Al' : 'Tamamla'}
            </adi-button>
            <adi-button size="small" variant="danger" onclick="deleteTodo(${todo.id})">
              Sil
            </adi-button>
          </div>
        </div>
      `).join('');
    });

    // Global fonksiyonlar
    window.toggleTodo = (id) => {
      const todos = todoStore.get('todos');
      const todo = todos.find(t => t.id === id);
      if (todo) {
        todo.done = !todo.done;
        todoStore.set('todos', [...todos]);
      }
    };

    window.deleteTodo = (id) => {
      const todos = todoStore.get('todos').filter(t => t.id !== id);
      todoStore.set('todos', todos);
      Adiox.UI.toast('Görev silindi', 'info');
    };

    // LocalStorage'a kaydet
    todoStore.persist('todos');
  </script>
</body>
</html>
\`\`\`

## Sonraki Adımlar

- [API Dokümantasyonu](api.md) - Tüm API referansı
- [Bileşen Rehberi](components.md) - Tüm bileşenler ve kullanımları
- [Plugin Geliştirme](plugin-guide.md) - Kendi plugin'inizi yazın
- [Erişilebilirlik](accessibility.md) - WCAG 2.1 AA uyumluluk rehberi

## Destek

Sorularınız için:
- GitHub Issues
- Dokümantasyon
- Örnek uygulamalar
