/**
 * EMADOCS COMPILER - Rust Implementation
 * High-performance, memory-safe compiler for EmadocsLang (.ema files)
 * Compiles .ema files to optimized HTML, CSS, and JavaScript
 * 
 * @author Emadocs Framework Team
 * @version 1.0.0
 * @license MIT
 */

use std::collections::HashMap;
use std::fs;
use std::io::{self, Read, Write};
use std::path::Path;
use std::time::Instant;
use serde::{Deserialize, Serialize};
use regex::Regex;
use clap::{App, Arg};

// ===================================
// TOKEN DEFINITIONS
// ===================================

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum TokenType {
    // Keywords
    Page, Component, Style, Event, State, Api, Router, Route, Layout,
    Animation, Type, Hook, Plugin, Config, Import, Export, From, As,
    If, Else, For, While, Function, Async, Await, Return, Const, Let, Var,
    True, False, Null, Undefined, Class, Extends, Implements, Interface,
    Enum, Namespace, Render, Computed, Watch, Mounted, Unmounted,
    
    // Operators
    Assign, Equal, NotEqual, Less, Greater, LessEqual, GreaterEqual,
    Plus, Minus, Multiply, Divide, Modulo, And, Or, Not, Arrow,
    
    // Punctuation
    LeftParen, RightParen, LeftBrace, RightBrace, LeftBracket, RightBracket,
    Semicolon, Comma, Dot, Colon, Question, Pipe,
    
    // Tags
    OpeningTagStart, ClosingTagStart, TagEnd, SelfClosingTagEnd,
    
    // Literals
    Identifier, String, Number, TemplateLiteral,
    
    // Special
    Comment, Whitespace, Newline, Eof
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Token {
    pub token_type: TokenType,
    pub value: String,
    pub line: usize,
    pub column: usize,
}

impl Token {
    pub fn new(token_type: TokenType, value: String, line: usize, column: usize) -> Self {
        Self {
            token_type,
            value,
            line,
            column,
        }
    }
}

// ===================================
// AST NODE DEFINITIONS
// ===================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ASTNode {
    Program(Vec<ASTNode>),
    Page {
        name: String,
        attributes: HashMap<String, String>,
        body: Vec<ASTNode>,
    },
    Component {
        name: String,
        type_params: Vec<String>,
        props: Vec<ASTNode>,
        events: Vec<ASTNode>,
        state: Vec<ASTNode>,
        methods: Vec<ASTNode>,
        render: Option<Box<ASTNode>>,
    },
    Style {
        selector: String,
        rules: Vec<ASTNode>,
    },
    Event {
        event_type: String,
        target: String,
        body: Vec<ASTNode>,
    },
    State {
        name: String,
        properties: Vec<ASTNode>,
    },
    Api {
        name: String,
        properties: HashMap<String, String>,
        methods: Vec<ASTNode>,
    },
    Router {
        routes: Vec<ASTNode>,
    },
    Route {
        path: String,
        component: String,
        options: HashMap<String, String>,
    },
    Layout {
        name: String,
        render: Option<Box<ASTNode>>,
    },
    Animation {
        name: String,
        keyframes: Vec<ASTNode>,
    },
    Type {
        name: String,
        definition: Option<Box<ASTNode>>,
    },
    Hook {
        name: String,
        parameters: Vec<ASTNode>,
        body: Vec<ASTNode>,
    },
    Plugin {
        name: String,
        properties: HashMap<String, String>,
    },
    Config {
        properties: HashMap<String, String>,
    },
    Import {
        specifiers: Vec<String>,
        source: String,
    },
    Export {
        specifiers: Vec<String>,
        source: String,
        is_default: bool,
    },
    Element {
        tag_name: String,
        attributes: HashMap<String, String>,
        children: Vec<ASTNode>,
        self_closing: bool,
    },
    Text {
        value: String,
    },
    Expression {
        expression: String,
    },
}

// ===================================
// LEXER
// ===================================

pub struct Lexer {
    input: String,
    position: usize,
    line: usize,
    column: usize,
    keywords: HashMap<String, TokenType>,
}

impl Lexer {
    pub fn new(input: String) -> Self {
        let mut keywords = HashMap::new();
        keywords.insert("page".to_string(), TokenType::Page);
        keywords.insert("component".to_string(), TokenType::Component);
        keywords.insert("style".to_string(), TokenType::Style);
        keywords.insert("event".to_string(), TokenType::Event);
        keywords.insert("state".to_string(), TokenType::State);
        keywords.insert("api".to_string(), TokenType::Api);
        keywords.insert("router".to_string(), TokenType::Router);
        keywords.insert("route".to_string(), TokenType::Route);
        keywords.insert("layout".to_string(), TokenType::Layout);
        keywords.insert("animation".to_string(), TokenType::Animation);
        keywords.insert("type".to_string(), TokenType::Type);
        keywords.insert("hook".to_string(), TokenType::Hook);
        keywords.insert("plugin".to_string(), TokenType::Plugin);
        keywords.insert("config".to_string(), TokenType::Config);
        keywords.insert("import".to_string(), TokenType::Import);
        keywords.insert("export".to_string(), TokenType::Export);
        keywords.insert("from".to_string(), TokenType::From);
        keywords.insert("as".to_string(), TokenType::As);
        keywords.insert("if".to_string(), TokenType::If);
        keywords.insert("else".to_string(), TokenType::Else);
        keywords.insert("for".to_string(), TokenType::For);
        keywords.insert("while".to_string(), TokenType::While);
        keywords.insert("function".to_string(), TokenType::Function);
        keywords.insert("async".to_string(), TokenType::Async);
        keywords.insert("await".to_string(), TokenType::Await);
        keywords.insert("return".to_string(), TokenType::Return);
        keywords.insert("const".to_string(), TokenType::Const);
        keywords.insert("let".to_string(), TokenType::Let);
        keywords.insert("var".to_string(), TokenType::Var);
        keywords.insert("true".to_string(), TokenType::True);
        keywords.insert("false".to_string(), TokenType::False);
        keywords.insert("null".to_string(), TokenType::Null);
        keywords.insert("undefined".to_string(), TokenType::Undefined);
        keywords.insert("class".to_string(), TokenType::Class);
        keywords.insert("extends".to_string(), TokenType::Extends);
        keywords.insert("implements".to_string(), TokenType::Implements);
        keywords.insert("interface".to_string(), TokenType::Interface);
        keywords.insert("enum".to_string(), TokenType::Enum);
        keywords.insert("namespace".to_string(), TokenType::Namespace);
        keywords.insert("render".to_string(), TokenType::Render);
        keywords.insert("computed".to_string(), TokenType::Computed);
        keywords.insert("watch".to_string(), TokenType::Watch);
        keywords.insert("mounted".to_string(), TokenType::Mounted);
        keywords.insert("unmounted".to_string(), TokenType::Unmounted);

        Self {
            input,
            position: 0,
            line: 1,
            column: 1,
            keywords,
        }
    }

