/**
 * EMADOCS COMPILER - C++ Implementation
 * High-performance compiler for EmadocsLang (.ema files)
 * Compiles .ema files to optimized HTML, CSS, and JavaScript
 * 
 * @author Emadocs Framework Team
 * @version 1.0.0
 * @license MIT
 */

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <map>
#include <memory>
#include <regex>
#include <sstream>
#include <filesystem>
#include <chrono>
#include <algorithm>
#include <cctype>
#include <functional>

namespace EmadocsCompiler {

// ===================================
// TOKEN DEFINITIONS
// ===================================

enum class TokenType {
    // Keywords
    PAGE, COMPONENT, STYLE, EVENT, STATE, API, ROUTER, ROUTE, LAYOUT,
    ANIMATION, TYPE, HOOK, PLUGIN, CONFIG, IMPORT, EXPORT, FROM, AS,
    IF, ELSE, FOR, WHILE, FUNCTION, ASYNC, AWAIT, RETURN, CONST, LET, VAR,
    TRUE, FALSE, NULL_VAL, UNDEFINED, CLASS, EXTENDS, IMPLEMENTS, INTERFACE,
    ENUM, NAMESPACE, RENDER, COMPUTED, WATCH, MOUNTED, UNMOUNTED,
    
    // Operators
    ASSIGN, EQUAL, NOT_EQUAL, LESS, GREATER, LESS_EQUAL, GREATER_EQUAL,
    PLUS, MINUS, MULTIPLY, DIVIDE, MODULO, AND, OR, NOT, ARROW,
    
    // Punctuation
    LEFT_PAREN, RIGHT_PAREN, LEFT_BRACE, RIGHT_BRACE, LEFT_BRACKET, RIGHT_BRACKET,
    SEMICOLON, COMMA, DOT, COLON, QUESTION, PIPE,
    
    // Tags
    OPENING_TAG_START, CLOSING_TAG_START, TAG_END, SELF_CLOSING_TAG_END,
    
    // Literals
    IDENTIFIER, STRING, NUMBER, TEMPLATE_LITERAL,
    
    // Special
    COMMENT, WHITESPACE, NEWLINE, EOF_TOKEN
};

struct Token {
    TokenType type;
    std::string value;
    size_t line;
    size_t column;
    
    Token(TokenType t, const std::string& v, size_t l, size_t c)
        : type(t), value(v), line(l), column(c) {}
};

// ===================================
// AST NODE DEFINITIONS
// ===================================

class ASTNode {
public:
    virtual ~ASTNode() = default;
    virtual std::string toString() const = 0;
    virtual void accept(class ASTVisitor& visitor) = 0;
};

class ProgramNode : public ASTNode {
public:
    std::vector<std::unique_ptr<ASTNode>> statements;
    
    std::string toString() const override {
        return "Program";
    }
    
    void accept(ASTVisitor& visitor) override;
};

class PageNode : public ASTNode {
public:
    std::string name;
    std::map<std::string, std::string> attributes;
    std::vector<std::unique_ptr<ASTNode>> body;
    
    std::string toString() const override {
        return "Page: " + name;
    }
    
    void accept(ASTVisitor& visitor) override;
};

class ComponentNode : public ASTNode {
public:
    std::string name;
    std::vector<std::string> typeParams;
    std::vector<std::unique_ptr<ASTNode>> props;
    std::vector<std::unique_ptr<ASTNode>> events;
    std::vector<std::unique_ptr<ASTNode>> state;
    std::vector<std::unique_ptr<ASTNode>> methods;
    std::unique_ptr<ASTNode> render;
    
    std::string toString() const override {
        return "Component: " + name;
    }
    
    void accept(ASTVisitor& visitor) override;
};

class StyleNode : public ASTNode {
public:
    std::string selector;
    std::vector<std::unique_ptr<ASTNode>> rules;
    
    std::string toString() const override {
        return "Style: " + selector;
    }
    
    void accept(ASTVisitor& visitor) override;
};

class EventNode : public ASTNode {
public:
    std::string eventType;
    std::string target;
    std::vector<std::unique_ptr<ASTNode>> body;
    
    std::string toString() const override {
        return "Event: " + eventType + " on " + target;
    }
    
    void accept(ASTVisitor& visitor) override;
};

class StateNode : public ASTNode {
public:
    std::string name;
    std::vector<std::unique_ptr<ASTNode>> properties;
    
    std::string toString() const override {
        return "State: " + name;
    }
    
    void accept(ASTVisitor& visitor) override;
};

class APINode : public ASTNode {
public:
    std::string name;
    std::map<std::string, std::string> properties;
    std::vector<std::unique_ptr<ASTNode>> methods;
    
    std::string toString() const override {
        return "API: " + name;
    }
    
    void accept(ASTVisitor& visitor) override;
};

class RouterNode : public ASTNode {
public:
    std::vector<std::unique_ptr<ASTNode>> routes;
    
    std::string toString() const override {
        return "Router";
    }
    
    void accept(ASTVisitor& visitor) override;
};

class RouteNode : public ASTNode {
public:
    std::string path;
    std::string component;
    std::map<std::string, std::string> options;
    
    std::string toString() const override {
        return "Route: " + path + " -> " + component;
    }
    
    void accept(ASTVisitor& visitor) override;
};

class LayoutNode : public ASTNode {
public:
    std::string name;
    std::unique_ptr<ASTNode> render;
    
    std::string toString() const override {
        return "Layout: " + name;
    }
    
