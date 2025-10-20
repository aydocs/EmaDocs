# EmadocsLang - Dil Spesifikasyonu

## Genel Bakış
EmadocsLang, web uygulamaları geliştirmek için tasarlanmış modern, bileşen-merkezli bir dildir. HTML, CSS ve JavaScript'in gücünü tek bir dilde birleştirir.

## Dosya Uzantısı
`.ema` - Emadocs Application

## Temel Sözdizimi

### 1. Sayfa Yapısı
```ema
<page title="Ana Sayfa" theme="purple">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  
  <body>
    <!-- İçerik -->
  </body>
</page>
```

### 2. Bileşen Sistemi
```ema
component Button<T> {
  prop variant: "primary" | "secondary" | "outline" = "primary";
  prop size: "sm" | "md" | "lg" = "md";
  prop disabled: boolean = false;
  prop loading: boolean = false;
  prop children: T;
  
  event onClick: () => void;
  
  render() {
    <button 
      class="ema-button ema-button--{variant} ema-button--{size}"
      disabled={disabled}
      loading={loading}
      onClick={onClick}
    >
      {loading ? <spinner /> : children}
    </button>
  }
}
```

### 3. Stil Sistemi (EmadocsCSS)
```ema
style Button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all var(--duration-200) var(--ease-in-out);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  &:disabled {
    opacity: var(--state-disabled);
    cursor: not-allowed;
  }
  
  &--primary {
    background: var(--active-theme);
    color: var(--active-theme-text-primary);
    
    &:hover:not(:disabled) {
      background: var(--active-theme-dark);
    }
  }
  
  &--secondary {
    background: var(--neutral-100);
    color: var(--neutral-900);
    border: 1px solid var(--neutral-300);
    
    &:hover:not(:disabled) {
      background: var(--neutral-200);
    }
  }
}
```

### 4. Etkileşim Sistemi
```ema
event click on button#save {
  const formData = getFormData("userForm");
  const result = await saveUser(formData);
  
  if (result.success) {
    notify("Kullanıcı başarıyla kaydedildi!", "success");
    navigate("/users");
  } else {
    notify("Hata: " + result.error, "error");
  }
}

event submit on form#userForm {
  preventDefault();
  validateForm("userForm");
  
  if (isFormValid("userForm")) {
    trigger("click", "button#save");
  }
}
```

### 5. State Yönetimi
```ema
state UserState {
  users: User[] = [];
  loading: boolean = false;
  error: string | null = null;
  currentUser: User | null = null;
}

state CounterState {
  count: number = 0;
  step: number = 1;
}

// State kullanımı
const { users, loading, error } = useState(UserState);
const { count, step, setCount } = useState(CounterState);
```