    pub fn tokenize(&mut self) -> Result<Vec<Token>, String> {
        let mut tokens = Vec::new();

        while self.position < self.input.len() {
            let current = self.input.chars().nth(self.position).unwrap();

            if current.is_whitespace() {
                if current == '\n' {
                    tokens.push(Token::new(TokenType::Newline, "\n".to_string(), self.line, self.column));
                    self.line += 1;
                    self.column = 1;
                } else {
                    tokens.push(Token::new(TokenType::Whitespace, current.to_string(), self.line, self.column));
                    self.column += 1;
                }
                self.position += 1;
                continue;
            }

            // Comments
            if current == '/' && self.position + 1 < self.input.len() {
                let next = self.input.chars().nth(self.position + 1).unwrap();
                if next == '/' {
                    tokens.push(self.read_line_comment()?);
                    continue;
                } else if next == '*' {
                    tokens.push(self.read_block_comment()?);
                    continue;
                }
            }

            // Strings
            if current == '"' || current == '\'' {
                tokens.push(self.read_string()?);
                continue;
            }

            // Template literals
            if current == '`' {
                tokens.push(self.read_template_literal()?);
                continue;
            }

            // Numbers
            if current.is_ascii_digit() {
                tokens.push(self.read_number()?);
                continue;
            }

            // Identifiers and keywords
            if current.is_alphabetic() || current == '_' {
                tokens.push(self.read_identifier()?);
                continue;
            }

            // Operators and punctuation
            match current {
                '=' => {
                    if self.position + 1 < self.input.len() && self.input.chars().nth(self.position + 1).unwrap() == '=' {
                        tokens.push(Token::new(TokenType::Equal, "==".to_string(), self.line, self.column));
                        self.position += 2;
                        self.column += 2;
                    } else if self.position + 1 < self.input.len() && self.input.chars().nth(self.position + 1).unwrap() == '>' {
                        tokens.push(Token::new(TokenType::Arrow, "=>".to_string(), self.line, self.column));
                        self.position += 2;
                        self.column += 2;
                    } else {
                        tokens.push(Token::new(TokenType::Assign, "=".to_string(), self.line, self.column));
                        self.position += 1;
                        self.column += 1;
                    }
                }
                '!' => {
                    if self.position + 1 < self.input.len() && self.input.chars().nth(self.position + 1).unwrap() == '=' {
                        tokens.push(Token::new(TokenType::NotEqual, "!=".to_string(), self.line, self.column));
                        self.position += 2;
                        self.column += 2;
                    } else {
                        tokens.push(Token::new(TokenType::Not, "!".to_string(), self.line, self.column));
                        self.position += 1;
                        self.column += 1;
                    }
                }
                '<' => {
                    if self.position + 1 < self.input.len() && self.input.chars().nth(self.position + 1).unwrap() == '/' {
                        tokens.push(Token::new(TokenType::ClosingTagStart, "</".to_string(), self.line, self.column));
                        self.position += 2;
                        self.column += 2;
                    } else if self.position + 1 < self.input.len() && self.input.chars().nth(self.position + 1).unwrap() == '=' {
                        tokens.push(Token::new(TokenType::LessEqual, "<=".to_string(), self.line, self.column));
                        self.position += 2;
                        self.column += 2;
                    } else {
                        tokens.push(Token::new(TokenType::OpeningTagStart, "<".to_string(), self.line, self.column));
                        self.position += 1;
                        self.column += 1;
                    }
                }
                '>' => {
                    if self.position + 1 < self.input.len() && self.input.chars().nth(self.position + 1).unwrap() == '=' {
                        tokens.push(Token::new(TokenType::GreaterEqual, ">=".to_string(), self.line, self.column));
                        self.position += 2;
                        self.column += 2;
                    } else {
                        tokens.push(Token::new(TokenType::TagEnd, ">".to_string(), self.line, self.column));
                        self.position += 1;
                        self.column += 1;
                    }
                }
                '+' => {
                    tokens.push(Token::new(TokenType::Plus, "+".to_string(), self.line, self.column));
                    self.position += 1;
                    self.column += 1;
                }
                '-' => {
                    tokens.push(Token::new(TokenType::Minus, "-".to_string(), self.line, self.column));
                    self.position += 1;
                    self.column += 1;
                }
                '*' => {
                    tokens.push(Token::new(TokenType::Multiply, "*".to_string(), self.line, self.column));
                    self.position += 1;
                    self.column += 1;
                }
                '/' => {
                    tokens.push(Token::new(TokenType::Divide, "/".to_string(), self.line, self.column));
                    self.position += 1;
                    self.column += 1;
                }
                '%' => {
                    tokens.push(Token::new(TokenType::Modulo, "%".to_string(), self.line, self.column));
                    self.position += 1;
                    self.column += 1;
                }
                '&' => {
                    if self.position + 1 < self.input.len() && self.input.chars().nth(self.position + 1).unwrap() == '&' {
                        tokens.push(Token::new(TokenType::And, "&&".to_string(), self.line, self.column));
                        self.position += 2;
                        self.column += 2;
                    } else {
                        tokens.push(Token::new(TokenType::And, "&".to_string(), self.line, self.column));
                        self.position += 1;
                        self.column += 1;
                    }
                }
                '|' => {
                    if self.position + 1 < self.input.len() && self.input.chars().nth(self.position + 1).unwrap() == '|' {
                        tokens.push(Token::new(TokenType::Or, "||".to_string(), self.line, self.column));
                        self.position += 2;
                        self.column += 2;
                    } else {
                        tokens.push(Token::new(TokenType::Pipe, "|".to_string(), self.line, self.column));
                        self.position += 1;
                        self.column += 1;
                    }
                }
                '(' => {
                    tokens.push(Token::new(TokenType::LeftParen, "(".to_string(), self.line, self.column));
                    self.position += 1;
                    self.column += 1;
                }
                ')' => {
                    tokens.push(Token::new(TokenType::RightParen, ")".to_string(), self.line, self.column));
                    self.position += 1;
                    self.column += 1;
                }
                '{' => {
                    tokens.push(Token::new(TokenType::LeftBrace, "{".to_string(), self.line, self.column));
                    self.position += 1;
                    self.column += 1;
                }
                '}' => {
                    tokens.push(Token::new(TokenType::RightBrace, "}".to_string(), self.line, self.column));
                    self.position += 1;
                    self.column += 1;
                }
                '[' => {
                    tokens.push(Token::new(TokenType::LeftBracket, "[".to_string(), self.line, self.column));
                    self.position += 1;
                    self.column += 1;
                }
                ']' => {
                    tokens.push(Token::new(TokenType::RightBracket, "]".to_string(), self.line, self.column));
                    self.position += 1;
                    self.column += 1;
                }
                ';' => {
                    tokens.push(Token::new(TokenType::Semicolon, ";".to_string(), self.line, self.column));
                    self.position += 1;
                    self.column += 1;
                }
                ',' => {
                    tokens.push(Token::new(TokenType::Comma, ",".to_string(), self.line, self.column));
                    self.position += 1;
                    self.column += 1;
                }
                '.' => {
                    tokens.push(Token::new(TokenType::Dot, ".".to_string(), self.line, self.column));
                    self.position += 1;
                    self.column += 1;
                }
                ':' => {
                    tokens.push(Token::new(TokenType::Colon, ":".to_string(), self.line, self.column));
                    self.position += 1;
                    self.column += 1;
                }
                '?' => {
                    tokens.push(Token::new(TokenType::Question, "?".to_string(), self.line, self.column));
                    self.position += 1;
                    self.column += 1;
                }
                _ => {
                    // Unknown character, skip
                    self.position += 1;
                    self.column += 1;
                }
            }
        }

        tokens.push(Token::new(TokenType::Eof, "".to_string(), self.line, self.column));
        Ok(tokens)
    }