    void accept(ASTVisitor& visitor) override;
};

class AnimationNode : public ASTNode {
public:
    std::string name;
    std::vector<std::unique_ptr<ASTNode>> keyframes;
    
    std::string toString() const override {
        return "Animation: " + name;
    }
    
    void accept(ASTVisitor& visitor) override;
};

class TypeNode : public ASTNode {
public:
    std::string name;
    std::unique_ptr<ASTNode> definition;
    
    std::string toString() const override {
        return "Type: " + name;
    }
    
    void accept(ASTVisitor& visitor) override;
};

class HookNode : public ASTNode {
public:
    std::string name;
    std::vector<std::unique_ptr<ASTNode>> parameters;
    std::vector<std::unique_ptr<ASTNode>> body;
    
    std::string toString() const override {
        return "Hook: " + name;
    }
    
    void accept(ASTVisitor& visitor) override;
};

class PluginNode : public ASTNode {
public:
    std::string name;
    std::map<std::string, std::string> properties;
    
    std::string toString() const override {
        return "Plugin: " + name;
    }
    
    void accept(ASTVisitor& visitor) override;
};

class ConfigNode : public ASTNode {
public:
    std::map<std::string, std::string> properties;
    
    std::string toString() const override {
        return "Config";
    }
    
    void accept(ASTVisitor& visitor) override;
};

class ImportNode : public ASTNode {
public:
    std::vector<std::string> specifiers;
    std::string source;
    
    std::string toString() const override {
        return "Import from " + source;
    }
    
    void accept(ASTVisitor& visitor) override;
};

class ExportNode : public ASTNode {
public:
    std::vector<std::string> specifiers;
    std::string source;
    bool isDefault;
    
    std::string toString() const override {
        return isDefault ? "Export Default" : "Export";
    }
    
    void accept(ASTVisitor& visitor) override;
};

class ElementNode : public ASTNode {
public:
    std::string tagName;
    std::map<std::string, std::string> attributes;
    std::vector<std::unique_ptr<ASTNode>> children;
    bool selfClosing;
    
    std::string toString() const override {
        return "Element: " + tagName;
    }
    
    void accept(ASTVisitor& visitor) override;
};

class TextNode : public ASTNode {
public:
    std::string value;
    
    std::string toString() const override {
        return "Text: " + value;
    }
    
    void accept(ASTVisitor& visitor) override;
};

class ExpressionNode : public ASTNode {
public:
    std::string expression;
    
    std::string toString() const override {
        return "Expression: " + expression;
    }
    
    void accept(ASTVisitor& visitor) override;
};

// ===================================
// LEXER
// ===================================

class Lexer {
private:
    std::string input;
    size_t position;
    size_t line;
    size_t column;
    
    std::map<std::string, TokenType> keywords = {
        {"page", TokenType::PAGE},
        {"component", TokenType::COMPONENT},
        {"style", TokenType::STYLE},
        {"event", TokenType::EVENT},
        {"state", TokenType::STATE},
        {"api", TokenType::API},
        {"router", TokenType::ROUTER},
        {"route", TokenType::ROUTE},
        {"layout", TokenType::LAYOUT},
        {"animation", TokenType::ANIMATION},
        {"type", TokenType::TYPE},
        {"hook", TokenType::HOOK},
        {"plugin", TokenType::PLUGIN},
        {"config", TokenType::CONFIG},
        {"import", TokenType::IMPORT},
        {"export", TokenType::EXPORT},
        {"from", TokenType::FROM},
        {"as", TokenType::AS},
        {"if", TokenType::IF},
        {"else", TokenType::ELSE},
        {"for", TokenType::FOR},
        {"while", TokenType::WHILE},
        {"function", TokenType::FUNCTION},
        {"async", TokenType::ASYNC},
        {"await", TokenType::AWAIT},
        {"return", TokenType::RETURN},
        {"const", TokenType::CONST},
        {"let", TokenType::LET},
        {"var", TokenType::VAR},
        {"true", TokenType::TRUE},
        {"false", TokenType::FALSE},
        {"null", TokenType::NULL_VAL},
        {"undefined", TokenType::UNDEFINED},
        {"class", TokenType::CLASS},
        {"extends", TokenType::EXTENDS},
        {"implements", TokenType::IMPLEMENTS},
        {"interface", TokenType::INTERFACE},
        {"enum", TokenType::ENUM},
        {"namespace", TokenType::NAMESPACE},
        {"render", TokenType::RENDER},
        {"computed", TokenType::COMPUTED},
        {"watch", TokenType::WATCH},
        {"mounted", TokenType::MOUNTED},
        {"unmounted", TokenType::UNMOUNTED}
    };
    
public:
    Lexer(const std::string& input) : input(input), position(0), line(1), column(1) {}
    
