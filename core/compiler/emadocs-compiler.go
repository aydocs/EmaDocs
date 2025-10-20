/**
 * EMADOCS COMPILER - Go Implementation
 * High-performance, concurrent compiler for EmadocsLang (.ema files)
 * Compiles .ema files to optimized HTML, CSS, and JavaScript
 * 
 * @author Emadocs Framework Team
 * @version 1.0.0
 * @license MIT
 */

package main

import (
	"bufio"
	"flag"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

// ===================================
// TOKEN DEFINITIONS
// ===================================

type TokenType int

const (
	// Keywords
	Page TokenType = iota
	Component
	Style
	Event
	State
	Api
	Router
	Route
	Layout
	Animation
	Type
	Hook
	Plugin
	Config
	Import
	Export
	From
	As
	If
	Else
	For
	While
	Function
	Async
	Await
	Return
	Const
	Let
	Var
	True
	False
	Null
	Undefined
	Class
	Extends
	Implements
	Interface
	Enum
	Namespace
	Render
	Computed
	Watch
	Mounted
	Unmounted

	// Operators
	Assign
	Equal
	NotEqual
	Less
	Greater
	LessEqual
	GreaterEqual
	Plus
	Minus
	Multiply
	Divide
	Modulo
	And
	Or
	Not
	Arrow

	// Punctuation
	LeftParen
	RightParen
	LeftBrace
	RightBrace
	LeftBracket
	RightBracket
	Semicolon
	Comma
	Dot
	Colon
	Question
	Pipe

	// Tags
	OpeningTagStart
	ClosingTagStart
	TagEnd
	SelfClosingTagEnd

	// Literals
	Identifier
	String
	Number
	TemplateLiteral

	// Special
	Comment
	Whitespace
	Newline
	EOF
)

type Token struct {
	Type     TokenType
	Value    string
	Line     int
	Column   int
}

func (t Token) String() string {
	return fmt.Sprintf("Token{Type: %d, Value: %s, Line: %d, Column: %d}", t.Type, t.Value, t.Line, t.Column)
}

// ===================================
// AST NODE DEFINITIONS
// ===================================

type ASTNode interface {
	String() string
	Accept(visitor ASTVisitor)
}

type ProgramNode struct {
	Statements []ASTNode
}

func (n *ProgramNode) String() string {
	return "Program"
}

func (n *ProgramNode) Accept(visitor ASTVisitor) {
	visitor.VisitProgram(n)
}

type PageNode struct {
	Name       string
	Attributes map[string]string
	Body       []ASTNode
}

func (n *PageNode) String() string {
	return fmt.Sprintf("Page: %s", n.Name)
}

func (n *PageNode) Accept(visitor ASTVisitor) {
	visitor.VisitPage(n)
}

type ComponentNode struct {
	Name       string
	TypeParams []string
	Props      []ASTNode
	Events     []ASTNode
	State      []ASTNode
	Methods    []ASTNode
	Render     ASTNode
}

func (n *ComponentNode) String() string {
	return fmt.Sprintf("Component: %s", n.Name)
}

func (n *ComponentNode) Accept(visitor ASTVisitor) {
	visitor.VisitComponent(n)
}

type StyleNode struct {
	Selector string
	Rules    []ASTNode
}

func (n *StyleNode) String() string {
	return fmt.Sprintf("Style: %s", n.Selector)
}

func (n *StyleNode) Accept(visitor ASTVisitor) {
	visitor.VisitStyle(n)
}

type EventNode struct {
	EventType string
	Target    string
	Body      []ASTNode
}

func (n *EventNode) String() string {
	return fmt.Sprintf("Event: %s on %s", n.EventType, n.Target)
}

func (n *EventNode) Accept(visitor ASTVisitor) {
	visitor.VisitEvent(n)
}

type StateNode struct {
	Name       string
	Properties []ASTNode
}

func (n *StateNode) String() string {
	return fmt.Sprintf("State: %s", n.Name)
}

func (n *StateNode) Accept(visitor ASTVisitor) {
	visitor.VisitState(n)
}

type ApiNode struct {
	Name       string
	Properties map[string]string
	Methods    []ASTNode
}

func (n *ApiNode) String() string {
	return fmt.Sprintf("API: %s", n.Name)
}

func (n *ApiNode) Accept(visitor ASTVisitor) {
	visitor.VisitApi(n)
}

type RouterNode struct {
	Routes []ASTNode
}

func (n *RouterNode) String() string {
	return "Router"
}

func (n *RouterNode) Accept(visitor ASTVisitor) {
	visitor.VisitRouter(n)
}

type RouteNode struct {
	Path      string
	Component string
	Options   map[string]string
}

func (n *RouteNode) String() string {
	return fmt.Sprintf("Route: %s -> %s", n.Path, n.Component)
}

func (n *RouteNode) Accept(visitor ASTVisitor) {
	visitor.VisitRoute(n)
}

type LayoutNode struct {
	Name   string
	Render ASTNode
}

func (n *LayoutNode) String() string {
	return fmt.Sprintf("Layout: %s", n.Name)
}

func (n *LayoutNode) Accept(visitor ASTVisitor) {
	visitor.VisitLayout(n)
}

type AnimationNode struct {
	Name      string
	Keyframes []ASTNode
}

func (n *AnimationNode) String() string {
	return fmt.Sprintf("Animation: %s", n.Name)
}

func (n *AnimationNode) Accept(visitor ASTVisitor) {
	visitor.VisitAnimation(n)
}

type TypeNode struct {
	Name       string
	Definition ASTNode
}

func (n *TypeNode) String() string {
	return fmt.Sprintf("Type: %s", n.Name)
}

func (n *TypeNode) Accept(visitor ASTVisitor) {
	visitor.VisitType(n)
}

type HookNode struct {
	Name       string
	Parameters []ASTNode
	Body       []ASTNode
}

func (n *HookNode) String() string {
	return fmt.Sprintf("Hook: %s", n.Name)
}

func (n *HookNode) Accept(visitor ASTVisitor) {
	visitor.VisitHook(n)
}

type PluginNode struct {
	Name       string
	Properties map[string]string
}

func (n *PluginNode) String() string {
	return fmt.Sprintf("Plugin: %s", n.Name)
}

func (n *PluginNode) Accept(visitor ASTVisitor) {
	visitor.VisitPlugin(n)
}

type ConfigNode struct {
	Properties map[string]string
}

func (n *ConfigNode) String() string {
	return "Config"
}

func (n *ConfigNode) Accept(visitor ASTVisitor) {
	visitor.VisitConfig(n)
}

type ImportNode struct {
	Specifiers []string
	Source     string
}

func (n *ImportNode) String() string {
	return fmt.Sprintf("Import from %s", n.Source)
}

func (n *ImportNode) Accept(visitor ASTVisitor) {
	visitor.VisitImport(n)
}

type ExportNode struct {
	Specifiers []string
	Source     string
	IsDefault  bool
}

func (n *ExportNode) String() string {
	if n.IsDefault {
		return "Export Default"
	}
	return "Export"
}

func (n *ExportNode) Accept(visitor ASTVisitor) {
	visitor.VisitExport(n)
}

type ElementNode struct {
	TagName     string
	Attributes  map[string]string
	Children    []ASTNode
	SelfClosing bool
}

func (n *ElementNode) String() string {
	return fmt.Sprintf("Element: %s", n.TagName)
}

func (n *ElementNode) Accept(visitor ASTVisitor) {
	visitor.VisitElement(n)
}

type TextNode struct {
	Value string
}

func (n *TextNode) String() string {
	return fmt.Sprintf("Text: %s", n.Value)
}

func (n *TextNode) Accept(visitor ASTVisitor) {
	visitor.VisitText(n)
}

type ExpressionNode struct {
	Expression string
}

func (n *ExpressionNode) String() string {
	return fmt.Sprintf("Expression: %s", n.Expression)
}

func (n *ExpressionNode) Accept(visitor ASTVisitor) {
	visitor.VisitExpression(n)
}

// ===================================
// LEXER
// ===================================

type Lexer struct {
	input    string
	position int
	line     int
	column   int
	keywords map[string]TokenType
}

func NewLexer(input string) *Lexer {
	keywords := map[string]TokenType{
		"page":       Page,
		"component":  Component,
		"style":      Style,
		"event":      Event,
		"state":      State,
		"api":        Api,
		"router":     Router,
		"route":      Route,
		"layout":     Layout,
		"animation":  Animation,
		"type":       Type,
		"hook":       Hook,
		"plugin":     Plugin,
		"config":     Config,
		"import":     Import,
		"export":     Export,
		"from":       From,
		"as":         As,
		"if":         If,
		"else":       Else,
		"for":        For,
		"while":      While,
		"function":   Function,
		"async":      Async,
		"await":      Await,
		"return":     Return,
		"const":      Const,
		"let":        Let,
		"var":        Var,
		"true":       True,
		"false":      False,
		"null":       Null,
		"undefined":  Undefined,
		"class":      Class,
		"extends":    Extends,
		"implements": Implements,
		"interface":  Interface,
		"enum":       Enum,
		"namespace":  Namespace,
		"render":     Render,
		"computed":   Computed,
		"watch":      Watch,
		"mounted":    Mounted,
		"unmounted":  Unmounted,
	}

	return &Lexer{
		input:    input,
		position: 0,
		line:     1,
		column:   1,
		keywords: keywords,
	}
}

func (l *Lexer) Tokenize() ([]Token, error) {
	var tokens []Token

	for l.position < len(l.input) {
		current := l.input[l.position]

		if isWhitespace(current) {
			if current == '\n' {
				tokens = append(tokens, Token{Type: Newline, Value: "\n", Line: l.line, Column: l.column})
				l.line++
				l.column = 1
			} else {
				tokens = append(tokens, Token{Type: Whitespace, Value: string(current), Line: l.line, Column: l.column})
				l.column++
			}
			l.position++
			continue
		}

		// Comments
		if current == '/' && l.position+1 < len(l.input) {
			next := l.input[l.position+1]
			if next == '/' {
				token, err := l.readLineComment()
				if err != nil {
					return nil, err
				}
				tokens = append(tokens, token)
				continue
			} else if next == '*' {
				token, err := l.readBlockComment()
				if err != nil {
					return nil, err
				}
				tokens = append(tokens, token)
				continue
			}
		}

		// Strings
		if current == '"' || current == '\'' {
			token, err := l.readString()
			if err != nil {
				return nil, err
			}
			tokens = append(tokens, token)
			continue
		}

		// Template literals
		if current == '`' {
			token, err := l.readTemplateLiteral()
			if err != nil {
				return nil, err
			}
			tokens = append(tokens, token)
			continue
		}

		// Numbers
		if isDigit(current) {
			token, err := l.readNumber()
			if err != nil {
				return nil, err
			}
			tokens = append(tokens, token)
			continue
		}

		// Identifiers and keywords
		if isAlpha(current) || current == '_' {
			token, err := l.readIdentifier()
			if err != nil {
				return nil, err
			}
			tokens = append(tokens, token)
			continue
		}

		// Operators and punctuation
		switch current {
		case '=':
			if l.position+1 < len(l.input) && l.input[l.position+1] == '=' {
				tokens = append(tokens, Token{Type: Equal, Value: "==", Line: l.line, Column: l.column})
				l.position += 2
				l.column += 2
			} else if l.position+1 < len(l.input) && l.input[l.position+1] == '>' {
				tokens = append(tokens, Token{Type: Arrow, Value: "=>", Line: l.line, Column: l.column})
				l.position += 2
				l.column += 2
			} else {
				tokens = append(tokens, Token{Type: Assign, Value: "=", Line: l.line, Column: l.column})
				l.position++
				l.column++
			}
		case '!':
			if l.position+1 < len(l.input) && l.input[l.position+1] == '=' {
				tokens = append(tokens, Token{Type: NotEqual, Value: "!=", Line: l.line, Column: l.column})
				l.position += 2
				l.column += 2
			} else {
				tokens = append(tokens, Token{Type: Not, Value: "!", Line: l.line, Column: l.column})
				l.position++
				l.column++
			}
		case '<':
			if l.position+1 < len(l.input) && l.input[l.position+1] == '/' {
				tokens = append(tokens, Token{Type: ClosingTagStart, Value: "</", Line: l.line, Column: l.column})
				l.position += 2
				l.column += 2
			} else if l.position+1 < len(l.input) && l.input[l.position+1] == '=' {
				tokens = append(tokens, Token{Type: LessEqual, Value: "<=", Line: l.line, Column: l.column})
				l.position += 2
				l.column += 2
			} else {
				tokens = append(tokens, Token{Type: OpeningTagStart, Value: "<", Line: l.line, Column: l.column})
				l.position++
				l.column++
			}
		case '>':
			if l.position+1 < len(l.input) && l.input[l.position+1] == '=' {
				tokens = append(tokens, Token{Type: GreaterEqual, Value: ">=", Line: l.line, Column: l.column})
				l.position += 2
				l.column += 2
			} else {
				tokens = append(tokens, Token{Type: TagEnd, Value: ">", Line: l.line, Column: l.column})
				l.position++
				l.column++
			}
		case '+':
			tokens = append(tokens, Token{Type: Plus, Value: "+", Line: l.line, Column: l.column})
			l.position++
			l.column++
		case '-':
			tokens = append(tokens, Token{Type: Minus, Value: "-", Line: l.line, Column: l.column})
			l.position++
			l.column++
		case '*':
			tokens = append(tokens, Token{Type: Multiply, Value: "*", Line: l.line, Column: l.column})
			l.position++
			l.column++
		case '/':
			tokens = append(tokens, Token{Type: Divide, Value: "/", Line: l.line, Column: l.column})
			l.position++
			l.column++
		case '%':
			tokens = append(tokens, Token{Type: Modulo, Value: "%", Line: l.line, Column: l.column})
			l.position++
			l.column++
		case '&':
			if l.position+1 < len(l.input) && l.input[l.position+1] == '&' {
				tokens = append(tokens, Token{Type: And, Value: "&&", Line: l.line, Column: l.column})
				l.position += 2
				l.column += 2
			} else {
				tokens = append(tokens, Token{Type: And, Value: "&", Line: l.line, Column: l.column})
				l.position++
				l.column++
			}
		case '|':
			if l.position+1 < len(l.input) && l.input[l.position+1] == '|' {
				tokens = append(tokens, Token{Type: Or, Value: "||", Line: l.line, Column: l.column})
				l.position += 2
				l.column += 2
			} else {
				tokens = append(tokens, Token{Type: Pipe, Value: "|", Line: l.line, Column: l.column})
				l.position++
				l.column++
			}
		case '(':
			tokens = append(tokens, Token{Type: LeftParen, Value: "(", Line: l.line, Column: l.column})
			l.position++
			l.column++
		case ')':
			tokens = append(tokens, Token{Type: RightParen, Value: ")", Line: l.line, Column: l.column})
			l.position++
			l.column++
		case '{':
			tokens = append(tokens, Token{Type: LeftBrace, Value: "{", Line: l.line, Column: l.column})
			l.position++
			l.column++
		case '}':
			tokens = append(tokens, Token{Type: RightBrace, Value: "}", Line: l.line, Column: l.column})
			l.position++
			l.column++
		case '[':
			tokens = append(tokens, Token{Type: LeftBracket, Value: "[", Line: l.line, Column: l.column})
			l.position++
			l.column++
		case ']':
			tokens = append(tokens, Token{Type: RightBracket, Value: "]", Line: l.line, Column: l.column})
			l.position++
			l.column++
		case ';':
			tokens = append(tokens, Token{Type: Semicolon, Value: ";", Line: l.line, Column: l.column})
			l.position++
			l.column++
		case ',':
			tokens = append(tokens, Token{Type: Comma, Value: ",", Line: l.line, Column: l.column})
			l.position++
			l.column++
		case '.':
			tokens = append(tokens, Token{Type: Dot, Value: ".", Line: l.line, Column: l.column})
			l.position++
			l.column++
		case ':':
			tokens = append(tokens, Token{Type: Colon, Value: ":", Line: l.line, Column: l.column})
			l.position++
			l.column++
		case '?':
			tokens = append(tokens, Token{Type: Question, Value: "?", Line: l.line, Column: l.column})
			l.position++
			l.column++
		default:
			// Unknown character, skip
			l.position++
			l.column++
		}
	}

	tokens = append(tokens, Token{Type: EOF, Value: "", Line: l.line, Column: l.column})
	return tokens, nil
}

func (l *Lexer) readLineComment() (Token, error) {
	start := l.position
	for l.position < len(l.input) && l.input[l.position] != '\n' {
		l.position++
	}
	value := l.input[start:l.position]
	token := Token{Type: Comment, Value: value, Line: l.line, Column: l.column}
	l.column += len(value)
	return token, nil
}

func (l *Lexer) readBlockComment() (Token, error) {
	start := l.position
	l.position += 2 // Skip /*
	l.column += 2

	for l.position < len(l.input)-1 {
		if l.input[l.position] == '*' && l.input[l.position+1] == '/' {
			l.position += 2
			l.column += 2
			break
		}
		if l.input[l.position] == '\n' {
			l.line++
			l.column = 1
		} else {
			l.column++
		}
		l.position++
	}

	value := l.input[start:l.position]
	return Token{Type: Comment, Value: value, Line: l.line, Column: l.column}, nil
}

func (l *Lexer) readString() (Token, error) {
	quote := l.input[l.position]
	l.position++
	l.column++

	start := l.position
	for l.position < len(l.input) && l.input[l.position] != quote {
		if l.input[l.position] == '\\' && l.position+1 < len(l.input) {
			l.position += 2
			l.column += 2
		} else {
			l.position++
			l.column++
		}
	}

	if l.position < len(l.input) {
		l.position++
		l.column++
	}

	value := l.input[start : l.position-1]
	return Token{Type: String, Value: value, Line: l.line, Column: l.column}, nil
}

func (l *Lexer) readTemplateLiteral() (Token, error) {
	l.position++ // Skip `
	l.column++

	start := l.position
	for l.position < len(l.input) && l.input[l.position] != '`' {
		if l.input[l.position] == '\\' && l.position+1 < len(l.input) {
			l.position += 2
			l.column += 2
		} else {
			l.position++
			l.column++
		}
	}

	if l.position < len(l.input) {
		l.position++
		l.column++
	}

	value := l.input[start : l.position-1]
	return Token{Type: TemplateLiteral, Value: value, Line: l.line, Column: l.column}, nil
}

func (l *Lexer) readNumber() (Token, error) {
	start := l.position

	for l.position < len(l.input) && (isDigit(l.input[l.position]) || l.input[l.position] == '.') {
		l.position++
		l.column++
	}

	value := l.input[start:l.position]
	return Token{Type: Number, Value: value, Line: l.line, Column: l.column}, nil
}

func (l *Lexer) readIdentifier() (Token, error) {
	start := l.position

	for l.position < len(l.input) && (isAlphaNumeric(l.input[l.position]) || l.input[l.position] == '_') {
		l.position++
		l.column++
	}

	value := l.input[start:l.position]
	tokenType, exists := l.keywords[value]
	if !exists {
		tokenType = Identifier
	}

	return Token{Type: tokenType, Value: value, Line: l.line, Column: l.column}, nil
}

// Helper functions
func isWhitespace(c byte) bool {
	return c == ' ' || c == '\t' || c == '\r' || c == '\n'
}

func isDigit(c byte) bool {
	return c >= '0' && c <= '9'
}

func isAlpha(c byte) bool {
	return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
}

func isAlphaNumeric(c byte) bool {
	return isAlpha(c) || isDigit(c)
}

// ===================================
// PARSER
// ===================================

type Parser struct {
	tokens  []Token
	current int
}

func NewParser(tokens []Token) *Parser {
	return &Parser{tokens: tokens, current: 0}
}

func (p *Parser) Parse() (ASTNode, error) {
	var statements []ASTNode

	for !p.isAtEnd() {
		statement, err := p.parseStatement()
		if err != nil {
			return nil, err
		}
		if statement != nil {
			statements = append(statements, statement)
		}
	}

	return &ProgramNode{Statements: statements}, nil
}

func (p *Parser) isAtEnd() bool {
	return p.current >= len(p.tokens) || p.tokens[p.current].Type == EOF
}

func (p *Parser) peek() *Token {
	if p.isAtEnd() {
		return nil
	}
	return &p.tokens[p.current]
}

func (p *Parser) previous() *Token {
	if p.current == 0 {
		return nil
	}
	return &p.tokens[p.current-1]
}

func (p *Parser) advance() *Token {
	if !p.isAtEnd() {
		p.current++
	}
	return p.previous()
}

func (p *Parser) check(tokenType TokenType) bool {
	if p.isAtEnd() {
		return false
	}
	return p.tokens[p.current].Type == tokenType
}

func (p *Parser) match(tokenTypes ...TokenType) bool {
	for _, tokenType := range tokenTypes {
		if p.check(tokenType) {
			p.advance()
			return true
		}
	}
	return false
}

func (p *Parser) parseStatement() (ASTNode, error) {
	if p.match(Page) {
		return p.parsePage()
	} else if p.match(Component) {
		return p.parseComponent()
	} else if p.match(Style) {
		return p.parseStyle()
	} else if p.match(Event) {
		return p.parseEvent()
	} else if p.match(State) {
		return p.parseState()
	} else if p.match(Api) {
		return p.parseApi()
	} else if p.match(Router) {
		return p.parseRouter()
	} else if p.match(Layout) {
		return p.parseLayout()
	} else if p.match(Animation) {
		return p.parseAnimation()
	} else if p.match(Type) {
		return p.parseType()
	} else if p.match(Hook) {
		return p.parseHook()
	} else if p.match(Plugin) {
		return p.parsePlugin()
	} else if p.match(Config) {
		return p.parseConfig()
	} else if p.match(Import) {
		return p.parseImport()
	} else if p.match(Export) {
		return p.parseExport()
	} else {
		p.advance() // Skip unknown token
		return nil, nil
	}
}

func (p *Parser) parsePage() (ASTNode, error) {
	name := ""
	attributes := make(map[string]string)

	if token := p.peek(); token != nil && token.Type == Identifier {
		name = p.advance().Value
	}

	// Parse attributes
	for !p.check(LeftBrace) && !p.isAtEnd() {
		if token := p.peek(); token != nil && token.Type == Identifier {
			key := p.advance().Value
			if p.check(Assign) {
				p.advance() // Skip =
				if token := p.peek(); token != nil && token.Type == String {
					value := p.advance().Value
					attributes[key] = value
				}
			}
		} else {
			p.advance()
		}
	}

	var body []ASTNode
	if p.check(LeftBrace) {
		p.advance() // Skip {
		body, _ = p.parseBlock()
		if p.check(RightBrace) {
			p.advance() // Skip }
		}
	}

	return &PageNode{
		Name:       name,
		Attributes: attributes,
		Body:       body,
	}, nil
}

func (p *Parser) parseComponent() (ASTNode, error) {
	name := ""
	var typeParams []string

	if token := p.peek(); token != nil && token.Type == Identifier {
		name = p.advance().Value
	}

	// Parse type parameters
	if p.check(Less) {
		p.advance() // Skip <
		for !p.check(Greater) && !p.isAtEnd() {
			if token := p.peek(); token != nil && token.Type == Identifier {
				typeParams = append(typeParams, p.advance().Value)
			}
			if p.check(Comma) {
				p.advance() // Skip ,
			}
		}
		if p.check(Greater) {
			p.advance() // Skip >
		}
	}

	var body []ASTNode
	if p.check(LeftBrace) {
		p.advance() // Skip {
		body, _ = p.parseBlock()
		if p.check(RightBrace) {
			p.advance() // Skip }
		}
	}

	return &ComponentNode{
		Name:       name,
		TypeParams: typeParams,
		Props:      []ASTNode{},
		Events:     []ASTNode{},
		State:      []ASTNode{},
		Methods:    []ASTNode{},
		Render:     nil,
	}, nil
}

func (p *Parser) parseStyle() (ASTNode, error) {
	selector := ""

	if token := p.peek(); token != nil && token.Type == Identifier {
		selector = p.advance().Value
	}

	var rules []ASTNode
	if p.check(LeftBrace) {
		p.advance() // Skip {
		rules, _ = p.parseBlock()
		if p.check(RightBrace) {
			p.advance() // Skip }
		}
	}

	return &StyleNode{
		Selector: selector,
		Rules:    rules,
	}, nil
}

func (p *Parser) parseEvent() (ASTNode, error) {
	eventType := ""
	target := ""

	if token := p.peek(); token != nil && token.Type == Identifier {
		eventType = p.advance().Value
	}

	if token := p.peek(); token != nil && token.Type == Identifier && token.Value == "on" {
		p.advance() // Skip "on"
		if token := p.peek(); token != nil && token.Type == Identifier {
			target = p.advance().Value
		}
	}

	var body []ASTNode
	if p.check(LeftBrace) {
		p.advance() // Skip {
		body, _ = p.parseBlock()
		if p.check(RightBrace) {
			p.advance() // Skip }
		}
	}

	return &EventNode{
		EventType: eventType,
		Target:    target,
		Body:      body,
	}, nil
}

func (p *Parser) parseState() (ASTNode, error) {
	name := ""

	if token := p.peek(); token != nil && token.Type == Identifier {
		name = p.advance().Value
	}

	var properties []ASTNode
	if p.check(LeftBrace) {
		p.advance() // Skip {
		properties, _ = p.parseBlock()
		if p.check(RightBrace) {
			p.advance() // Skip }
		}
	}

	return &StateNode{
		Name:       name,
		Properties: properties,
	}, nil
}

func (p *Parser) parseApi() (ASTNode, error) {
	name := ""

	if token := p.peek(); token != nil && token.Type == Identifier {
		name = p.advance().Value
	}

	var methods []ASTNode
	if p.check(LeftBrace) {
		p.advance() // Skip {
		methods, _ = p.parseBlock()
		if p.check(RightBrace) {
			p.advance() // Skip }
		}
	}

	return &ApiNode{
		Name:       name,
		Properties: make(map[string]string),
		Methods:    methods,
	}, nil
}

func (p *Parser) parseRouter() (ASTNode, error) {
	var routes []ASTNode
	if p.check(LeftBrace) {
		p.advance() // Skip {
		routes, _ = p.parseBlock()
		if p.check(RightBrace) {
			p.advance() // Skip }
		}
	}

	return &RouterNode{Routes: routes}, nil
}

func (p *Parser) parseLayout() (ASTNode, error) {
	name := ""

	if token := p.peek(); token != nil && token.Type == Identifier {
		name = p.advance().Value
	}

	var render ASTNode
	if p.check(LeftBrace) {
		p.advance() // Skip {
		body, _ := p.parseBlock()
		if len(body) > 0 {
			render = body[0]
		}
		if p.check(RightBrace) {
			p.advance() // Skip }
		}
	}

	return &LayoutNode{
		Name:   name,
		Render: render,
	}, nil
}

func (p *Parser) parseAnimation() (ASTNode, error) {
	name := ""

	if token := p.peek(); token != nil && token.Type == Identifier {
		name = p.advance().Value
	}

	var keyframes []ASTNode
	if p.check(LeftBrace) {
		p.advance() // Skip {
		keyframes, _ = p.parseBlock()
		if p.check(RightBrace) {
			p.advance() // Skip }
		}
	}

	return &AnimationNode{
		Name:      name,
		Keyframes: keyframes,
	}, nil
}

func (p *Parser) parseType() (ASTNode, error) {
	name := ""

	if token := p.peek(); token != nil && token.Type == Identifier {
		name = p.advance().Value
	}

	var definition ASTNode
	if p.check(Assign) {
		p.advance() // Skip =
		// Parse type definition
	}

	if p.check(Semicolon) {
		p.advance() // Skip ;
	}

	return &TypeNode{
		Name:       name,
		Definition: definition,
	}, nil
}

func (p *Parser) parseHook() (ASTNode, error) {
	name := ""

	if token := p.peek(); token != nil && token.Type == Identifier {
		name = p.advance().Value
	}

	var parameters []ASTNode
	if p.check(LeftParen) {
		p.advance() // Skip (
		parameters, _ = p.parseParameters()
		if p.check(RightParen) {
			p.advance() // Skip )
		}
	}

	var body []ASTNode
	if p.check(LeftBrace) {
		p.advance() // Skip {
		body, _ = p.parseBlock()
		if p.check(RightBrace) {
			p.advance() // Skip }
		}
	}

	return &HookNode{
		Name:       name,
		Parameters: parameters,
		Body:       body,
	}, nil
}

func (p *Parser) parsePlugin() (ASTNode, error) {
	name := ""

	if token := p.peek(); token != nil && token.Type == Identifier {
		name = p.advance().Value
	}

	if p.check(LeftBrace) {
		p.advance() // Skip {
		// Parse properties
		if p.check(RightBrace) {
			p.advance() // Skip }
		}
	}

	return &PluginNode{
		Name:       name,
		Properties: make(map[string]string),
	}, nil
}

func (p *Parser) parseConfig() (ASTNode, error) {
	if p.check(LeftBrace) {
		p.advance() // Skip {
		// Parse properties
		if p.check(RightBrace) {
			p.advance() // Skip }
		}
	}

	return &ConfigNode{
		Properties: make(map[string]string),
	}, nil
}

func (p *Parser) parseImport() (ASTNode, error) {
	var specifiers []string

	// Parse specifiers
	for !p.check(From) && !p.isAtEnd() {
		if token := p.peek(); token != nil && token.Type == Identifier {
			specifiers = append(specifiers, p.advance().Value)
		}
		if p.check(Comma) {
			p.advance() // Skip ,
		}
	}

	source := ""
	if p.check(From) {
		p.advance() // Skip from
		if token := p.peek(); token != nil && token.Type == String {
			source = p.advance().Value
		}
	}

	return &ImportNode{
		Specifiers: specifiers,
		Source:     source,
	}, nil
}

func (p *Parser) parseExport() (ASTNode, error) {
	isDefault := false
	if p.check(Identifier) {
		if token := p.peek(); token != nil && token.Value == "default" {
			p.advance() // Skip default
			isDefault = true
		}
	}

	var specifiers []string
	// Parse specifiers
	for !p.check(From) && !p.isAtEnd() {
		if token := p.peek(); token != nil && token.Type == Identifier {
			specifiers = append(specifiers, p.advance().Value)
		}
		if p.check(Comma) {
			p.advance() // Skip ,
		}
	}

	source := ""
	if p.check(From) {
		p.advance() // Skip from
		if token := p.peek(); token != nil && token.Type == String {
			source = p.advance().Value
		}
	}

	return &ExportNode{
		Specifiers: specifiers,
		Source:     source,
		IsDefault:  isDefault,
	}, nil
}

func (p *Parser) parseBlock() ([]ASTNode, error) {
	var statements []ASTNode

	for !p.check(RightBrace) && !p.isAtEnd() {
		statement, err := p.parseStatement()
		if err != nil {
			return nil, err
		}
		if statement != nil {
			statements = append(statements, statement)
		} else {
			p.advance() // Skip unknown token
		}
	}

	return statements, nil
}

func (p *Parser) parseParameters() ([]ASTNode, error) {
	var parameters []ASTNode

	for !p.check(RightParen) && !p.isAtEnd() {
		if token := p.peek(); token != nil && token.Type == Identifier {
			// Parse parameter
			p.advance()
		}
		if p.check(Comma) {
			p.advance() // Skip ,
		}
	}

	return parameters, nil
}

// ===================================
// AST VISITOR
// ===================================

type ASTVisitor interface {
	VisitProgram(*ProgramNode)
	VisitPage(*PageNode)
	VisitComponent(*ComponentNode)
	VisitStyle(*StyleNode)
	VisitEvent(*EventNode)
	VisitState(*StateNode)
	VisitApi(*ApiNode)
	VisitRouter(*RouterNode)
	VisitRoute(*RouteNode)
	VisitLayout(*LayoutNode)
	VisitAnimation(*AnimationNode)
	VisitType(*TypeNode)
	VisitHook(*HookNode)
	VisitPlugin(*PluginNode)
	VisitConfig(*ConfigNode)
	VisitImport(*ImportNode)
	VisitExport(*ExportNode)
	VisitElement(*ElementNode)
	VisitText(*TextNode)
	VisitExpression(*ExpressionNode)
}

// ===================================
// CODE GENERATOR
// ===================================

type CodeGenerator struct {
	htmlOutput  strings.Builder
	cssOutput   strings.Builder
	jsOutput    strings.Builder
	components  map[string]string
	styles      map[string]string
	scripts     map[string]string
}

func NewCodeGenerator() *CodeGenerator {
	return &CodeGenerator{
		components: make(map[string]string),
		styles:     make(map[string]string),
		scripts:    make(map[string]string),
	}
}

func (g *CodeGenerator) Generate(ast ASTNode) error {
	ast.Accept(g)
	return nil
}

func (g *CodeGenerator) VisitProgram(node *ProgramNode) {
	for _, statement := range node.Statements {
		statement.Accept(g)
	}
}

func (g *CodeGenerator) VisitPage(node *PageNode) {
	g.htmlOutput.WriteString("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n")
	g.htmlOutput.WriteString("  <meta charset=\"UTF-8\">\n")
	g.htmlOutput.WriteString("  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n")

	if title, exists := node.Attributes["title"]; exists {
		g.htmlOutput.WriteString(fmt.Sprintf("  <title>%s</title>\n", title))
	}

	g.htmlOutput.WriteString("  <link rel=\"stylesheet\" href=\"css/theme.css\">\n")
	g.htmlOutput.WriteString("  <link rel=\"stylesheet\" href=\"css/emadocs.css\">\n")
	g.htmlOutput.WriteString("  <link rel=\"stylesheet\" href=\"styles.css\">\n")
	g.htmlOutput.WriteString("</head>\n<body>\n")

	for _, child := range node.Body {
		child.Accept(g)
	}

	g.htmlOutput.WriteString("  <script src=\"js/emadocs.js\"></script>\n")
	g.htmlOutput.WriteString("  <script src=\"script.js\"></script>\n")
	g.htmlOutput.WriteString("</body>\n</html>")
}

func (g *CodeGenerator) VisitComponent(node *ComponentNode) {
	// Generate component CSS
	g.cssOutput.WriteString(fmt.Sprintf("/* %s Component */\n", node.Name))
	g.cssOutput.WriteString(fmt.Sprintf(".ema-%s {\n", strings.ToLower(node.Name)))
	g.cssOutput.WriteString("  display: block;\n")
	g.cssOutput.WriteString("  position: relative;\n")
	g.cssOutput.WriteString("  box-sizing: border-box;\n")
	g.cssOutput.WriteString("}\n\n")

	// Generate component JavaScript
	g.jsOutput.WriteString(fmt.Sprintf("class Ema%s extends HTMLElement {\n", g.capitalize(node.Name)))
	g.jsOutput.WriteString("  constructor() {\n")
	g.jsOutput.WriteString("    super();\n")
	g.jsOutput.WriteString("    this.attachShadow({ mode: 'open' });\n")
	g.jsOutput.WriteString("  }\n\n")
	g.jsOutput.WriteString("  connectedCallback() {\n")
	g.jsOutput.WriteString("    this.render();\n")
	g.jsOutput.WriteString("    this.setupEventListeners();\n")
	g.jsOutput.WriteString("  }\n\n")
	g.jsOutput.WriteString("  render() {\n")
	g.jsOutput.WriteString("    this.shadowRoot.innerHTML = this.getTemplate();\n")
	g.jsOutput.WriteString("  }\n\n")
	g.jsOutput.WriteString("  getTemplate() {\n")
	g.jsOutput.WriteString("    return `\n")
	g.jsOutput.WriteString(fmt.Sprintf("      <div class=\"ema-%s\">\n", strings.ToLower(node.Name)))
	g.jsOutput.WriteString("        <slot></slot>\n")
	g.jsOutput.WriteString("      </div>\n")
	g.jsOutput.WriteString("    `;\n")
	g.jsOutput.WriteString("  }\n\n")
	g.jsOutput.WriteString("  setupEventListeners() {\n")
	g.jsOutput.WriteString("    // Event listeners will be added here\n")
	g.jsOutput.WriteString("  }\n")
	g.jsOutput.WriteString("}\n\n")
	g.jsOutput.WriteString(fmt.Sprintf("customElements.define('ema-%s', Ema%s);\n", strings.ToLower(node.Name), g.capitalize(node.Name)))
}

func (g *CodeGenerator) VisitStyle(node *StyleNode) {
	g.cssOutput.WriteString(fmt.Sprintf("/* %s Styles */\n", node.Selector))
	g.cssOutput.WriteString(fmt.Sprintf(".%s {\n", node.Selector))
	g.cssOutput.WriteString("  /* Styles will be generated here */\n")
	g.cssOutput.WriteString("}\n\n")
}

func (g *CodeGenerator) VisitEvent(node *EventNode) {
	g.jsOutput.WriteString(fmt.Sprintf("// Event: %s on %s\n", node.EventType, node.Target))
	g.jsOutput.WriteString(fmt.Sprintf("document.addEventListener('%s', (event) => {\n", node.EventType))
	g.jsOutput.WriteString("  // Event handler code\n")
	g.jsOutput.WriteString("});\n")
}

func (g *CodeGenerator) VisitState(node *StateNode) {
	g.jsOutput.WriteString(fmt.Sprintf("// State: %s\n", node.Name))
	g.jsOutput.WriteString(fmt.Sprintf("const %s = {\n", node.Name))
	g.jsOutput.WriteString("  // State properties will be generated here\n")
	g.jsOutput.WriteString("};\n")
}

func (g *CodeGenerator) VisitApi(node *ApiNode) {
	g.jsOutput.WriteString(fmt.Sprintf("// API: %s\n", node.Name))
	g.jsOutput.WriteString(fmt.Sprintf("class %s {\n", node.Name))
	g.jsOutput.WriteString("  constructor() {\n")
	g.jsOutput.WriteString("    this.baseUrl = '';\n")
	g.jsOutput.WriteString("  }\n\n")
	g.jsOutput.WriteString("  // API methods will be generated here\n")
	g.jsOutput.WriteString("}\n")
}

func (g *CodeGenerator) VisitRouter(node *RouterNode) {
	g.jsOutput.WriteString("// Router\n")
	g.jsOutput.WriteString("class EmadocsRouter {\n")
	g.jsOutput.WriteString("  constructor() {\n")
	g.jsOutput.WriteString("    this.routes = new Map();\n")
	g.jsOutput.WriteString("    this.init();\n")
	g.jsOutput.WriteString("  }\n\n")
	g.jsOutput.WriteString("  init() {\n")
	g.jsOutput.WriteString("    window.addEventListener('popstate', () => this.handleRoute());\n")
	g.jsOutput.WriteString("    this.handleRoute();\n")
	g.jsOutput.WriteString("  }\n\n")
	g.jsOutput.WriteString("  handleRoute() {\n")
	g.jsOutput.WriteString("    const path = window.location.pathname;\n")
	g.jsOutput.WriteString("    // Route handling logic\n")
	g.jsOutput.WriteString("  }\n")
	g.jsOutput.WriteString("}\n")
}

func (g *CodeGenerator) VisitRoute(node *RouteNode) {
	// Route handling
}

func (g *CodeGenerator) VisitLayout(node *LayoutNode) {
	g.jsOutput.WriteString(fmt.Sprintf("// Layout: %s\n", node.Name))
	g.jsOutput.WriteString("// Layout implementation will be generated here\n")
}

func (g *CodeGenerator) VisitAnimation(node *AnimationNode) {
	g.cssOutput.WriteString(fmt.Sprintf("@keyframes %s {\n", node.Name))
	g.cssOutput.WriteString("  /* Keyframes will be generated here */\n")
	g.cssOutput.WriteString("}\n\n")
}

func (g *CodeGenerator) VisitType(node *TypeNode) {
	g.jsOutput.WriteString(fmt.Sprintf("// Type: %s\n", node.Name))
	g.jsOutput.WriteString("// Type definition will be generated here\n")
}

func (g *CodeGenerator) VisitHook(node *HookNode) {
	g.jsOutput.WriteString(fmt.Sprintf("function use%s() {\n", g.capitalize(node.Name)))
	g.jsOutput.WriteString("  // Hook implementation\n")
	g.jsOutput.WriteString("}\n")
}

func (g *CodeGenerator) VisitPlugin(node *PluginNode) {
	g.jsOutput.WriteString(fmt.Sprintf("class %s {\n", node.Name))
	g.jsOutput.WriteString("  constructor() {\n")
	g.jsOutput.WriteString("    // Plugin initialization\n")
	g.jsOutput.WriteString("  }\n")
	g.jsOutput.WriteString("}\n")
}

func (g *CodeGenerator) VisitConfig(node *ConfigNode) {
	g.jsOutput.WriteString("const config = {\n")
	g.jsOutput.WriteString("  // Configuration will be generated here\n")
	g.jsOutput.WriteString("};\n")
}

func (g *CodeGenerator) VisitImport(node *ImportNode) {
	g.jsOutput.WriteString("import ")
	if len(node.Specifiers) == 1 {
		g.jsOutput.WriteString(node.Specifiers[0])
	} else {
		g.jsOutput.WriteString("{ ")
		g.jsOutput.WriteString(strings.Join(node.Specifiers, ", "))
		g.jsOutput.WriteString(" }")
	}
	if node.Source != "" {
		g.jsOutput.WriteString(fmt.Sprintf(" from '%s'", node.Source))
	}
	g.jsOutput.WriteString(";\n")
}

func (g *CodeGenerator) VisitExport(node *ExportNode) {
	g.jsOutput.WriteString("export ")
	if node.IsDefault {
		g.jsOutput.WriteString("default ")
	}
	if len(node.Specifiers) == 1 {
		g.jsOutput.WriteString(node.Specifiers[0])
	} else {
		g.jsOutput.WriteString("{ ")
		g.jsOutput.WriteString(strings.Join(node.Specifiers, ", "))
		g.jsOutput.WriteString(" }")
	}
	if node.Source != "" {
		g.jsOutput.WriteString(fmt.Sprintf(" from '%s'", node.Source))
	}
	g.jsOutput.WriteString(";\n")
}

func (g *CodeGenerator) VisitElement(node *ElementNode) {
	// Element handling
}

func (g *CodeGenerator) VisitText(node *TextNode) {
	// Text handling
}

func (g *CodeGenerator) VisitExpression(node *ExpressionNode) {
	// Expression handling
}

func (g *CodeGenerator) capitalize(s string) string {
	if len(s) == 0 {
		return s
	}
	return strings.ToUpper(s[:1]) + s[1:]
}

func (g *CodeGenerator) GetHTML() string {
	return g.htmlOutput.String()
}

func (g *CodeGenerator) GetCSS() string {
	return g.cssOutput.String()
}

func (g *CodeGenerator) GetJS() string {
	return g.jsOutput.String()
}

// ===================================
// COMPILER MAIN CLASS
// ===================================

type EmadocsCompiler struct {
	input       string
	filename    string
	minify      bool
	sourcemap   bool
	treeshaking bool
}

type CompileResult struct {
	Success     bool
	HTML        string
	CSS         string
	JS          string
	Errors      []string
	Warnings    []string
	CompileTime float64
}

func NewEmadocsCompiler(input, filename string) *EmadocsCompiler {
	return &EmadocsCompiler{
		input:       input,
		filename:    filename,
		minify:      false,
		sourcemap:   false,
		treeshaking: true,
	}
}

func (c *EmadocsCompiler) Compile() *CompileResult {
	startTime := time.Now()
	result := &CompileResult{
		Success:  false,
		HTML:     "",
		CSS:      "",
		JS:       "",
		Errors:   []string{},
		Warnings: []string{},
	}

	html, css, js, err := c.compileInternal()
	if err != nil {
		result.Errors = append(result.Errors, err.Error())
	} else {
		result.Success = true
		result.HTML = html
		result.CSS = css
		result.JS = js
	}

	duration := time.Since(startTime)
	result.CompileTime = float64(duration.Nanoseconds()) / 1e6 // Convert to milliseconds

	return result
}

func (c *EmadocsCompiler) compileInternal() (string, string, string, error) {
	// Tokenize
	lexer := NewLexer(c.input)
	tokens, err := lexer.Tokenize()
	if err != nil {
		return "", "", "", err
	}

	// Parse
	parser := NewParser(tokens)
	ast, err := parser.Parse()
	if err != nil {
		return "", "", "", err
	}

	// Generate code
	generator := NewCodeGenerator()
	err = generator.Generate(ast)
	if err != nil {
		return "", "", "", err
	}

	return generator.GetHTML(), generator.GetCSS(), generator.GetJS(), nil
}

func (c *EmadocsCompiler) SetMinify(value bool) {
	c.minify = value
}

func (c *EmadocsCompiler) SetSourcemap(value bool) {
	c.sourcemap = value
}

func (c *EmadocsCompiler) SetTreeshaking(value bool) {
	c.treeshaking = value
}

// ===================================
// MAIN FUNCTION
// ===================================

func main() {
	var (
		inputFile  = flag.String("input", "", "Input .ema file")
		outputDir  = flag.String("output", "dist", "Output directory")
		minify     = flag.Bool("minify", false, "Minify output")
		sourcemap  = flag.Bool("sourcemap", false, "Generate source maps")
		help       = flag.Bool("help", false, "Show help")
		version    = flag.Bool("version", false, "Show version")
	)
	flag.Parse()

	if *help {
		fmt.Println("Emadocs Compiler v1.0.0")
		fmt.Println("Usage: emadocs-compiler [options] <input.ema>")
		fmt.Println("\nOptions:")
		flag.PrintDefaults()
		return
	}

	if *version {
		fmt.Println("Emadocs Compiler v1.0.0")
		return
	}

	if *inputFile == "" {
		fmt.Fprintf(os.Stderr, "Error: Input file is required\n")
		os.Exit(1)
	}

	// Read input file
	input, err := ioutil.ReadFile(*inputFile)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading file %s: %v\n", *inputFile, err)
		os.Exit(1)
	}

	// Compile
	compiler := NewEmadocsCompiler(string(input), *inputFile)
	compiler.SetMinify(*minify)
	compiler.SetSourcemap(*sourcemap)

	result := compiler.Compile()

	if !result.Success {
		fmt.Fprintf(os.Stderr, "Compilation failed:\n")
		for _, error := range result.Errors {
			fmt.Fprintf(os.Stderr, "  Error: %s\n", error)
		}
		os.Exit(1)
	}

	// Create output directory
	err = os.MkdirAll(*outputDir, 0755)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating output directory: %v\n", err)
		os.Exit(1)
	}

	err = os.MkdirAll(filepath.Join(*outputDir, "css"), 0755)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating css directory: %v\n", err)
		os.Exit(1)
	}

	err = os.MkdirAll(filepath.Join(*outputDir, "js"), 0755)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating js directory: %v\n", err)
		os.Exit(1)
	}

	// Write output files
	err = ioutil.WriteFile(filepath.Join(*outputDir, "index.html"), []byte(result.HTML), 0644)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error writing HTML file: %v\n", err)
		os.Exit(1)
	}

	err = ioutil.WriteFile(filepath.Join(*outputDir, "styles.css"), []byte(result.CSS), 0644)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error writing CSS file: %v\n", err)
		os.Exit(1)
	}

	err = ioutil.WriteFile(filepath.Join(*outputDir, "script.js"), []byte(result.JS), 0644)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error writing JS file: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Compilation successful!")
	fmt.Printf("  HTML: %s/index.html\n", *outputDir)
	fmt.Printf("  CSS:  %s/styles.css\n", *outputDir)
	fmt.Printf("  JS:   %s/script.js\n", *outputDir)
	fmt.Printf("  Time: %.2fms\n", result.CompileTime)
}