    fn read_line_comment(&mut self) -> Result<Token, String> {
        let start = self.position;
        while self.position < self.input.len() && self.input.chars().nth(self.position).unwrap() != '\n' {
            self.position += 1;
        }
        let value = self.input[start..self.position].to_string();
        let token = Token::new(TokenType::Comment, value, self.line, self.column);
        self.column += value.len();
        Ok(token)
    }

    fn read_block_comment(&mut self) -> Result<Token, String> {
        let start = self.position;
        self.position += 2; // Skip /*
        self.column += 2;

        while self.position < self.input.len() - 1 {
            if self.input.chars().nth(self.position).unwrap() == '*' 
                && self.input.chars().nth(self.position + 1).unwrap() == '/' {
                self.position += 2;
                self.column += 2;
                break;
            }
            if self.input.chars().nth(self.position).unwrap() == '\n' {
                self.line += 1;
                self.column = 1;
            } else {
                self.column += 1;
            }
            self.position += 1;
        }

        let value = self.input[start..self.position].to_string();
        Ok(Token::new(TokenType::Comment, value, self.line, self.column))
    }

    fn read_string(&mut self) -> Result<Token, String> {
        let quote = self.input.chars().nth(self.position).unwrap();
        self.position += 1;
        self.column += 1;

        let start = self.position;
        while self.position < self.input.len() && self.input.chars().nth(self.position).unwrap() != quote {
            if self.input.chars().nth(self.position).unwrap() == '\\' && self.position + 1 < self.input.len() {
                self.position += 2;
                self.column += 2;
            } else {
                self.position += 1;
                self.column += 1;
            }
        }

        if self.position < self.input.len() {
            self.position += 1;
            self.column += 1;
        }

        let value = self.input[start..self.position - 1].to_string();
        Ok(Token::new(TokenType::String, value, self.line, self.column))
    }

    fn read_template_literal(&mut self) -> Result<Token, String> {
        self.position += 1; // Skip `
        self.column += 1;

        let start = self.position;
        while self.position < self.input.len() && self.input.chars().nth(self.position).unwrap() != '`' {
            if self.input.chars().nth(self.position).unwrap() == '\\' && self.position + 1 < self.input.len() {
                self.position += 2;
                self.column += 2;
            } else {
                self.position += 1;
                self.column += 1;
            }
        }

        if self.position < self.input.len() {
            self.position += 1;
            self.column += 1;
        }

        let value = self.input[start..self.position - 1].to_string();
        Ok(Token::new(TokenType::TemplateLiteral, value, self.line, self.column))
    }

    fn read_number(&mut self) -> Result<Token, String> {
        let start = self.position;

        while self.position < self.input.len() 
            && (self.input.chars().nth(self.position).unwrap().is_ascii_digit() 
                || self.input.chars().nth(self.position).unwrap() == '.') {
            self.position += 1;
            self.column += 1;
        }

        let value = self.input[start..self.position].to_string();
        Ok(Token::new(TokenType::Number, value, self.line, self.column))
    }

    fn read_identifier(&mut self) -> Result<Token, String> {
        let start = self.position;

        while self.position < self.input.len() 
            && (self.input.chars().nth(self.position).unwrap().is_alphanumeric() 
                || self.input.chars().nth(self.position).unwrap() == '_') {
            self.position += 1;
            self.column += 1;
        }

        let value = self.input[start..self.position].to_string();
        let token_type = self.keywords.get(&value)
            .cloned()
            .unwrap_or(TokenType::Identifier);
        
        Ok(Token::new(token_type, value, self.line, self.column))
    }
}

// ===================================
// PARSER
// ===================================

pub struct Parser {
    tokens: Vec<Token>,
    current: usize,
}