    std::vector<Token> tokenize() {
        std::vector<Token> tokens;
        
        while (position < input.length()) {
            char current = input[position];
            
            if (std::isspace(current)) {
                if (current == '\n') {
                    tokens.emplace_back(TokenType::NEWLINE, "\n", line, column);
                    line++;
                    column = 1;
                } else {
                    tokens.emplace_back(TokenType::WHITESPACE, std::string(1, current), line, column);
                    column++;
                }
                position++;
                continue;
            }
            
            // Comments
            if (current == '/' && position + 1 < input.length()) {
                if (input[position + 1] == '/') {
                    tokens.push_back(readLineComment());
                    continue;
                } else if (input[position + 1] == '*') {
                    tokens.push_back(readBlockComment());
                    continue;
                }
            }
            
            // Strings
            if (current == '"' || current == '\'') {
                tokens.push_back(readString());
                continue;
            }
            
            // Template literals
            if (current == '`') {
                tokens.push_back(readTemplateLiteral());
                continue;
            }
            
            // Numbers
            if (std::isdigit(current)) {
                tokens.push_back(readNumber());
                continue;
            }
            
            // Identifiers and keywords
            if (std::isalpha(current) || current == '_') {
                tokens.push_back(readIdentifier());
                continue;
            }
            
            // Operators and punctuation
            switch (current) {
                case '=':
                    if (position + 1 < input.length() && input[position + 1] == '=') {
                        tokens.emplace_back(TokenType::EQUAL, "==", line, column);
                        position += 2;
                        column += 2;
                    } else if (position + 1 < input.length() && input[position + 1] == '>') {
                        tokens.emplace_back(TokenType::ARROW, "=>", line, column);
                        position += 2;
                        column += 2;
                    } else {
                        tokens.emplace_back(TokenType::ASSIGN, "=", line, column);
                        position++;
                        column++;
                    }
                    break;
                    
                case '!':
                    if (position + 1 < input.length() && input[position + 1] == '=') {
                        tokens.emplace_back(TokenType::NOT_EQUAL, "!=", line, column);
                        position += 2;
                        column += 2;
                    } else {
                        tokens.emplace_back(TokenType::NOT, "!", line, column);
                        position++;
                        column++;
                    }
                    break;
                    
                case '<':
                    if (position + 1 < input.length() && input[position + 1] == '/') {
                        tokens.emplace_back(TokenType::CLOSING_TAG_START, "</", line, column);
                        position += 2;
                        column += 2;
                    } else if (position + 1 < input.length() && input[position + 1] == '=') {
                        tokens.emplace_back(TokenType::LESS_EQUAL, "<=", line, column);
                        position += 2;
                        column += 2;
                    } else {
                        tokens.emplace_back(TokenType::OPENING_TAG_START, "<", line, column);
                        position++;
                        column++;
                    }
                    break;
                    
                case '>':
                    if (position + 1 < input.length() && input[position + 1] == '=') {
                        tokens.emplace_back(TokenType::GREATER_EQUAL, ">=", line, column);
                        position += 2;
                        column += 2;
                    } else {
                        tokens.emplace_back(TokenType::TAG_END, ">", line, column);
                        position++;
                        column++;
                    }
                    break;
                    
                case '+':
                    tokens.emplace_back(TokenType::PLUS, "+", line, column);
                    position++;
                    column++;
                    break;
                    
                case '-':
                    tokens.emplace_back(TokenType::MINUS, "-", line, column);
                    position++;
                    column++;
                    break;
                    
                case '*':
                    tokens.emplace_back(TokenType::MULTIPLY, "*", line, column);
                    position++;
                    column++;
                    break;
                    
                case '/':
                    tokens.emplace_back(TokenType::DIVIDE, "/", line, column);
                    position++;
                    column++;
                    break;
                    
                case '%':
                    tokens.emplace_back(TokenType::MODULO, "%", line, column);
                    position++;
                    column++;
                    break;
                    
                case '&':
                    if (position + 1 < input.length() && input[position + 1] == '&') {
                        tokens.emplace_back(TokenType::AND, "&&", line, column);
                        position += 2;
                        column += 2;
                    } else {
                        tokens.emplace_back(TokenType::AND, "&", line, column);
                        position++;
                        column++;
                    }
                    break;
                    
                case '|':
                    if (position + 1 < input.length() && input[position + 1] == '|') {
                        tokens.emplace_back(TokenType::OR, "||", line, column);
                        position += 2;
                        column += 2;
                    } else {
                        tokens.emplace_back(TokenType::PIPE, "|", line, column);
                        position++;
                        column++;
                    }
                    break;
                    
                case '(':
                    tokens.emplace_back(TokenType::LEFT_PAREN, "(", line, column);
                    position++;
                    column++;
                    break;
                    
                case ')':
                    tokens.emplace_back(TokenType::RIGHT_PAREN, ")", line, column);
                    position++;
                    column++;
                    break;
                    
                case '{':
                    tokens.emplace_back(TokenType::LEFT_BRACE, "{", line, column);
                    position++;
                    column++;
                    break;
                    
                case '}':
                    tokens.emplace_back(TokenType::RIGHT_BRACE, "}", line, column);
                    position++;
                    column++;
                    break;
                    
                case '[':
                    tokens.emplace_back(TokenType::LEFT_BRACKET, "[", line, column);
                    position++;
                    column++;
                    break;
                    
                case ']':
                    tokens.emplace_back(TokenType::RIGHT_BRACKET, "]", line, column);
                    position++;
                    column++;
                    break;
                    
                case ';':
                    tokens.emplace_back(TokenType::SEMICOLON, ";", line, column);
                    position++;
                    column++;
                    break;
                    
                case ',':
                    tokens.emplace_back(TokenType::COMMA, ",", line, column);
                    position++;
                    column++;
                    break;
                    
                case '.':
                    tokens.emplace_back(TokenType::DOT, ".", line, column);
                    position++;
                    column++;
                    break;
                    
                case ':':
                    tokens.emplace_back(TokenType::COLON, ":", line, column);
                    position++;
                    column++;
                    break;
                    
                case '?':
                    tokens.emplace_back(TokenType::QUESTION, "?", line, column);
                    position++;
                    column++;
                    break;
                    
                default:
                    // Unknown character
                    position++;
                    column++;
                    break;
            }
        }
        
        tokens.emplace_back(TokenType::EOF_TOKEN, "", line, column);
        return tokens;
    }
    
private:
    Token readLineComment() {
        size_t start = position;
        while (position < input.length() && input[position] != '\n') {
            position++;
        }
        std::string value = input.substr(start, position - start);
        Token token(TokenType::COMMENT, value, line, column);
        column += value.length();
        return token;
    }
    
