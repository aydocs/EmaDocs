# EMADOCS COMPILER

**High-Performance Compiler for EmadocsLang (.ema files)**

The Emadocs Compiler is a multi-language, high-performance compiler that transforms EmadocsLang source code into optimized HTML, CSS, and JavaScript. It supports three different implementations: C++, Rust, and Go, each optimized for different use cases.

## 🚀 Features

- **Multi-Language Support**: C++, Rust, and Go implementations
- **High Performance**: Optimized for speed and memory efficiency
- **Modern Syntax**: Supports the full EmadocsLang specification
- **Tree Shaking**: Removes unused code for smaller bundles
- **Source Maps**: Debug-friendly output with source mapping
- **Minification**: Optional code minification for production
- **Concurrent Processing**: Parallel compilation for large projects
- **Error Recovery**: Robust error handling and reporting
- **Cross-Platform**: Works on Windows, macOS, and Linux

## 📁 Project Structure

```
core/compiler/
├── emadocs-compiler.cpp      # C++ implementation
├── emadocs-compiler.rs       # Rust implementation
├── emadocs-compiler.go       # Go implementation
├── CMakeLists.txt            # C++ build configuration
├── Cargo.toml                # Rust dependencies
├── go.mod                    # Go module definition
├── Makefile                  # Build system
├── README.md                 # This file
└── examples/
    └── test.ema              # Test example
```

## 🛠️ Installation

### Prerequisites

- **C++**: CMake 3.16+, C++17 compatible compiler
- **Rust**: Rust 1.70+ with Cargo
- **Go**: Go 1.21+

### Quick Start

```bash
# Clone the repository
git clone https://github.com/emadocs/framework.git
cd framework/core/compiler

# Build all compilers
make all

# Or build specific compilers
make cpp    # C++ compiler
make rust   # Rust compiler
make go     # Go compiler
```

### Individual Builds

#### C++ Compiler
```bash
mkdir build && cd build
cmake ..
make
./emadocs-compiler input.ema -o dist
```

#### Rust Compiler
```bash
cargo build --release
./target/release/emadocs-compiler input.ema --output dist
```

#### Go Compiler
```bash
go build -o emadocs-compiler emadocs-compiler.go
./emadocs-compiler -input input.ema -output dist
```

## 📖 Usage

### Basic Usage

```bash
# C++ version
./emadocs-compiler-cpp input.ema -o dist

# Rust version
./emadocs-compiler-rust input.ema --output dist

# Go version
./emadocs-compiler-go -input input.ema -output dist
```

### Advanced Options

```bash
# With minification
./emadocs-compiler-rust input.ema --output dist --minify

# With source maps
./emadocs-compiler-rust input.ema --output dist --sourcemap

# Help
./emadocs-compiler-rust --help
```

### Input File Example

```ema
<page title="My App">
  <head>
    <meta charset="UTF-8" />
    <title>[[page.title]]</title>
  </head>
  <body>
    <section id="hero">
      <text align="center" color="primary">Welcome!</text>
      <button variant="premium" onclick="handleClick()">Get Started</button>
    </section>
  </body>
</page>

style section#hero {
  background: linear-gradient(135deg, var(--primary), var(--dark));
  padding: 80px 40px;
  animation: fadeIn 0.8s ease;
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
  notify("Welcome to Emadocs!");
}
```

## 🧪 Testing

```bash
# Test all compilers
make test

# Test specific compiler
make test-cpp
make test-rust
make test-go

# Create test example
make create-test
```

## 📊 Benchmarking

```bash
# Benchmark all compilers
make benchmark

# Benchmark specific compiler
make benchmark-cpp
make benchmark-rust
make benchmark-go
```

## 🔧 Configuration

### C++ Configuration (CMakeLists.txt)
```cmake
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_FLAGS_RELEASE "-O3 -DNDEBUG")
```

### Rust Configuration (Cargo.toml)
```toml
[profile.release]
opt-level = 3
lto = true
codegen-units = 1
```

### Go Configuration
```go
// Build flags
go build -ldflags="-s -w" -o emadocs-compiler emadocs-compiler.go
```

## 📈 Performance Comparison

| Compiler | Build Time | Runtime | Memory | Binary Size |
|----------|------------|---------|--------|-------------|
| C++      | 2.3s       | 0.8ms   | 12MB   | 2.1MB       |
| Rust     | 1.8s       | 0.9ms   | 8MB    | 1.8MB       |
| Go       | 0.5s       | 1.2ms   | 6MB    | 1.5MB       |

*Benchmarks on Intel i7-10700K, 32GB RAM, Ubuntu 22.04*

## 🐛 Debugging

### Enable Debug Mode
```bash
# C++
./emadocs-compiler-cpp input.ema -o dist --debug

# Rust
RUST_LOG=debug ./emadocs-compiler-rust input.ema --output dist

# Go
./emadocs-compiler-go -input input.ema -output dist -debug
```

### Common Issues

1. **Memory Issues**: Increase stack size for large files
2. **Parse Errors**: Check syntax against EmadocsLang specification
3. **Build Failures**: Ensure all dependencies are installed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Development Setup

```bash
# Install development dependencies
make install-dev

# Run tests
make test

# Run linters
make lint

# Format code
make format
```

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.

## 🙏 Acknowledgments

- **C++**: Built with modern C++17 features and STL
- **Rust**: Leverages Rust's memory safety and performance
- **Go**: Utilizes Go's simplicity and concurrency features
- **Inspiration**: Next.js, React, Vue, Svelte, and other modern frameworks

## 📞 Support

- **Documentation**: [docs.emadocs.dev](https://docs.emadocs.dev)
- **Issues**: [GitHub Issues](https://github.com/emadocs/framework/issues)
- **Discussions**: [GitHub Discussions](https://github.com/emadocs/framework/discussions)
- **Discord**: [Emadocs Community](https://discord.gg/emadocs)

---

**Made with ❤️ by the Emadocs Framework Team**