impl Parser {
    pub fn new(tokens: Vec<Token>) -> Self {
        Self { tokens, current: 0 }
    }

    pub fn parse(&mut self) -> Result<ASTNode, String> {
        let mut statements = Vec::new();

        while !self.is_at_end() {
            if let Some(statement) = self.parse_statement()? {
                statements.push(statement);
            }
        }

        Ok(ASTNode::Program(statements))
    }

    fn is_at_end(&self) -> bool {
        self.current >= self.tokens.len() || self.tokens[self.current].token_type == TokenType::Eof
    }

    fn peek(&self) -> Option<&Token> {
        if self.is_at_end() {
            None
        } else {
            Some(&self.tokens[self.current])
        }
    }

    fn previous(&self) -> Option<&Token> {
        if self.current == 0 {
            None
        } else {
            Some(&self.tokens[self.current - 1])
        }
    }

    fn advance(&mut self) -> Option<&Token> {
        if !self.is_at_end() {
            self.current += 1;
        }
        self.previous()
    }

    fn check(&self, token_type: &TokenType) -> bool {
        if self.is_at_end() {
            false
        } else {
            self.tokens[self.current].token_type == *token_type
        }
    }

    fn match_tokens(&mut self, token_types: &[TokenType]) -> bool {
        for token_type in token_types {
            if self.check(token_type) {
                self.advance();
                return true;
            }
        }
        false
    }

    fn parse_statement(&mut self) -> Result<Option<ASTNode>, String> {
        if self.match_tokens(&[TokenType::Page]) {
            Ok(Some(self.parse_page()?))
        } else if self.match_tokens(&[TokenType::Component]) {
            Ok(Some(self.parse_component()?))
        } else if self.match_tokens(&[TokenType::Style]) {
            Ok(Some(self.parse_style()?))
        } else if self.match_tokens(&[TokenType::Event]) {
            Ok(Some(self.parse_event()?))
        } else if self.match_tokens(&[TokenType::State]) {
            Ok(Some(self.parse_state()?))
        } else if self.match_tokens(&[TokenType::Api]) {
            Ok(Some(self.parse_api()?))
        } else if self.match_tokens(&[TokenType::Router]) {
            Ok(Some(self.parse_router()?))
        } else if self.match_tokens(&[TokenType::Layout]) {
            Ok(Some(self.parse_layout()?))
        } else if self.match_tokens(&[TokenType::Animation]) {
            Ok(Some(self.parse_animation()?))
        } else if self.match_tokens(&[TokenType::Type]) {
            Ok(Some(self.parse_type()?))
        } else if self.match_tokens(&[TokenType::Hook]) {
            Ok(Some(self.parse_hook()?))
        } else if self.match_tokens(&[TokenType::Plugin]) {
            Ok(Some(self.parse_plugin()?))
        } else if self.match_tokens(&[TokenType::Config]) {
            Ok(Some(self.parse_config()?))
        } else if self.match_tokens(&[TokenType::Import]) {
            Ok(Some(self.parse_import()?))
        } else if self.match_tokens(&[TokenType::Export]) {
            Ok(Some(self.parse_export()?))
        } else {
            self.advance(); // Skip unknown token
            Ok(None)
        }
    }

    fn parse_page(&mut self) -> Result<ASTNode, String> {
        let mut name = String::new();
        let mut attributes = HashMap::new();

        if let Some(token) = self.peek() {
            if token.token_type == TokenType::Identifier {
                name = self.advance().unwrap().value.clone();
            }
        }

        // Parse attributes
        while !self.check(&TokenType::LeftBrace) && !self.is_at_end() {
            if let Some(token) = self.peek() {
                if token.token_type == TokenType::Identifier {
                    let key = self.advance().unwrap().value.clone();
                    if self.check(&TokenType::Assign) {
                        self.advance(); // Skip =
                        if let Some(token) = self.peek() {
                            if token.token_type == TokenType::String {
                                let value = self.advance().unwrap().value.clone();
                                attributes.insert(key, value);
                            }
                        }
                    }
                } else {
                    self.advance();
                }
            }
        }

        let mut body = Vec::new();
        if self.check(&TokenType::LeftBrace) {
            self.advance(); // Skip {
            body = self.parse_block()?;
            if self.check(&TokenType::RightBrace) {
                self.advance(); // Skip }
            }
        }

        Ok(ASTNode::Page {
            name,
            attributes,
            body,
        })
    }

    fn parse_component(&mut self) -> Result<ASTNode, String> {
        let mut name = String::new();
        let mut type_params = Vec::new();

        if let Some(token) = self.peek() {
            if token.token_type == TokenType::Identifier {
                name = self.advance().unwrap().value.clone();
            }
        }

        // Parse type parameters
        if self.check(&TokenType::Less) {
            self.advance(); // Skip <
            while !self.check(&TokenType::Greater) && !self.is_at_end() {
                if let Some(token) = self.peek() {
                    if token.token_type == TokenType::Identifier {
                        type_params.push(self.advance().unwrap().value.clone());
                    }
                }
                if self.check(&TokenType::Comma) {
                    self.advance(); // Skip ,
                }
            }
            if self.check(&TokenType::Greater) {
                self.advance(); // Skip >
            }
        }

        let mut body = Vec::new();
        if self.check(&TokenType::LeftBrace) {
            self.advance(); // Skip {
            body = self.parse_block()?;
            if self.check(&TokenType::RightBrace) {
                self.advance(); // Skip }
            }
        }

        Ok(ASTNode::Component {
            name,
            type_params,
            props: Vec::new(),
            events: Vec::new(),
            state: Vec::new(),
            methods: Vec::new(),
            render: None,
        })
    }

    fn parse_style(&mut self) -> Result<ASTNode, String> {
        let mut selector = String::new();

        if let Some(token) = self.peek() {
            if token.token_type == TokenType::Identifier {
                selector = self.advance().unwrap().value.clone();
            }
        }

        let mut rules = Vec::new();
        if self.check(&TokenType::LeftBrace) {
            self.advance(); // Skip {
            rules = self.parse_block()?;
            if self.check(&TokenType::RightBrace) {
                self.advance(); // Skip }
            }
        }

        Ok(ASTNode::Style { selector, rules })
    }