    Token readBlockComment() {
        size_t start = position;
        position += 2; // Skip /*
        column += 2;
        
        while (position < input.length() - 1) {
            if (input[position] == '*' && input[position + 1] == '/') {
                position += 2;
                column += 2;
                break;
            }
            if (input[position] == '\n') {
                line++;
                column = 1;
            } else {
                column++;
            }
            position++;
        }
        
        std::string value = input.substr(start, position - start);
        Token token(TokenType::COMMENT, value, line, column);
        return token;
    }
    
    Token readString() {
        char quote = input[position];
        position++;
        column++;
        
        size_t start = position;
        while (position < input.length() && input[position] != quote) {
            if (input[position] == '\\' && position + 1 < input.length()) {
                position += 2;
                column += 2;
            } else {
                position++;
                column++;
            }
        }
        
        if (position < input.length()) {
            position++;
            column++;
        }
        
        std::string value = input.substr(start, position - start - 1);
        Token token(TokenType::STRING, value, line, column);
        return token;
    }
    
    Token readTemplateLiteral() {
        position++; // Skip `
        column++;
        
        size_t start = position;
        while (position < input.length() && input[position] != '`') {
            if (input[position] == '\\' && position + 1 < input.length()) {
                position += 2;
                column += 2;
            } else {
                position++;
                column++;
            }
        }
        
        if (position < input.length()) {
            position++;
            column++;
        }
        
        std::string value = input.substr(start, position - start - 1);
        Token token(TokenType::TEMPLATE_LITERAL, value, line, column);
        return token;
    }
    
    Token readNumber() {
        size_t start = position;
        
        while (position < input.length() && (std::isdigit(input[position]) || input[position] == '.')) {
            position++;
            column++;
        }
        
        std::string value = input.substr(start, position - start);
        Token token(TokenType::NUMBER, value, line, column);
        return token;
    }
    
    Token readIdentifier() {
        size_t start = position;
        
        while (position < input.length() && (std::isalnum(input[position]) || input[position] == '_')) {
            position++;
            column++;
        }
        
        std::string value = input.substr(start, position - start);
        TokenType type = keywords.count(value) ? keywords[value] : TokenType::IDENTIFIER;
        Token token(type, value, line, column);
        return token;
    }
};

// ===================================
// PARSER
// ===================================

class Parser {
private:
    std::vector<Token> tokens;
    size_t current;
    
public:
    Parser(const std::vector<Token>& tokens) : tokens(tokens), current(0) {}
    
    std::unique_ptr<ProgramNode> parse() {
        auto program = std::make_unique<ProgramNode>();
        
        while (!isAtEnd()) {
            auto statement = parseStatement();
            if (statement) {
                program->statements.push_back(std::move(statement));
            }
        }
        
        return program;
    }
    
private:
    bool isAtEnd() {
        return current >= tokens.size() || tokens[current].type == TokenType::EOF_TOKEN;
    }
    
    Token peek() {
        if (isAtEnd()) return Token(TokenType::EOF_TOKEN, "", 0, 0);
        return tokens[current];
    }
    
    Token previous() {
        return tokens[current - 1];
    }
    
    Token advance() {
        if (!isAtEnd()) current++;
        return previous();
    }
    
    bool check(TokenType type) {
        if (isAtEnd()) return false;
        return tokens[current].type == type;
    }
    
    bool match(const std::vector<TokenType>& types) {
        for (TokenType type : types) {
            if (check(type)) {
                advance();
                return true;
            }
        }
        return false;
    }
    
    std::unique_ptr<ASTNode> parseStatement() {
        if (match({TokenType::PAGE})) {
            return parsePage();
        }
        if (match({TokenType::COMPONENT})) {
            return parseComponent();
        }
        if (match({TokenType::STYLE})) {
            return parseStyle();
        }
        if (match({TokenType::EVENT})) {
            return parseEvent();
        }
        if (match({TokenType::STATE})) {
            return parseState();
        }
        if (match({TokenType::API})) {
            return parseAPI();
        }
        if (match({TokenType::ROUTER})) {
            return parseRouter();
        }
        if (match({TokenType::LAYOUT})) {
            return parseLayout();
        }
        if (match({TokenType::ANIMATION})) {
            return parseAnimation();
        }
        if (match({TokenType::TYPE})) {
            return parseType();
        }
        if (match({TokenType::HOOK})) {
            return parseHook();
        }
        if (match({TokenType::PLUGIN})) {
            return parsePlugin();
        }
        if (match({TokenType::CONFIG})) {
            return parseConfig();
        }
        if (match({TokenType::IMPORT})) {
            return parseImport();
        }
        if (match({TokenType::EXPORT})) {
            return parseExport();
        }
        
        return nullptr;
    }
    
