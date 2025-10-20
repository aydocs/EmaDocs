# EMADOCS COMPILER - BUILD SYSTEM
# Supports C++, Rust, and Go implementations

.PHONY: all clean test install cpp rust go help

# Default target
all: cpp rust go

# C++ Build
cpp: emadocs-compiler-cpp
emadocs-compiler-cpp: emadocs-compiler.cpp
	@echo "Building C++ compiler..."
	@mkdir -p build/cpp
	@cd build/cpp && cmake ../.. && make
	@cp build/cpp/emadocs-compiler ./emadocs-compiler-cpp
	@echo "C++ compiler built successfully!"

# Rust Build
rust: emadocs-compiler-rust
emadocs-compiler-rust: emadocs-compiler.rs Cargo.toml
	@echo "Building Rust compiler..."
	@cargo build --release
	@cp target/release/emadocs-compiler ./emadocs-compiler-rust
	@echo "Rust compiler built successfully!"

# Go Build
go: emadocs-compiler-go
emadocs-compiler-go: emadocs-compiler.go go.mod
	@echo "Building Go compiler..."
	@go build -o emadocs-compiler-go emadocs-compiler.go
	@echo "Go compiler built successfully!"

# Test all compilers
test: test-cpp test-rust test-go
	@echo "All tests passed!"

test-cpp: emadocs-compiler-cpp
	@echo "Testing C++ compiler..."
	@./emadocs-compiler-cpp examples/test.ema -o dist/cpp
	@echo "C++ compiler test completed!"

test-rust: emadocs-compiler-rust
	@echo "Testing Rust compiler..."
	@./emadocs-compiler-rust examples/test.ema --output dist/rust
	@echo "Rust compiler test completed!"

test-go: emadocs-compiler-go
	@echo "Testing Go compiler..."
	@./emadocs-compiler-go -input examples/test.ema -output dist/go
	@echo "Go compiler test completed!"

# Install compilers
install: install-cpp install-rust install-go
	@echo "All compilers installed successfully!"

install-cpp: emadocs-compiler-cpp
	@echo "Installing C++ compiler..."
	@sudo cp emadocs-compiler-cpp /usr/local/bin/emadocs-compiler-cpp
	@echo "C++ compiler installed!"

install-rust: emadocs-compiler-rust
	@echo "Installing Rust compiler..."
	@sudo cp emadocs-compiler-rust /usr/local/bin/emadocs-compiler-rust
	@echo "Rust compiler installed!"

install-go: emadocs-compiler-go
	@echo "Installing Go compiler..."
	@sudo cp emadocs-compiler-go /usr/local/bin/emadocs-compiler-go
	@echo "Go compiler installed!"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf build/
	@rm -rf target/
	@rm -f emadocs-compiler-*
	@rm -rf dist/
	@echo "Clean completed!"

# Benchmark all compilers
benchmark: benchmark-cpp benchmark-rust benchmark-go
	@echo "All benchmarks completed!"

benchmark-cpp: emadocs-compiler-cpp
	@echo "Benchmarking C++ compiler..."
	@time ./emadocs-compiler-cpp examples/test.ema -o dist/cpp-bench

benchmark-rust: emadocs-compiler-rust
	@echo "Benchmarking Rust compiler..."
	@time ./emadocs-compiler-rust examples/test.ema --output dist/rust-bench

benchmark-go: emadocs-compiler-go
	@echo "Benchmarking Go compiler..."
	@time ./emadocs-compiler-go -input examples/test.ema -output dist/go-bench

# Create test example
create-test:
	@echo "Creating test example..."
	@mkdir -p examples
	@cat > examples/test.ema << 'EOF'
<page title="Test Page">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>[[page.title]]</title>
  </head>
  <body>
    <navbar fixed>
      <logo src="/assets/logo.svg" />
      <navlink to="/about">About</navlink>
    </navbar>
    <section id="hero">
      <text align="center" color="primary">Welcome to Emadocs!</text>
      <button variant="premium" onclick="handleClick()">Get Started</button>
    </section>
  </body>
</page>

style section#hero {
  background: linear-gradient(135deg, var(--primary), var(--dark));
  padding: 80px 40px;
  animation: fadeIn 0.8s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