    fn parse_event(&mut self) -> Result<ASTNode, String> {
        let mut event_type = String::new();
        let mut target = String::new();

        if let Some(token) = self.peek() {
            if token.token_type == TokenType::Identifier {
                event_type = self.advance().unwrap().value.clone();
            }
        }

        if let Some(token) = self.peek() {
            if token.token_type == TokenType::Identifier && token.value == "on" {
                self.advance(); // Skip "on"
                if let Some(token) = self.peek() {
                    if token.token_type == TokenType::Identifier {
                        target = self.advance().unwrap().value.clone();
                    }
                }
            }
        }

        let mut body = Vec::new();
        if self.check(&TokenType::LeftBrace) {
            self.advance(); // Skip {
            body = self.parse_block()?;
            if self.check(&TokenType::RightBrace) {
                self.advance(); // Skip }
            }
        }

        Ok(ASTNode::Event {
            event_type,
            target,
            body,
        })
    }

    fn parse_state(&mut self) -> Result<ASTNode, String> {
        let mut name = String::new();

        if let Some(token) = self.peek() {
            if token.token_type == TokenType::Identifier {
                name = self.advance().unwrap().value.clone();
            }
        }

        let mut properties = Vec::new();
        if self.check(&TokenType::LeftBrace) {
            self.advance(); // Skip {
            properties = self.parse_block()?;
            if self.check(&TokenType::RightBrace) {
                self.advance(); // Skip }
            }
        }

        Ok(ASTNode::State { name, properties })
    }

    fn parse_api(&mut self) -> Result<ASTNode, String> {
        let mut name = String::new();

        if let Some(token) = self.peek() {
            if token.token_type == TokenType::Identifier {
                name = self.advance().unwrap().value.clone();
            }
        }

        let mut methods = Vec::new();
        if self.check(&TokenType::LeftBrace) {
            self.advance(); // Skip {
            methods = self.parse_block()?;
            if self.check(&TokenType::RightBrace) {
                self.advance(); // Skip }
            }
        }

        Ok(ASTNode::Api {
            name,
            properties: HashMap::new(),
            methods,
        })
    }

    fn parse_router(&mut self) -> Result<ASTNode, String> {
        let mut routes = Vec::new();
        if self.check(&TokenType::LeftBrace) {
            self.advance(); // Skip {
            routes = self.parse_block()?;
            if self.check(&TokenType::RightBrace) {
                self.advance(); // Skip }
            }
        }

        Ok(ASTNode::Router { routes })
    }

    fn parse_layout(&mut self) -> Result<ASTNode, String> {
        let mut name = String::new();

        if let Some(token) = self.peek() {
            if token.token_type == TokenType::Identifier {
                name = self.advance().unwrap().value.clone();
            }
        }

        let mut render = None;
        if self.check(&TokenType::LeftBrace) {
            self.advance(); // Skip {
            let body = self.parse_block()?;
            if !body.is_empty() {
                render = Some(Box::new(body[0].clone()));
            }
            if self.check(&TokenType::RightBrace) {
                self.advance(); // Skip }
            }
        }

        Ok(ASTNode::Layout { name, render })
    }

    fn parse_animation(&mut self) -> Result<ASTNode, String> {
        let mut name = String::new();

        if let Some(token) = self.peek() {
            if token.token_type == TokenType::Identifier {
                name = self.advance().unwrap().value.clone();
            }
        }

        let mut keyframes = Vec::new();
        if self.check(&TokenType::LeftBrace) {
            self.advance(); // Skip {
            keyframes = self.parse_block()?;
            if self.check(&TokenType::RightBrace) {
                self.advance(); // Skip }
            }
        }

        Ok(ASTNode::Animation { name, keyframes })
    }

    fn parse_type(&mut self) -> Result<ASTNode, String> {
        let mut name = String::new();

        if let Some(token) = self.peek() {
            if token.token_type == TokenType::Identifier {
                name = self.advance().unwrap().value.clone();
            }
        }

        let mut definition = None;
        if self.check(&TokenType::Assign) {
            self.advance(); // Skip =
            // Parse type definition
        }

        if self.check(&TokenType::Semicolon) {
            self.advance(); // Skip ;
        }

        Ok(ASTNode::Type { name, definition })
    }

    fn parse_hook(&mut self) -> Result<ASTNode, String> {
        let mut name = String::new();

        if let Some(token) = self.peek() {
            if token.token_type == TokenType::Identifier {
                name = self.advance().unwrap().value.clone();
            }
        }

        let mut parameters = Vec::new();
        if self.check(&TokenType::LeftParen) {
            self.advance(); // Skip (
            parameters = self.parse_parameters()?;
            if self.check(&TokenType::RightParen) {
                self.advance(); // Skip )
            }
        }

        let mut body = Vec::new();
        if self.check(&TokenType::LeftBrace) {
            self.advance(); // Skip {
            body = self.parse_block()?;
            if self.check(&TokenType::RightBrace) {
                self.advance(); // Skip }
            }
        }

        Ok(ASTNode::Hook {
            name,
            parameters,
            body,
        })
    }

    fn parse_plugin(&mut self) -> Result<ASTNode, String> {
        let mut name = String::new();

        if let Some(token) = self.peek() {
            if token.token_type == TokenType::Identifier {
                name = self.advance().unwrap().value.clone();
            }
        }

        if self.check(&TokenType::LeftBrace) {
            self.advance(); // Skip {
            // Parse properties
            if self.check(&TokenType::RightBrace) {
                self.advance(); // Skip }
            }
        }

        Ok(ASTNode::Plugin {
            name,
            properties: HashMap::new(),
        })
    }

    fn parse_config(&mut self) -> Result<ASTNode, String> {
        if self.check(&TokenType::LeftBrace) {
            self.advance(); // Skip {
            // Parse properties
            if self.check(&TokenType::RightBrace) {
                self.advance(); // Skip }
            }
        }

        Ok(ASTNode::Config {
            properties: HashMap::new(),
        })
    }