### 6. API Entegrasyonu
```ema
api UserAPI {
  baseUrl: "https://api.example.com";
  
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${baseUrl}/users`);
    return response.json();
  }
  
  async createUser(user: User): Promise<ApiResponse> {
    const response = await fetch(`${baseUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });
    return response.json();
  }
}
```

### 7. Routing Sistemi
```ema
<router>
  <route path="/" component={HomePage} />
  <route path="/about" component={AboutPage} />
  <route path="/users" component={UsersPage} />
  <route path="/users/:id" component={UserDetailPage} />
  <route path="/login" component={LoginPage} />
  <route path="*" component={NotFoundPage} />
</router>
```

### 8. Layout Sistemi
```ema
layout MainLayout {
  render() {
    <div class="main-layout">
      <navbar fixed>
        <logo src="/assets/logo.svg" />
        <nav>
          <navlink to="/">Ana Sayfa</navlink>
          <navlink to="/about">Hakkında</navlink>
          <navlink to="/users">Kullanıcılar</navlink>
        </nav>
        <user-menu />
      </navbar>
      
      <main class="main-content">
        <slot />
      </main>
      
      <footer>
        <p>&copy; 2024 Emadocs Framework</p>
      </footer>
    </div>
  }
}
```

### 9. Animasyon Sistemi
```ema
animation fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

animation slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

// Kullanım
<div class="hero" animation="fadeIn 0.8s ease">
  <h1>Hoş Geldin!</h1>
</div>
```

### 10. Responsive Design
```ema
style Hero {
  padding: var(--space-8);
  text-align: center;
  
  @media (max-width: 480px) {
    padding: var(--space-4);
    font-size: var(--font-size-lg);
  }
  
  @media (min-width: 768px) {
    padding: var(--space-12);
    font-size: var(--font-size-2xl);
  }
  
  @media (min-width: 1024px) {
    padding: var(--space-16);
    font-size: var(--font-size-4xl);
  }
}
```

### 11. TypeScript Benzeri Tip Sistemi
```ema
type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";
```

### 12. Modül Sistemi
```ema
// utils.ema
export function formatDate(date: Date): string {
  return date.toLocaleDateString('tr-TR');
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  }) as T;
}

// main.ema
import { formatDate, debounce } from './utils.ema';
```

### 13. Hooks Sistemi
```ema
hook useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  
  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };
  
  return [value, setStoredValue];
}

hook useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [url]);
  
  return { data, loading, error };
}
```

### 14. Plugin Sistemi
```ema
plugin EmadocsUI {
  name: "EmadocsUI";
  version: "1.0.0";
  
  components: [
    Button,
    Input,
    Card,
    Modal,
    // ... diğer bileşenler
  ];
  
  styles: [
    "theme.css",
    "components.css"
  ];
  
  init() {
    console.log("EmadocsUI plugin initialized");
  }
}
```

### 15. Build ve Development
```ema
// emadocs.config.ema
config {
  entry: "./src/index.ema";
  output: "./dist";
  mode: "development"; // "development" | "production"
  
  plugins: [
    EmadocsUI,
    TypeScript,
    Sass,
    PostCSS
  ];
  
  devServer: {
    port: 3000;
    host: "localhost";
    hot: true;
    open: true;
  };
  
  build: {
    minify: true;
    sourcemap: true;
    treeshaking: true;
  };
}
```

## Derleme Süreci

1. **Parse**: .ema dosyası parse edilir ve AST oluşturulur
2. **Transform**: AST, optimize edilmiş HTML/CSS/JS'e dönüştürülür
3. **Bundle**: Tüm dosyalar tek bir bundle'da birleştirilir
4. **Minify**: Production için kod küçültülür
5. **Output**: Final HTML/CSS/JS dosyaları oluşturulur

## Örnek Tam Uygulama

```ema
<page title="Todo App" theme="blue">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  
  <body>
    <div class="todo-app">
      <header class="app-header">
        <h1>Todo App</h1>
        <p>EmadocsLang ile geliştirildi</p>
      </header>
      
      <main class="app-main">
        <todo-form />
        <todo-list />
      </main>
    </div>
  </body>
</page>

component TodoForm {
  state newTodo: string = "";
  
  event submit on form {
    preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo("");
    }
  }
  
  render() {
    <form class="todo-form">
      <input 
        type="text" 
        placeholder="Yeni görev ekle..."
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button type="submit" variant="primary">
        Ekle
      </button>
    </form>
  }
}

component TodoList {
  const { todos, loading } = useApi("/api/todos");
  
  render() {
    <div class="todo-list">
      {loading ? (
        <spinner />
      ) : (
        todos?.map(todo => (
          <todo-item key={todo.id} todo={todo} />
        ))
      )}
    </div>
  }
}

style TodoApp {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--space-6);
  
  .app-header {
    text-align: center;
    margin-bottom: var(--space-8);
  }
  
  .todo-form {
    display: flex;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
    
    input {
      flex: 1;
      padding: var(--space-3);
      border: 1px solid var(--neutral-300);
      border-radius: var(--radius-md);
    }
  }
  
  .todo-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
}
```

Bu dil spesifikasyonu, modern web geliştirmenin tüm ihtiyaçlarını karşılayacak şekilde tasarlanmıştır.