    std::unique_ptr<PageNode> parsePage() {
        auto page = std::make_unique<PageNode>();
        
        if (check(TokenType::IDENTIFIER)) {
            page->name = advance().value;
        }
        
        // Parse attributes
        while (!check(TokenType::LEFT_BRACE) && !isAtEnd()) {
            if (check(TokenType::IDENTIFIER)) {
                std::string key = advance().value;
                if (check(TokenType::ASSIGN)) {
                    advance(); // Skip =
                    if (check(TokenType::STRING)) {
                        page->attributes[key] = advance().value;
                    }
                }
            } else {
                advance();
            }
        }
        
        if (check(TokenType::LEFT_BRACE)) {
            advance(); // Skip {
            page->body = parseBlock();
            if (check(TokenType::RIGHT_BRACE)) {
                advance(); // Skip }
            }
        }
        
        return page;
    }
    
    std::unique_ptr<ComponentNode> parseComponent() {
        auto component = std::make_unique<ComponentNode>();
        
        if (check(TokenType::IDENTIFIER)) {
            component->name = advance().value;
        }
        
        // Parse type parameters
        if (check(TokenType::LESS)) {
            advance(); // Skip <
            while (!check(TokenType::GREATER) && !isAtEnd()) {
                if (check(TokenType::IDENTIFIER)) {
                    component->typeParams.push_back(advance().value);
                }
                if (check(TokenType::COMMA)) {
                    advance(); // Skip ,
                }
            }
            if (check(TokenType::GREATER)) {
                advance(); // Skip >
            }
        }
        
        if (check(TokenType::LEFT_BRACE)) {
            advance(); // Skip {
            component->body = parseBlock();
            if (check(TokenType::RIGHT_BRACE)) {
                advance(); // Skip }
            }
        }
        
        return component;
    }
    
    std::unique_ptr<StyleNode> parseStyle() {
        auto style = std::make_unique<StyleNode>();
        
        if (check(TokenType::IDENTIFIER)) {
            style->selector = advance().value;
        }
        
        if (check(TokenType::LEFT_BRACE)) {
            advance(); // Skip {
            style->rules = parseBlock();
            if (check(TokenType::RIGHT_BRACE)) {
                advance(); // Skip }
            }
        }
        
        return style;
    }
    
    std::unique_ptr<EventNode> parseEvent() {
        auto event = std::make_unique<EventNode>();
        
        if (check(TokenType::IDENTIFIER)) {
            event->eventType = advance().value;
        }
        
        if (check(TokenType::IDENTIFIER) && advance().value == "on") {
            if (check(TokenType::IDENTIFIER)) {
                event->target = advance().value;
            }
        }
        
        if (check(TokenType::LEFT_BRACE)) {
            advance(); // Skip {
            event->body = parseBlock();
            if (check(TokenType::RIGHT_BRACE)) {
                advance(); // Skip }
            }
        }
        
        return event;
    }
    
    std::unique_ptr<StateNode> parseState() {
        auto state = std::make_unique<StateNode>();
        
        if (check(TokenType::IDENTIFIER)) {
            state->name = advance().value;
        }
        
        if (check(TokenType::LEFT_BRACE)) {
            advance(); // Skip {
            state->properties = parseBlock();
            if (check(TokenType::RIGHT_BRACE)) {
                advance(); // Skip }
            }
        }
        
        return state;
    }
    
    std::unique_ptr<APINode> parseAPI() {
        auto api = std::make_unique<APINode>();
        
        if (check(TokenType::IDENTIFIER)) {
            api->name = advance().value;
        }
        
        if (check(TokenType::LEFT_BRACE)) {
            advance(); // Skip {
            api->methods = parseBlock();
            if (check(TokenType::RIGHT_BRACE)) {
                advance(); // Skip }
            }
        }
        
        return api;
    }
    
    std::unique_ptr<RouterNode> parseRouter() {
        auto router = std::make_unique<RouterNode>();
        
        if (check(TokenType::LEFT_BRACE)) {
            advance(); // Skip {
            router->routes = parseBlock();
            if (check(TokenType::RIGHT_BRACE)) {
                advance(); // Skip }
            }
        }
        
        return router;
    }
    
    std::unique_ptr<LayoutNode> parseLayout() {
        auto layout = std::make_unique<LayoutNode>();
        
        if (check(TokenType::IDENTIFIER)) {
            layout->name = advance().value;
        }
        
        if (check(TokenType::LEFT_BRACE)) {
            advance(); // Skip {
            layout->render = parseBlock();
            if (check(TokenType::RIGHT_BRACE)) {
                advance(); // Skip }
            }
        }
        
        return layout;
    }
    
    std::unique_ptr<AnimationNode> parseAnimation() {
        auto animation = std::make_unique<AnimationNode>();
        
        if (check(TokenType::IDENTIFIER)) {
            animation->name = advance().value;
        }
        
        if (check(TokenType::LEFT_BRACE)) {
            advance(); // Skip {
            animation->keyframes = parseBlock();
            if (check(TokenType::RIGHT_BRACE)) {
                advance(); // Skip }
            }
        }
        
        return animation;
    }
    
    std::unique_ptr<TypeNode> parseType() {
        auto type = std::make_unique<TypeNode>();
        
        if (check(TokenType::IDENTIFIER)) {
            type->name = advance().value;
        }
        
        if (check(TokenType::ASSIGN)) {
            advance(); // Skip =
            type->definition = parseExpression();
        }
        
        if (check(TokenType::SEMICOLON)) {
            advance(); // Skip ;
        }
        
        return type;
    }
    
    std::unique_ptr<HookNode> parseHook() {
        auto hook = std::make_unique<HookNode>();
        
        if (check(TokenType::IDENTIFIER)) {
            hook->name = advance().value;
        }
        
        if (check(TokenType::LEFT_PAREN)) {
            advance(); // Skip (
            hook->parameters = parseParameters();
            if (check(TokenType::RIGHT_PAREN)) {
                advance(); // Skip )
            }
        }
        
        if (check(TokenType::LEFT_BRACE)) {
            advance(); // Skip {
            hook->body = parseBlock();
            if (check(TokenType::RIGHT_BRACE)) {
                advance(); // Skip }
            }
        }
        
        return hook;
    }
    