    fn parse_import(&mut self) -> Result<ASTNode, String> {
        let mut specifiers = Vec::new();

        // Parse specifiers
        while !self.check(&TokenType::From) && !self.is_at_end() {
            if let Some(token) = self.peek() {
                if token.token_type == TokenType::Identifier {
                    specifiers.push(self.advance().unwrap().value.clone());
                }
            }
            if self.check(&TokenType::Comma) {
                self.advance(); // Skip ,
            }
        }

        let mut source = String::new();
        if self.check(&TokenType::From) {
            self.advance(); // Skip from
            if let Some(token) = self.peek() {
                if token.token_type == TokenType::String {
                    source = self.advance().unwrap().value.clone();
                }
            }
        }

        Ok(ASTNode::Import { specifiers, source })
    }

    fn parse_export(&mut self) -> Result<ASTNode, String> {
        let mut is_default = false;
        if self.check(&TokenType::Identifier) {
            if let Some(token) = self.peek() {
                if token.value == "default" {
                    self.advance(); // Skip default
                    is_default = true;
                }
            }
        }

        let mut specifiers = Vec::new();
        // Parse specifiers
        while !self.check(&TokenType::From) && !self.is_at_end() {
            if let Some(token) = self.peek() {
                if token.token_type == TokenType::Identifier {
                    specifiers.push(self.advance().unwrap().value.clone());
                }
            }
            if self.check(&TokenType::Comma) {
                self.advance(); // Skip ,
            }
        }

        let mut source = String::new();
        if self.check(&TokenType::From) {
            self.advance(); // Skip from
            if let Some(token) = self.peek() {
                if token.token_type == TokenType::String {
                    source = self.advance().unwrap().value.clone();
                }
            }
        }

        Ok(ASTNode::Export {
            specifiers,
            source,
            is_default,
        })
    }

    fn parse_block(&mut self) -> Result<Vec<ASTNode>, String> {
        let mut statements = Vec::new();

        while !self.check(&TokenType::RightBrace) && !self.is_at_end() {
            if let Some(statement) = self.parse_statement()? {
                statements.push(statement);
            } else {
                self.advance(); // Skip unknown token
            }
        }

        Ok(statements)
    }

    fn parse_parameters(&mut self) -> Result<Vec<ASTNode>, String> {
        let mut parameters = Vec::new();

        while !self.check(&TokenType::RightParen) && !self.is_at_end() {
            if let Some(token) = self.peek() {
                if token.token_type == TokenType::Identifier {
                    // Parse parameter
                    self.advance();
                }
            }
            if self.check(&TokenType::Comma) {
                self.advance(); // Skip ,
            }
        }

        Ok(parameters)
    }
}

// ===================================
// CODE GENERATOR
// ===================================

pub struct CodeGenerator {
    html_output: String,
    css_output: String,
    js_output: String,
    components: HashMap<String, String>,
    styles: HashMap<String, String>,
    scripts: HashMap<String, String>,
}

impl CodeGenerator {
    pub fn new() -> Self {
        Self {
            html_output: String::new(),
            css_output: String::new(),
            js_output: String::new(),
            components: HashMap::new(),
            styles: HashMap::new(),
            scripts: HashMap::new(),
        }
    }

    pub fn generate(&mut self, ast: &ASTNode) -> Result<(), String> {
        self.visit_node(ast)?;
        Ok(())
    }

    fn visit_node(&mut self, node: &ASTNode) -> Result<(), String> {
        match node {
            ASTNode::Program(statements) => {
                for statement in statements {
                    self.visit_node(statement)?;
                }
            }
            ASTNode::Page { name, attributes, body } => {
                self.generate_page(name, attributes, body)?;
            }
            ASTNode::Component { name, type_params, .. } => {
                self.generate_component(name, type_params)?;
            }
            ASTNode::Style { selector, rules } => {
                self.generate_style(selector, rules)?;
            }
            ASTNode::Event { event_type, target, body } => {
                self.generate_event(event_type, target, body)?;
            }
            ASTNode::State { name, properties } => {
                self.generate_state(name, properties)?;
            }
            ASTNode::Api { name, methods } => {
                self.generate_api(name, methods)?;
            }
            ASTNode::Router { routes } => {
                self.generate_router(routes)?;
            }
            ASTNode::Layout { name, render } => {
                self.generate_layout(name, render)?;
            }
            ASTNode::Animation { name, keyframes } => {
                self.generate_animation(name, keyframes)?;
            }
            ASTNode::Type { name, definition } => {
                self.generate_type(name, definition)?;
            }
            ASTNode::Hook { name, parameters, body } => {
                self.generate_hook(name, parameters, body)?;
            }
            ASTNode::Plugin { name, properties } => {
                self.generate_plugin(name, properties)?;
            }
            ASTNode::Config { properties } => {
                self.generate_config(properties)?;
            }
            ASTNode::Import { specifiers, source } => {
                self.generate_import(specifiers, source)?;
            }
            ASTNode::Export { specifiers, source, is_default } => {
                self.generate_export(specifiers, source, *is_default)?;
            }
            _ => {
                // Handle other node types
            }
        }
        Ok(())
    }

    fn generate_page(&mut self, name: &str, attributes: &HashMap<String, String>, body: &[ASTNode]) -> Result<(), String> {
        self.html_output.push_str("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n");
        self.html_output.push_str("  <meta charset=\"UTF-8\">\n");
        self.html_output.push_str("  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n");
        
        if let Some(title) = attributes.get("title") {
            self.html_output.push_str(&format!("  <title>{}</title>\n", title));
        }
        
        self.html_output.push_str("  <link rel=\"stylesheet\" href=\"css/theme.css\">\n");
        self.html_output.push_str("  <link rel=\"stylesheet\" href=\"css/emadocs.css\">\n");
        self.html_output.push_str("  <link rel=\"stylesheet\" href=\"styles.css\">\n");
        self.html_output.push_str("</head>\n<body>\n");
        
        for child in body {
            self.visit_node(child)?;
        }
        
        self.html_output.push_str("  <script src=\"js/emadocs.js\"></script>\n");
        self.html_output.push_str("  <script src=\"script.js\"></script>\n");
        self.html_output.push_str("</body>\n</html>");
        
        Ok(())
    }