style text[align="center"] {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

style button[variant="premium"] {
  background: var(--primary);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

style button[variant="premium"]:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

component Navbar {
  prop fixed: boolean = false;
  render {
    <nav class="ema-navbar [[fixed ? 'ema-navbar--fixed' : '']]">
      <slot />
    </nav>
  }
}

component Logo {
  prop src: string;
  prop alt: string = "Logo";
  render {
    <img src="[[src]]" alt="[[alt]]" class="ema-logo" />
  }
}

component Navlink {
  prop to: string;
  render {
    <a href="[[to]]" class="ema-navlink" onclick="Emadocs.navigate('[[to]]')">
      <slot />
    </a>
  }
}

component Section {
  prop id: string;
  render {
    <section id="[[id]]" class="ema-section">
      <slot />
    </section>
  }
}

component Text {
  prop align: "left" | "center" | "right" = "left";
  prop color: string = "text-primary";
  render {
    <text class="ema-text ema-text--[[align]] ema-text--[[color]]">
      <slot />
    </text>
  }
}

component Button {
  prop variant: "minimal" | "neo" | "soft" | "glass" | "premium" = "minimal";
  prop onclick: Function;
  render {
    <button class="ema-button ema-button--[[variant]]" onclick={onclick}>
      <slot />
    </button>
  }
}

event click on button {
  log("Button clicked!");
  notify("Welcome to Emadocs Framework!");
}

state user {
  name: string = "Guest";
  isLoggedIn: boolean = false;
}

api UserAPI {
  baseUrl: "https://api.example.com";
  methods: ["GET", "POST", "PUT", "DELETE"];
}

router {
  route "/" -> "HomePage";
  route "/about" -> "AboutPage";
  route "/contact" -> "ContactPage";
}

layout MainLayout {
  render {
    <div class="main-layout">
      <header>
        <slot name="header" />
      </header>
      <main>
        <slot name="main" />
      </main>
      <footer>
        <slot name="footer" />
      </footer>
    </div>
  }
}

animation fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

type User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

hook useUser {
  parameters: [userId: string];
  body: {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      fetchUser(userId).then(data => {
        setUser(data);
        setLoading(false);
      });
    }, [userId]);
    
    return { user, loading };
  }
}

plugin Analytics {
  properties: {
    trackingId: "GA-XXXXXXXXX";
    enabled: true;
  };
}

config {
  theme: "purple";
  language: "en";
  debug: false;
  minify: true;
}

import { Button, Card, Modal } from "./components/ui.ema";
import { useUser, useAuth } from "./hooks/auth.ema";

export { default as HomePage } from "./pages/HomePage.ema";
export { default as AboutPage } from "./pages/AboutPage.ema";
EOF
	@echo "Test example created!"

# Help
help:
	@echo "Emadocs Compiler Build System"
	@echo ""
	@echo "Available targets:"
	@echo "  all          - Build all compilers (C++, Rust, Go)"
	@echo "  cpp          - Build C++ compiler"
	@echo "  rust         - Build Rust compiler"
	@echo "  go           - Build Go compiler"
	@echo "  test         - Test all compilers"
	@echo "  test-cpp     - Test C++ compiler"
	@echo "  test-rust    - Test Rust compiler"
	@echo "  test-go      - Test Go compiler"
	@echo "  install      - Install all compilers"
	@echo "  install-cpp  - Install C++ compiler"
	@echo "  install-rust - Install Rust compiler"
	@echo "  install-go   - Install Go compiler"
	@echo "  benchmark    - Benchmark all compilers"
	@echo "  benchmark-cpp- Benchmark C++ compiler"
	@echo "  benchmark-rust- Benchmark Rust compiler"
	@echo "  benchmark-go - Benchmark Go compiler"
	@echo "  create-test  - Create test example file"
	@echo "  clean        - Clean build artifacts"
	@echo "  help         - Show this help message"
	@echo ""
	@echo "Examples:"
	@echo "  make all                    # Build all compilers"
	@echo "  make test                   # Test all compilers"
	@echo "  make benchmark              # Benchmark all compilers"
	@echo "  make clean                  # Clean build artifacts"