    std::unique_ptr<PluginNode> parsePlugin() {
        auto plugin = std::make_unique<PluginNode>();
        
        if (check(TokenType::IDENTIFIER)) {
            plugin->name = advance().value;
        }
        
        if (check(TokenType::LEFT_BRACE)) {
            advance(); // Skip {
            // Parse properties
            if (check(TokenType::RIGHT_BRACE)) {
                advance(); // Skip }
            }
        }
        
        return plugin;
    }
    
    std::unique_ptr<ConfigNode> parseConfig() {
        auto config = std::make_unique<ConfigNode>();
        
        if (check(TokenType::LEFT_BRACE)) {
            advance(); // Skip {
            // Parse properties
            if (check(TokenType::RIGHT_BRACE)) {
                advance(); // Skip }
            }
        }
        
        return config;
    }
    
    std::unique_ptr<ImportNode> parseImport() {
        auto import = std::make_unique<ImportNode>();
        
        // Parse specifiers
        while (!check(TokenType::FROM) && !isAtEnd()) {
            if (check(TokenType::IDENTIFIER)) {
                import->specifiers.push_back(advance().value);
            }
            if (check(TokenType::COMMA)) {
                advance(); // Skip ,
            }
        }
        
        if (check(TokenType::FROM)) {
            advance(); // Skip from
            if (check(TokenType::STRING)) {
                import->source = advance().value;
            }
        }
        
        return import;
    }
    
    std::unique_ptr<ExportNode> parseExport() {
        auto exportNode = std::make_unique<ExportNode>();
        
        if (check(TokenType::DEFAULT)) {
            advance(); // Skip default
            exportNode->isDefault = true;
        }
        
        // Parse specifiers
        while (!check(TokenType::FROM) && !isAtEnd()) {
            if (check(TokenType::IDENTIFIER)) {
                exportNode->specifiers.push_back(advance().value);
            }
            if (check(TokenType::COMMA)) {
                advance(); // Skip ,
            }
        }
        
        if (check(TokenType::FROM)) {
            advance(); // Skip from
            if (check(TokenType::STRING)) {
                exportNode->source = advance().value;
            }
        }
        
        return exportNode;
    }
    
    std::vector<std::unique_ptr<ASTNode>> parseBlock() {
        std::vector<std::unique_ptr<ASTNode>> statements;
        
        while (!check(TokenType::RIGHT_BRACE) && !isAtEnd()) {
            auto statement = parseStatement();
            if (statement) {
                statements.push_back(std::move(statement));
            } else {
                advance(); // Skip unknown token
            }
        }
        
        return statements;
    }
    
    std::vector<std::unique_ptr<ASTNode>> parseParameters() {
        std::vector<std::unique_ptr<ASTNode>> parameters;
        
        while (!check(TokenType::RIGHT_PAREN) && !isAtEnd()) {
            if (check(TokenType::IDENTIFIER)) {
                // Parse parameter
                advance();
            }
            if (check(TokenType::COMMA)) {
                advance(); // Skip ,
            }
        }
        
        return parameters;
    }
    
    std::unique_ptr<ASTNode> parseExpression() {
        // Simplified expression parsing
        if (check(TokenType::IDENTIFIER)) {
            std::string expr = advance().value;
            return std::make_unique<ExpressionNode>(expr);
        }
        
        return nullptr;
    }
};

// ===================================
// AST VISITOR
// ===================================

class ASTVisitor {
public:
    virtual ~ASTVisitor() = default;
    virtual void visit(ProgramNode& node) = 0;
    virtual void visit(PageNode& node) = 0;
    virtual void visit(ComponentNode& node) = 0;
    virtual void visit(StyleNode& node) = 0;
    virtual void visit(EventNode& node) = 0;
    virtual void visit(StateNode& node) = 0;
    virtual void visit(APINode& node) = 0;
    virtual void visit(RouterNode& node) = 0;
    virtual void visit(RouteNode& node) = 0;
    virtual void visit(LayoutNode& node) = 0;
    virtual void visit(AnimationNode& node) = 0;
    virtual void visit(TypeNode& node) = 0;
    virtual void visit(HookNode& node) = 0;
    virtual void visit(PluginNode& node) = 0;
    virtual void visit(ConfigNode& node) = 0;
    virtual void visit(ImportNode& node) = 0;
    virtual void visit(ExportNode& node) = 0;
    virtual void visit(ElementNode& node) = 0;
    virtual void visit(TextNode& node) = 0;
    virtual void visit(ExpressionNode& node) = 0;
};

// ===================================
// CODE GENERATOR
// ===================================

class CodeGenerator : public ASTVisitor {
private:
    std::string htmlOutput;
    std::string cssOutput;
    std::string jsOutput;
    std::map<std::string, std::string> components;
    std::map<std::string, std::string> styles;
    std::map<std::string, std::string> scripts;
    
public:
    void visit(ProgramNode& node) override {
        for (auto& statement : node.statements) {
            statement->accept(*this);
        }
    }
    