    fn generate_component(&mut self, name: &str, type_params: &[String]) -> Result<(), String> {
        // Generate component CSS
        self.css_output.push_str(&format!("/* {} Component */\n", name));
        self.css_output.push_str(&format!(".ema-{} {{\n", name.to_lowercase()));
        self.css_output.push_str("  display: block;\n");
        self.css_output.push_str("  position: relative;\n");
        self.css_output.push_str("  box-sizing: border-box;\n");
        self.css_output.push_str("}\n\n");
        
        // Generate component JavaScript
        self.js_output.push_str(&format!("class Ema{} extends HTMLElement {{\n", self.capitalize(name)));
        self.js_output.push_str("  constructor() {\n");
        self.js_output.push_str("    super();\n");
        self.js_output.push_str("    this.attachShadow({ mode: 'open' });\n");
        self.js_output.push_str("  }\n\n");
        self.js_output.push_str("  connectedCallback() {\n");
        self.js_output.push_str("    this.render();\n");
        self.js_output.push_str("    this.setupEventListeners();\n");
        self.js_output.push_str("  }\n\n");
        self.js_output.push_str("  render() {\n");
        self.js_output.push_str("    this.shadowRoot.innerHTML = this.getTemplate();\n");
        self.js_output.push_str("  }\n\n");
        self.js_output.push_str("  getTemplate() {\n");
        self.js_output.push_str("    return `\n");
        self.js_output.push_str(&format!("      <div class=\"ema-{}\">\n", name.to_lowercase()));
        self.js_output.push_str("        <slot></slot>\n");
        self.js_output.push_str("      </div>\n");
        self.js_output.push_str("    `;\n");
        self.js_output.push_str("  }\n\n");
        self.js_output.push_str("  setupEventListeners() {\n");
        self.js_output.push_str("    // Event listeners will be added here\n");
        self.js_output.push_str("  }\n");
        self.js_output.push_str("}\n\n");
        self.js_output.push_str(&format!("customElements.define('ema-{}', Ema{});\n", name.to_lowercase(), self.capitalize(name)));
        
        Ok(())
    }

    fn generate_style(&mut self, selector: &str, rules: &[ASTNode]) -> Result<(), String> {
        self.css_output.push_str(&format!("/* {} Styles */\n", selector));
        self.css_output.push_str(&format!(".{} {{\n", selector));
        self.css_output.push_str("  /* Styles will be generated here */\n");
        self.css_output.push_str("}\n\n");
        Ok(())
    }

    fn generate_event(&mut self, event_type: &str, target: &str, body: &[ASTNode]) -> Result<(), String> {
        self.js_output.push_str(&format!("// Event: {} on {}\n", event_type, target));
        self.js_output.push_str(&format!("document.addEventListener('{}', (event) => {{\n", event_type));
        self.js_output.push_str("  // Event handler code\n");
        self.js_output.push_str("});\n");
        Ok(())
    }

    fn generate_state(&mut self, name: &str, properties: &[ASTNode]) -> Result<(), String> {
        self.js_output.push_str(&format!("// State: {}\n", name));
        self.js_output.push_str(&format!("const {} = {{\n", name));
        self.js_output.push_str("  // State properties will be generated here\n");
        self.js_output.push_str("};\n");
        Ok(())
    }

    fn generate_api(&mut self, name: &str, methods: &[ASTNode]) -> Result<(), String> {
        self.js_output.push_str(&format!("// API: {}\n", name));
        self.js_output.push_str(&format!("class {} {{\n", name));
        self.js_output.push_str("  constructor() {\n");
        self.js_output.push_str("    this.baseUrl = '';\n");
        self.js_output.push_str("  }\n\n");
        self.js_output.push_str("  // API methods will be generated here\n");
        self.js_output.push_str("}\n");
        Ok(())
    }

    fn generate_router(&mut self, routes: &[ASTNode]) -> Result<(), String> {
        self.js_output.push_str("// Router\n");
        self.js_output.push_str("class EmadocsRouter {\n");
        self.js_output.push_str("  constructor() {\n");
        self.js_output.push_str("    this.routes = new Map();\n");
        self.js_output.push_str("    this.init();\n");
        self.js_output.push_str("  }\n\n");
        self.js_output.push_str("  init() {\n");
        self.js_output.push_str("    window.addEventListener('popstate', () => this.handleRoute());\n");
        self.js_output.push_str("    this.handleRoute();\n");
        self.js_output.push_str("  }\n\n");
        self.js_output.push_str("  handleRoute() {\n");
        self.js_output.push_str("    const path = window.location.pathname;\n");
        self.js_output.push_str("    // Route handling logic\n");
        self.js_output.push_str("  }\n");
        self.js_output.push_str("}\n");
        Ok(())
    }

    fn generate_layout(&mut self, name: &str, render: &Option<Box<ASTNode>>) -> Result<(), String> {
        self.js_output.push_str(&format!("// Layout: {}\n", name));
        self.js_output.push_str("// Layout implementation will be generated here\n");
        Ok(())
    }

    fn generate_animation(&mut self, name: &str, keyframes: &[ASTNode]) -> Result<(), String> {
        self.css_output.push_str(&format!("@keyframes {} {{\n", name));
        self.css_output.push_str("  /* Keyframes will be generated here */\n");
        self.css_output.push_str("}\n\n");
        Ok(())
    }

    fn generate_type(&mut self, name: &str, definition: &Option<Box<ASTNode>>) -> Result<(), String> {
        self.js_output.push_str(&format!("// Type: {}\n", name));
        self.js_output.push_str("// Type definition will be generated here\n");
        Ok(())
    }

    fn generate_hook(&mut self, name: &str, parameters: &[ASTNode], body: &[ASTNode]) -> Result<(), String> {
        self.js_output.push_str(&format!("function use{}() {{\n", self.capitalize(name)));
        self.js_output.push_str("  // Hook implementation\n");
        self.js_output.push_str("}\n");
        Ok(())
    }

    fn generate_plugin(&mut self, name: &str, properties: &HashMap<String, String>) -> Result<(), String> {
        self.js_output.push_str(&format!("class {} {{\n", name));
        self.js_output.push_str("  constructor() {\n");
        self.js_output.push_str("    // Plugin initialization\n");
        self.js_output.push_str("  }\n");
        self.js_output.push_str("}\n");
        Ok(())
    }

    fn generate_config(&mut self, properties: &HashMap<String, String>) -> Result<(), String> {
        self.js_output.push_str("const config = {\n");
        self.js_output.push_str("  // Configuration will be generated here\n");
        self.js_output.push_str("};\n");
        Ok(())
    }

    fn generate_import(&mut self, specifiers: &[String], source: &str) -> Result<(), String> {
        self.js_output.push_str("import ");
        if specifiers.len() == 1 {
            self.js_output.push_str(&specifiers[0]);
        } else {
            self.js_output.push_str("{ ");
            self.js_output.push_str(&specifiers.join(", "));
            self.js_output.push_str(" }");
        }
        if !source.is_empty() {
            self.js_output.push_str(&format!(" from '{}'", source));
        }
        self.js_output.push_str(";\n");
        Ok(())
    }

    fn generate_export(&mut self, specifiers: &[String], source: &str, is_default: bool) -> Result<(), String> {
        self.js_output.push_str("export ");
        if is_default {
            self.js_output.push_str("default ");
        }
        if specifiers.len() == 1 {
            self.js_output.push_str(&specifiers[0]);
        } else {
            self.js_output.push_str("{ ");
            self.js_output.push_str(&specifiers.join(", "));
            self.js_output.push_str(" }");
        }
        if !source.is_empty() {
            self.js_output.push_str(&format!(" from '{}'", source));
        }
        self.js_output.push_str(";\n");
        Ok(())
    }

    fn capitalize(&self, s: &str) -> String {
        let mut chars = s.chars();
        match chars.next() {
            None => String::new(),
            Some(first) => first.to_uppercase().collect::<String>() + chars.as_str(),
        }
    }

    pub fn get_html(&self) -> &str {
        &self.html_output
    }

    pub fn get_css(&self) -> &str {
        &self.css_output
    }

    pub fn get_js(&self) -> &str {
        &self.js_output
    }
}

// ===================================
// COMPILER MAIN CLASS
// ===================================

pub struct EmadocsCompiler {
    input: String,
    filename: String,
    minify: bool,
    sourcemap: bool,
    treeshaking: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CompileResult {
    pub success: bool,
    pub html: String,
    pub css: String,
    pub js: String,
    pub errors: Vec<String>,
    pub warnings: Vec<String>,
    pub compile_time: f64,
}

impl EmadocsCompiler {
    pub fn new(input: String, filename: String) -> Self {
        Self {
            input,
            filename,
            minify: false,
            sourcemap: false,
            treeshaking: true,
        }
    }

    pub fn compile(&self) -> CompileResult {
        let start_time = Instant::now();
        let mut result = CompileResult {
            success: false,
            html: String::new(),
            css: String::new(),
            js: String::new(),
            errors: Vec::new(),
            warnings: Vec::new(),
            compile_time: 0.0,
        };

        match self.compile_internal() {
            Ok((html, css, js)) => {
                result.success = true;
                result.html = html;
                result.css = css;
                result.js = js;
            }
            Err(e) => {
                result.errors.push(e);
            }
        }

        let duration = start_time.elapsed();
        result.compile_time = duration.as_millis() as f64;

        result
    }

    fn compile_internal(&self) -> Result<(String, String, String), String> {
        // Tokenize
        let mut lexer = Lexer::new(self.input.clone());
        let tokens = lexer.tokenize()?;

        // Parse
        let mut parser = Parser::new(tokens);
        let ast = parser.parse()?;

        // Generate code
        let mut generator = CodeGenerator::new();
        generator.generate(&ast)?;

        Ok((
            generator.get_html().to_string(),
            generator.get_css().to_string(),
            generator.get_js().to_string(),
        ))
    }

    pub fn set_minify(&mut self, value: bool) {
        self.minify = value;
    }

    pub fn set_sourcemap(&mut self, value: bool) {
        self.sourcemap = value;
    }

    pub fn set_treeshaking(&mut self, value: bool) {
        self.treeshaking = value;
    }
}

// ===================================
// MAIN FUNCTION
// ===================================

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let matches = App::new("Emadocs Compiler")
        .version("1.0.0")
        .author("Emadocs Framework Team")
        .about("High-performance compiler for EmadocsLang (.ema files)")
        .arg(
            Arg::with_name("input")
                .help("Input .ema file")
                .required(true)
                .index(1),
        )
        .arg(
            Arg::with_name("output")
                .help("Output directory")
                .short("o")
                .long("output")
                .default_value("dist"),
        )
        .arg(
            Arg::with_name("minify")
                .help("Minify output")
                .short("m")
                .long("minify")
                .takes_value(false),
        )
        .arg(
            Arg::with_name("sourcemap")
                .help("Generate source maps")
                .long("sourcemap")
                .takes_value(false),
        )
        .get_matches();

    let input_file = matches.value_of("input").unwrap();
    let output_dir = matches.value_of("output").unwrap();
    let minify = matches.is_present("minify");
    let sourcemap = matches.is_present("sourcemap");

    // Read input file
    let input = fs::read_to_string(input_file)?;

    // Compile
    let mut compiler = EmadocsCompiler::new(input, input_file.to_string());
    compiler.set_minify(minify);
    compiler.set_sourcemap(sourcemap);

    let result = compiler.compile();

    if !result.success {
        eprintln!("Compilation failed:");
        for error in &result.errors {
            eprintln!("  Error: {}", error);
        }
        return Err("Compilation failed".into());
    }

    // Create output directory
    fs::create_dir_all(output_dir)?;
    fs::create_dir_all(format!("{}/css", output_dir))?;
    fs::create_dir_all(format!("{}/js", output_dir))?;

    // Write output files
    fs::write(format!("{}/index.html", output_dir), &result.html)?;
    fs::write(format!("{}/styles.css", output_dir), &result.css)?;
    fs::write(format!("{}/script.js", output_dir), &result.js)?;

    println!("Compilation successful!");
    println!("  HTML: {}/index.html", output_dir);
    println!("  CSS:  {}/styles.css", output_dir);
    println!("  JS:   {}/script.js", output_dir);
    println!("  Time: {:.2}ms", result.compile_time);

    Ok(())
}