    void visit(PageNode& node) override {
        htmlOutput += "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n";
        htmlOutput += "  <meta charset=\"UTF-8\">\n";
        htmlOutput += "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n";
        
        if (node.attributes.count("title")) {
            htmlOutput += "  <title>" + node.attributes["title"] + "</title>\n";
        }
        
        htmlOutput += "  <link rel=\"stylesheet\" href=\"css/theme.css\">\n";
        htmlOutput += "  <link rel=\"stylesheet\" href=\"css/emadocs.css\">\n";
        htmlOutput += "  <link rel=\"stylesheet\" href=\"styles.css\">\n";
        htmlOutput += "</head>\n<body>\n";
        
        for (auto& child : node.body) {
            child->accept(*this);
        }
        
        htmlOutput += "  <script src=\"js/emadocs.js\"></script>\n";
        htmlOutput += "  <script src=\"script.js\"></script>\n";
        htmlOutput += "</body>\n</html>";
    }
    
    void visit(ComponentNode& node) override {
        // Generate component CSS
        cssOutput += "/* " + node.name + " Component */\n";
        cssOutput += ".ema-" + toLowerCase(node.name) + " {\n";
        cssOutput += "  display: block;\n";
        cssOutput += "  position: relative;\n";
        cssOutput += "  box-sizing: border-box;\n";
        cssOutput += "}\n\n";
        
        // Generate component JavaScript
        jsOutput += "class Ema" + capitalize(node.name) + " extends HTMLElement {\n";
        jsOutput += "  constructor() {\n";
        jsOutput += "    super();\n";
        jsOutput += "    this.attachShadow({ mode: 'open' });\n";
        jsOutput += "  }\n\n";
        jsOutput += "  connectedCallback() {\n";
        jsOutput += "    this.render();\n";
        jsOutput += "    this.setupEventListeners();\n";
        jsOutput += "  }\n\n";
        jsOutput += "  render() {\n";
        jsOutput += "    this.shadowRoot.innerHTML = this.getTemplate();\n";
        jsOutput += "  }\n\n";
        jsOutput += "  getTemplate() {\n";
        jsOutput += "    return `\n";
        jsOutput += "      <div class=\"ema-" + toLowerCase(node.name) + "\">\n";
        jsOutput += "        <slot></slot>\n";
        jsOutput += "      </div>\n";
        jsOutput += "    `;\n";
        jsOutput += "  }\n\n";
        jsOutput += "  setupEventListeners() {\n";
        jsOutput += "    // Event listeners will be added here\n";
        jsOutput += "  }\n";
        jsOutput += "}\n\n";
        jsOutput += "customElements.define('ema-" + toLowerCase(node.name) + "', Ema" + capitalize(node.name) + ");\n";
    }
    
    void visit(StyleNode& node) override {
        cssOutput += "/* " + node.selector + " Styles */\n";
        cssOutput += "." + node.selector + " {\n";
        cssOutput += "  /* Styles will be generated here */\n";
        cssOutput += "}\n\n";
    }
    
    void visit(EventNode& node) override {
        jsOutput += "// Event: " + node.eventType + " on " + node.target + "\n";
        jsOutput += "document.addEventListener('" + node.eventType + "', (event) => {\n";
        jsOutput += "  // Event handler code\n";
        jsOutput += "});\n";
    }
    
    void visit(StateNode& node) override {
        jsOutput += "// State: " + node.name + "\n";
        jsOutput += "const " + node.name + " = {\n";
        jsOutput += "  // State properties will be generated here\n";
        jsOutput += "};\n";
    }
    
    void visit(APINode& node) override {
        jsOutput += "// API: " + node.name + "\n";
        jsOutput += "class " + node.name + " {\n";
        jsOutput += "  constructor() {\n";
        jsOutput += "    this.baseUrl = '';\n";
        jsOutput += "  }\n\n";
        jsOutput += "  // API methods will be generated here\n";
        jsOutput += "}\n";
    }
    
    void visit(RouterNode& node) override {
        jsOutput += "// Router\n";
        jsOutput += "class EmadocsRouter {\n";
        jsOutput += "  constructor() {\n";
        jsOutput += "    this.routes = new Map();\n";
        jsOutput += "    this.init();\n";
        jsOutput += "  }\n\n";
        jsOutput += "  init() {\n";
        jsOutput += "    window.addEventListener('popstate', () => this.handleRoute());\n";
        jsOutput += "    this.handleRoute();\n";
        jsOutput += "  }\n\n";
        jsOutput += "  handleRoute() {\n";
        jsOutput += "    const path = window.location.pathname;\n";
        jsOutput += "    // Route handling logic\n";
        jsOutput += "  }\n";
        jsOutput += "}\n";
    }
    
    void visit(RouteNode& node) override {
        // Route handling
    }
    
    void visit(LayoutNode& node) override {
        // Layout handling
    }
    
    void visit(AnimationNode& node) override {
        cssOutput += "@keyframes " + node.name + " {\n";
        cssOutput += "  /* Keyframes will be generated here */\n";
        cssOutput += "}\n\n";
    }
    
    void visit(TypeNode& node) override {
        jsOutput += "// Type: " + node.name + "\n";
        jsOutput += "// Type definition will be generated here\n";
    }
    
    void visit(HookNode& node) override {
        jsOutput += "function use" + capitalize(node.name) + "() {\n";
        jsOutput += "  // Hook implementation\n";
        jsOutput += "}\n";
    }
    
    void visit(PluginNode& node) override {
        jsOutput += "class " + node.name + " {\n";
        jsOutput += "  constructor() {\n";
        jsOutput += "    // Plugin initialization\n";
        jsOutput += "  }\n";
        jsOutput += "}\n";
    }
    
    void visit(ConfigNode& node) override {
        jsOutput += "const config = {\n";
        jsOutput += "  // Configuration will be generated here\n";
        jsOutput += "};\n";
    }
    
    void visit(ImportNode& node) override {
        jsOutput += "import ";
        if (node.specifiers.size() == 1) {
            jsOutput += node.specifiers[0];
        } else {
            jsOutput += "{ " + join(node.specifiers, ", ") + " }";
        }
        if (!node.source.empty()) {
            jsOutput += " from '" + node.source + "'";
        }
        jsOutput += ";\n";
    }
    
    void visit(ExportNode& node) override {
        jsOutput += "export ";
        if (node.isDefault) {
            jsOutput += "default ";
        }
        if (node.specifiers.size() == 1) {
            jsOutput += node.specifiers[0];
        } else {
            jsOutput += "{ " + join(node.specifiers, ", ") + " }";
        }
        if (!node.source.empty()) {
            jsOutput += " from '" + node.source + "'";
        }
        jsOutput += ";\n";
    }
    
    void visit(ElementNode& node) override {
        // Element handling
    }
    
    void visit(TextNode& node) override {
        // Text handling
    }
    
    void visit(ExpressionNode& node) override {
        // Expression handling
    }
    
    std::string getHTML() const { return htmlOutput; }
    std::string getCSS() const { return cssOutput; }
    std::string getJS() const { return jsOutput; }
    
private:
    std::string toLowerCase(const std::string& str) {
        std::string result = str;
        std::transform(result.begin(), result.end(), result.begin(), ::tolower);
        return result;
    }
    
    std::string capitalize(const std::string& str) {
        if (str.empty()) return str;
        std::string result = str;
        result[0] = std::toupper(result[0]);
        return result;
    }
    
    std::string join(const std::vector<std::string>& vec, const std::string& delimiter) {
        if (vec.empty()) return "";
        std::string result = vec[0];
        for (size_t i = 1; i < vec.size(); ++i) {
            result += delimiter + vec[i];
        }
        return result;
    }
};

// ===================================
// COMPILER MAIN CLASS
// ===================================

class EmadocsCompiler {
private:
    std::string input;
    std::string filename;
    bool minify;
    bool sourcemap;
    bool treeshaking;
    
public:
    EmadocsCompiler(const std::string& input, const std::string& filename = "main.ema")
        : input(input), filename(filename), minify(false), sourcemap(false), treeshaking(true) {}
    
    struct CompileResult {
        bool success;
        std::string html;
        std::string css;
        std::string js;
        std::vector<std::string> errors;
        std::vector<std::string> warnings;
        double compileTime;
    };
    
    CompileResult compile() {
        auto startTime = std::chrono::high_resolution_clock::now();
        CompileResult result;
        
        try {
            // Tokenize
            Lexer lexer(input);
            auto tokens = lexer.tokenize();
            
            // Parse
            Parser parser(tokens);
            auto ast = parser.parse();
            
            // Generate code
            CodeGenerator generator;
            ast->accept(generator);
            
            result.html = generator.getHTML();
            result.css = generator.getCSS();
            result.js = generator.getJS();
            result.success = true;
            
        } catch (const std::exception& e) {
            result.success = false;
            result.errors.push_back(e.what());
        }
        
        auto endTime = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::microseconds>(endTime - startTime);
        result.compileTime = duration.count() / 1000.0; // Convert to milliseconds
        
        return result;
    }
    
    void setMinify(bool value) { minify = value; }
    void setSourcemap(bool value) { sourcemap = value; }
    void setTreeshaking(bool value) { treeshaking = value; }
};

} // namespace EmadocsCompiler

// ===================================
// MAIN FUNCTION
// ===================================

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: " << argv[0] << " <input.ema> [output_dir]" << std::endl;
        return 1;
    }
    
    std::string inputFile = argv[1];
    std::string outputDir = argc > 2 ? argv[2] : "dist";
    
    // Read input file
    std::ifstream file(inputFile);
    if (!file.is_open()) {
        std::cerr << "Error: Could not open file " << inputFile << std::endl;
        return 1;
    }
    
    std::string input((std::istreambuf_iterator<char>(file)),
                      std::istreambuf_iterator<char>());
    file.close();
    
    // Compile
    EmadocsCompiler::EmadocsCompiler compiler(input, inputFile);
    auto result = compiler.compile();
    
    if (!result.success) {
        std::cerr << "Compilation failed:" << std::endl;
        for (const auto& error : result.errors) {
            std::cerr << "  Error: " << error << std::endl;
        }
        return 1;
    }
    
    // Create output directory
    std::filesystem::create_directories(outputDir);
    std::filesystem::create_directories(outputDir + "/css");
    std::filesystem::create_directories(outputDir + "/js");
    
    // Write output files
    std::ofstream htmlFile(outputDir + "/index.html");
    htmlFile << result.html;
    htmlFile.close();
    
    std::ofstream cssFile(outputDir + "/styles.css");
    cssFile << result.css;
    cssFile.close();
    
    std::ofstream jsFile(outputDir + "/script.js");
    jsFile << result.js;
    jsFile.close();
    
    std::cout << "Compilation successful!" << std::endl;
    std::cout << "  HTML: " << outputDir << "/index.html" << std::endl;
    std::cout << "  CSS:  " << outputDir << "/styles.css" << std::endl;
    std::cout << "  JS:   " << outputDir << "/script.js" << std::endl;
    std::cout << "  Time: " << result.compileTime << "ms" << std::endl;
    
    return 0;
}
