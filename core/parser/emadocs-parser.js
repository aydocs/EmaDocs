/**
 * EMADOCS PARSER - EmadocsLang Parser
 * Parses .ema files and generates AST
 */

class EmadocsParser {
  constructor() {
    this.tokens = [];
    this.current = 0;
    this.ast = {
      type: 'Program',
      body: []
    };
  }

  // Tokenizer
  tokenize(input) {
    const tokens = [];
    let current = 0;
    
    const WHITESPACE = /\s/;
    const NUMBERS = /[0-9]/;
    const LETTERS = /[a-zA-Z_]/;
    const LETTERS_DIGITS = /[a-zA-Z0-9_]/;
    
    while (current < input.length) {
      let char = input[current];
      
      // Skip whitespace
      if (WHITESPACE.test(char)) {
        current++;
        continue;
      }
      
      // Comments
      if (char === '/' && input[current + 1] === '/') {
        let value = '';
        current += 2;
        while (current < input.length && input[current] !== '\n') {
          value += input[current];
          current++;
        }
        tokens.push({ type: 'COMMENT', value });
        continue;
      }
      
      if (char === '/' && input[current + 1] === '*') {
        let value = '';
        current += 2;
        while (current < input.length && !(input[current] === '*' && input[current + 1] === '/')) {
          value += input[current];
          current++;
        }
        current += 2;
        tokens.push({ type: 'COMMENT', value });
        continue;
      }
      
      // Strings
      if (char === '"' || char === "'") {
        let value = '';
        const quote = char;
        current++;
        
        while (current < input.length && input[current] !== quote) {
          if (input[current] === '\\') {
            current++;
            if (current < input.length) {
              value += input[current];
              current++;
            }
          } else {
            value += input[current];
            current++;
          }
        }
        current++;
        
        tokens.push({ type: 'STRING', value });
        continue;
      }
      
      // Template literals
      if (char === '`') {
        let value = '';
        current++;
        
        while (current < input.length && input[current] !== '`') {
          if (input[current] === '\\') {
            current++;
            if (current < input.length) {
              value += input[current];
              current++;
            }
          } else {
            value += input[current];
            current++;
          }
        }
        current++;
        
        tokens.push({ type: 'TEMPLATE_LITERAL', value });
        continue;
      }
      
      // Numbers
      if (NUMBERS.test(char)) {
        let value = '';
        while (current < input.length && (NUMBERS.test(input[current]) || input[current] === '.')) {
          value += input[current];
          current++;
        }
        tokens.push({ type: 'NUMBER', value: parseFloat(value) });
        continue;
      }
      
      // Identifiers and keywords
      if (LETTERS.test(char)) {
        let value = '';
        while (current < input.length && LETTERS_DIGITS.test(input[current])) {
          value += input[current];
          current++;
        }
        
        // Keywords
        const keywords = [
          'page', 'component', 'style', 'event', 'state', 'api', 'router', 'route',
          'layout', 'animation', 'type', 'hook', 'plugin', 'config', 'import', 'export',
          'from', 'as', 'if', 'else', 'for', 'while', 'function', 'async', 'await',
          'return', 'const', 'let', 'var', 'true', 'false', 'null', 'undefined',
          'class', 'extends', 'implements', 'interface', 'enum', 'namespace'
        ];
        
        if (keywords.includes(value)) {
          tokens.push({ type: value.toUpperCase(), value });
        } else {
          tokens.push({ type: 'IDENTIFIER', value });
        }
        continue;
      }
      
      // Operators and punctuation
      if (char === '<') {
        if (input[current + 1] === '/') {
          tokens.push({ type: 'CLOSING_TAG_START', value: '</' });
          current += 2;
        } else {
          tokens.push({ type: 'OPENING_TAG_START', value: '<' });
          current++;
        }
        continue;
      }
      
      if (char === '>') {
        tokens.push({ type: 'TAG_END', value: '>' });
        current++;
        continue;
      }
      
      if (char === '/') {
        if (input[current + 1] === '>') {
          tokens.push({ type: 'SELF_CLOSING_TAG_END', value: '/>' });
          current += 2;
        } else {
          tokens.push({ type: 'DIVIDE', value: '/' });
          current++;
        }
        continue;
      }
      
      if (char === '=') {
        if (input[current + 1] === '=') {
          tokens.push({ type: 'EQUAL_EQUAL', value: '==' });
          current += 2;
        } else if (input[current + 1] === '>') {
          tokens.push({ type: 'ARROW', value: '=>' });
          current += 2;
        } else {
          tokens.push({ type: 'ASSIGN', value: '=' });
          current++;
        }
        continue;
      }
      
      if (char === '!') {
        if (input[current + 1] === '=') {
          tokens.push({ type: 'NOT_EQUAL', value: '!=' });
          current += 2;
        } else {
          tokens.push({ type: 'NOT', value: '!' });
          current++;
        }
        continue;
      }
      
      if (char === '&') {
        if (input[current + 1] === '&') {
          tokens.push({ type: 'AND', value: '&&' });
          current += 2;
        } else {
          tokens.push({ type: 'BITWISE_AND', value: '&' });
          current++;
        }
        continue;
      }
      
      if (char === '|') {
        if (input[current + 1] === '|') {
          tokens.push({ type: 'OR', value: '||' });
          current += 2;
        } else {
          tokens.push({ type: 'BITWISE_OR', value: '|' });
          current++;
        }
        continue;
      }
      
      if (char === '{') {
        tokens.push({ type: 'LEFT_BRACE', value: '{' });
        current++;
        continue;
      }
      
      if (char === '}') {
        tokens.push({ type: 'RIGHT_BRACE', value: '}' });
        current++;
        continue;
      }
      
      if (char === '(') {
        tokens.push({ type: 'LEFT_PAREN', value: '(' });
        current++;
        continue;
      }
      
      if (char === ')') {
        tokens.push({ type: 'RIGHT_PAREN', value: ')' });
        current++;
        continue;
      }
      
      if (char === '[') {
        tokens.push({ type: 'LEFT_BRACKET', value: '[' });
        current++;
        continue;
      }
      
      if (char === ']') {
        tokens.push({ type: 'RIGHT_BRACKET', value: ']' });
        current++;
        continue;
      }
      
      if (char === ';') {
        tokens.push({ type: 'SEMICOLON', value: ';' });
        current++;
        continue;
      }
      
      if (char === ',') {
        tokens.push({ type: 'COMMA', value: ',' });
        current++;
        continue;
      }
      
      if (char === '.') {
        tokens.push({ type: 'DOT', value: '.' });
        current++;
        continue;
      }
      
      if (char === ':') {
        tokens.push({ type: 'COLON', value: ':' });
        current++;
        continue;
      }
      
      if (char === '?') {
        tokens.push({ type: 'QUESTION', value: '?' });
        current++;
        continue;
      }
      
      if (char === '+') {
        tokens.push({ type: 'PLUS', value: '+' });
        current++;
        continue;
      }
      
      if (char === '-') {
        tokens.push({ type: 'MINUS', value: '-' });
        current++;
        continue;
      }
      
      if (char === '*') {
        tokens.push({ type: 'MULTIPLY', value: '*' });
        current++;
        continue;
      }
      
      if (char === '%') {
        tokens.push({ type: 'MODULO', value: '%' });
        current++;
        continue;
      }
      
      if (char === '<') {
        if (input[current + 1] === '=') {
          tokens.push({ type: 'LESS_EQUAL', value: '<=' });
          current += 2;
        } else {
          tokens.push({ type: 'LESS', value: '<' });
          current++;
        }
        continue;
      }
      
      if (char === '>') {
        if (input[current + 1] === '=') {
          tokens.push({ type: 'GREATER_EQUAL', value: '>=' });
          current += 2;
        } else {
          tokens.push({ type: 'GREATER', value: '>' });
          current++;
        }
        continue;
      }
      
      // Unknown character
      throw new Error(`Unexpected character: ${char} at position ${current}`);
    }
    
    tokens.push({ type: 'EOF', value: null });
    return tokens;
  }

  // Parser methods
  parse(input) {
    this.tokens = this.tokenize(input);
    this.current = 0;
    this.ast = {
      type: 'Program',
      body: []
    };
    
    while (!this.isAtEnd()) {
      const statement = this.parseStatement();
      if (statement) {
        this.ast.body.push(statement);
      }
    }
    
    return this.ast;
  }

  parseStatement() {
    if (this.match('PAGE')) {
      return this.parsePage();
    }
    
    if (this.match('COMPONENT')) {
      return this.parseComponent();
    }
    
    if (this.match('STYLE')) {
      return this.parseStyle();
    }
    
    if (this.match('EVENT')) {
      return this.parseEvent();
    }
    
    if (this.match('STATE')) {
      return this.parseState();
    }
    
    if (this.match('API')) {
      return this.parseApi();
    }
    
    if (this.match('ROUTER')) {
      return this.parseRouter();
    }
    
    if (this.match('LAYOUT')) {
      return this.parseLayout();
    }
    
    if (this.match('ANIMATION')) {
      return this.parseAnimation();
    }
    
    if (this.match('TYPE')) {
      return this.parseType();
    }
    
    if (this.match('HOOK')) {
      return this.parseHook();
    }
    
    if (this.match('PLUGIN')) {
      return this.parsePlugin();
    }
    
    if (this.match('CONFIG')) {
      return this.parseConfig();
    }
    
    if (this.match('IMPORT')) {
      return this.parseImport();
    }
    
    if (this.match('EXPORT')) {
      return this.parseExport();
    }
    
    return this.parseExpression();
  }

  parsePage() {
    this.consume('PAGE', 'Expected "page"');
    
    const name = this.consume('IDENTIFIER', 'Expected page name').value;
    const attributes = this.parseAttributes();
    
    this.consume('LEFT_BRACE', 'Expected "{" after page declaration');
    
    const body = this.parseBlock();
    
    this.consume('RIGHT_BRACE', 'Expected "}" after page body');
    
    return {
      type: 'Page',
      name,
      attributes,
      body
    };
  }

  parseComponent() {
    this.consume('COMPONENT', 'Expected "component"');
    
    const name = this.consume('IDENTIFIER', 'Expected component name').value;
    
    // Parse generic type parameters
    let typeParams = [];
    if (this.match('LESS')) {
      this.consume('LESS', 'Expected "<"');
      typeParams = this.parseTypeParameters();
      this.consume('GREATER', 'Expected ">"');
    }
    
    this.consume('LEFT_BRACE', 'Expected "{" after component declaration');
    
    const props = this.parseProps();
    const events = this.parseEvents();
    const state = this.parseState();
    const methods = this.parseMethods();
    const render = this.parseRender();
    
    this.consume('RIGHT_BRACE', 'Expected "}" after component body');
    
    return {
      type: 'Component',
      name,
      typeParams,
      props,
      events,
      state,
      methods,
      render
    };
  }

  parseStyle() {
    this.consume('STYLE', 'Expected "style"');
    
    const selector = this.consume('IDENTIFIER', 'Expected style selector').value;
    
    this.consume('LEFT_BRACE', 'Expected "{" after style selector');
    
    const rules = this.parseStyleRules();
    
    this.consume('RIGHT_BRACE', 'Expected "}" after style rules');
    
    return {
      type: 'Style',
      selector,
      rules
    };
  }

  parseEvent() {
    this.consume('EVENT', 'Expected "event"');
    
    const eventType = this.consume('IDENTIFIER', 'Expected event type').value;
    this.consume('ON', 'Expected "on"');
    
    const target = this.parseExpression();
    
    this.consume('LEFT_BRACE', 'Expected "{" after event declaration');
    
    const body = this.parseBlock();
    
    this.consume('RIGHT_BRACE', 'Expected "}" after event body');
    
    return {
      type: 'Event',
      eventType,
      target,
      body
    };
  }

  parseState() {
    this.consume('STATE', 'Expected "state"');
    
    const name = this.consume('IDENTIFIER', 'Expected state name').value;
    
    this.consume('LEFT_BRACE', 'Expected "{" after state declaration');
    
    const properties = this.parseStateProperties();
    
    this.consume('RIGHT_BRACE', 'Expected "}" after state properties');
    
    return {
      type: 'State',
      name,
      properties
    };
  }

  parseApi() {
    this.consume('API', 'Expected "api"');
    
    const name = this.consume('IDENTIFIER', 'Expected API name').value;
    
    this.consume('LEFT_BRACE', 'Expected "{" after API declaration');
    
    const properties = this.parseApiProperties();
    const methods = this.parseApiMethods();
    
    this.consume('RIGHT_BRACE', 'Expected "}" after API body');
    
    return {
      type: 'Api',
      name,
      properties,
      methods
    };
  }

  parseRouter() {
    this.consume('ROUTER', 'Expected "router"');
    
    this.consume('LEFT_BRACE', 'Expected "{" after router declaration');
    
    const routes = this.parseRoutes();
    
    this.consume('RIGHT_BRACE', 'Expected "}" after router body');
    
    return {
      type: 'Router',
      routes
    };
  }

  parseLayout() {
    this.consume('LAYOUT', 'Expected "layout"');
    
    const name = this.consume('IDENTIFIER', 'Expected layout name').value;
    
    this.consume('LEFT_BRACE', 'Expected "{" after layout declaration');
    
    const render = this.parseRender();
    
    this.consume('RIGHT_BRACE', 'Expected "}" after layout body');
    
    return {
      type: 'Layout',
      name,
      render
    };
  }

  parseAnimation() {
    this.consume('ANIMATION', 'Expected "animation"');
    
    const name = this.consume('IDENTIFIER', 'Expected animation name').value;
    
    this.consume('LEFT_BRACE', 'Expected "{" after animation declaration');
    
    const keyframes = this.parseKeyframes();
    
    this.consume('RIGHT_BRACE', 'Expected "}" after animation body');
    
    return {
      type: 'Animation',
      name,
      keyframes
    };
  }

  parseType() {
    this.consume('TYPE', 'Expected "type"');
    
    const name = this.consume('IDENTIFIER', 'Expected type name').value;
    
    this.consume('ASSIGN', 'Expected "=" after type name');
    
    const definition = this.parseTypeDefinition();
    
    this.consume('SEMICOLON', 'Expected ";" after type definition');
    
    return {
      type: 'Type',
      name,
      definition
    };
  }

  parseHook() {
    this.consume('HOOK', 'Expected "hook"');
    
    const name = this.consume('IDENTIFIER', 'Expected hook name').value;
    
    this.consume('LEFT_PAREN', 'Expected "(" after hook name');
    
    const parameters = this.parseParameters();
    
    this.consume('RIGHT_PAREN', 'Expected ")" after hook parameters');
    
    this.consume('LEFT_BRACE', 'Expected "{" after hook declaration');
    
    const body = this.parseBlock();
    
    this.consume('RIGHT_BRACE', 'Expected "}" after hook body');
    
    return {
      type: 'Hook',
      name,
      parameters,
      body
    };
  }

  parsePlugin() {
    this.consume('PLUGIN', 'Expected "plugin"');
    
    const name = this.consume('IDENTIFIER', 'Expected plugin name').value;
    
    this.consume('LEFT_BRACE', 'Expected "{" after plugin declaration');
    
    const properties = this.parsePluginProperties();
    
    this.consume('RIGHT_BRACE', 'Expected "}" after plugin body');
    
    return {
      type: 'Plugin',
      name,
      properties
    };
  }

  parseConfig() {
    this.consume('CONFIG', 'Expected "config"');
    
    this.consume('LEFT_BRACE', 'Expected "{" after config declaration');
    
    const properties = this.parseConfigProperties();
    
    this.consume('RIGHT_BRACE', 'Expected "}" after config body');
    
    return {
      type: 'Config',
      properties
    };
  }

  parseImport() {
    this.consume('IMPORT', 'Expected "import"');
    
    const specifiers = this.parseImportSpecifiers();
    
    if (this.match('FROM')) {
      this.consume('FROM', 'Expected "from"');
      const source = this.consume('STRING', 'Expected module source').value;
      
      return {
        type: 'Import',
        specifiers,
        source
      };
    }
    
    return {
      type: 'Import',
      specifiers,
      source: null
    };
  }

  parseExport() {
    this.consume('EXPORT', 'Expected "export"');
    
    if (this.match('DEFAULT')) {
      this.consume('DEFAULT', 'Expected "default"');
      const declaration = this.parseStatement();
      
      return {
        type: 'ExportDefault',
        declaration
      };
    }
    
    const specifiers = this.parseExportSpecifiers();
    
    if (this.match('FROM')) {
      this.consume('FROM', 'Expected "from"');
      const source = this.consume('STRING', 'Expected module source').value;
      
      return {
        type: 'Export',
        specifiers,
        source
      };
    }
    
    return {
      type: 'Export',
      specifiers,
      source: null
    };
  }

  // Helper methods
  match(...types) {
    return types.includes(this.peek().type);
  }

  peek() {
    return this.tokens[this.current];
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  isAtEnd() {
    return this.peek().type === 'EOF';
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw new Error(message);
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  // Additional parsing methods would go here...
  parseAttributes() {
    const attributes = {};
    
    while (!this.match('LEFT_BRACE') && !this.isAtEnd()) {
      const name = this.consume('IDENTIFIER', 'Expected attribute name').value;
      this.consume('ASSIGN', 'Expected "=" after attribute name');
      const value = this.parseExpression();
      attributes[name] = value;
      
      if (this.match('COMMA')) {
        this.consume('COMMA', 'Expected "," after attribute');
      }
    }
    
    return attributes;
  }

  parseBlock() {
    const statements = [];
    
    while (!this.match('RIGHT_BRACE') && !this.isAtEnd()) {
      const statement = this.parseStatement();
      if (statement) {
        statements.push(statement);
      }
    }
    
    return statements;
  }

  parseExpression() {
    return this.parseAssignment();
  }

  parseAssignment() {
    const expr = this.parseOr();
    
    if (this.match('ASSIGN')) {
      const equals = this.previous();
      const value = this.parseAssignment();
      
      if (expr.type === 'Variable') {
        return {
          type: 'Assign',
          name: expr.name,
          value
        };
      }
      
      throw new Error('Invalid assignment target');
    }
    
    return expr;
  }

  parseOr() {
    let expr = this.parseAnd();
    
    while (this.match('OR')) {
      const operator = this.previous();
      const right = this.parseAnd();
      expr = {
        type: 'Logical',
        operator: operator.value,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  parseAnd() {
    let expr = this.parseEquality();
    
    while (this.match('AND')) {
      const operator = this.previous();
      const right = this.parseEquality();
      expr = {
        type: 'Logical',
        operator: operator.value,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  parseEquality() {
    let expr = this.parseComparison();
    
    while (this.match('EQUAL_EQUAL', 'NOT_EQUAL')) {
      const operator = this.previous();
      const right = this.parseComparison();
      expr = {
        type: 'Binary',
        operator: operator.value,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  parseComparison() {
    let expr = this.parseTerm();
    
    while (this.match('GREATER', 'GREATER_EQUAL', 'LESS', 'LESS_EQUAL')) {
      const operator = this.previous();
      const right = this.parseTerm();
      expr = {
        type: 'Binary',
        operator: operator.value,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  parseTerm() {
    let expr = this.parseFactor();
    
    while (this.match('PLUS', 'MINUS')) {
      const operator = this.previous();
      const right = this.parseFactor();
      expr = {
        type: 'Binary',
        operator: operator.value,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  parseFactor() {
    let expr = this.parseUnary();
    
    while (this.match('MULTIPLY', 'DIVIDE', 'MODULO')) {
      const operator = this.previous();
      const right = this.parseUnary();
      expr = {
        type: 'Binary',
        operator: operator.value,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  parseUnary() {
    if (this.match('NOT', 'MINUS')) {
      const operator = this.previous();
      const right = this.parseUnary();
      return {
        type: 'Unary',
        operator: operator.value,
        right
      };
    }
    
    return this.parseCall();
  }

  parseCall() {
    let expr = this.parsePrimary();
    
    while (true) {
      if (this.match('LEFT_PAREN')) {
        expr = this.finishCall(expr);
      } else if (this.match('DOT')) {
        this.consume('DOT', 'Expected "." after expression');
        const name = this.consume('IDENTIFIER', 'Expected property name').value;
        expr = {
          type: 'Get',
          object: expr,
          name
        };
      } else if (this.match('LEFT_BRACKET')) {
        this.consume('LEFT_BRACKET', 'Expected "[" after expression');
        const index = this.parseExpression();
        this.consume('RIGHT_BRACKET', 'Expected "]" after index');
        expr = {
          type: 'Get',
          object: expr,
          index
        };
      } else {
        break;
      }
    }
    
    return expr;
  }

  finishCall(callee) {
    const args = [];
    
    if (!this.check('RIGHT_PAREN')) {
      do {
        args.push(this.parseExpression());
      } while (this.match('COMMA'));
    }
    
    this.consume('RIGHT_PAREN', 'Expected ")" after arguments');
    
    return {
      type: 'Call',
      callee,
      args
    };
  }

  parsePrimary() {
    if (this.match('FALSE')) {
      this.advance();
      return { type: 'Literal', value: false };
    }
    
    if (this.match('TRUE')) {
      this.advance();
      return { type: 'Literal', value: true };
    }
    
    if (this.match('NULL')) {
      this.advance();
      return { type: 'Literal', value: null };
    }
    
    if (this.match('NUMBER', 'STRING', 'TEMPLATE_LITERAL')) {
      const token = this.advance();
      return { type: 'Literal', value: token.value };
    }
    
    if (this.match('IDENTIFIER')) {
      const token = this.advance();
      return { type: 'Variable', name: token.value };
    }
    
    if (this.match('LEFT_PAREN')) {
      this.consume('LEFT_PAREN', 'Expected "("');
      const expr = this.parseExpression();
      this.consume('RIGHT_PAREN', 'Expected ")"');
      return expr;
    }
    
    throw new Error('Expected expression');
  }

  // Additional parsing methods for specific constructs
  parseProps() {
    if (!this.match('PROP')) return [];
    
    const props = [];
    
    while (this.match('PROP')) {
      this.consume('PROP', 'Expected "prop"');
      
      const name = this.consume('IDENTIFIER', 'Expected prop name').value;
      this.consume('COLON', 'Expected ":" after prop name');
      
      const type = this.parseTypeAnnotation();
      
      let defaultValue = null;
      if (this.match('ASSIGN')) {
        this.consume('ASSIGN', 'Expected "="');
        defaultValue = this.parseExpression();
      }
      
      props.push({
        name,
        type,
        defaultValue
      });
      
      if (this.match('COMMA')) {
        this.consume('COMMA', 'Expected "," after prop');
      }
    }
    
    return props;
  }

  parseEvents() {
    if (!this.match('EVENT')) return [];
    
    const events = [];
    
    while (this.match('EVENT')) {
      this.consume('EVENT', 'Expected "event"');
      
      const name = this.consume('IDENTIFIER', 'Expected event name').value;
      this.consume('COLON', 'Expected ":" after event name');
      
      const signature = this.parseFunctionSignature();
      
      events.push({
        name,
        signature
      });
      
      if (this.match('COMMA')) {
        this.consume('COMMA', 'Expected "," after event');
      }
    }
    
    return events;
  }

  parseTypeAnnotation() {
    if (this.match('IDENTIFIER')) {
      const name = this.consume('IDENTIFIER', 'Expected type name').value;
      
      if (this.match('LESS')) {
        this.consume('LESS', 'Expected "<"');
        const typeParams = this.parseTypeParameters();
        this.consume('GREATER', 'Expected ">"');
        
        return {
          type: 'GenericType',
          name,
          typeParams
        };
      }
      
      return {
        type: 'TypeReference',
        name
      };
    }
    
    if (this.match('LEFT_PAREN')) {
      this.consume('LEFT_PAREN', 'Expected "("');
      const types = this.parseTypeList();
      this.consume('RIGHT_PAREN', 'Expected ")"');
      
      if (this.match('ARROW')) {
        this.consume('ARROW', 'Expected "=>"');
        const returnType = this.parseTypeAnnotation();
        
        return {
          type: 'FunctionType',
          parameters: types,
          returnType
        };
      }
      
      return {
        type: 'UnionType',
        types
      };
    }
    
    throw new Error('Expected type annotation');
  }

  parseTypeParameters() {
    const params = [];
    
    do {
      const name = this.consume('IDENTIFIER', 'Expected type parameter name').value;
      params.push(name);
      
      if (this.match('COMMA')) {
        this.consume('COMMA', 'Expected "," after type parameter');
      }
    } while (this.match('COMMA'));
    
    return params;
  }

  parseTypeList() {
    const types = [];
    
    do {
      types.push(this.parseTypeAnnotation());
      
      if (this.match('COMMA')) {
        this.consume('COMMA', 'Expected "," after type');
      }
    } while (this.match('COMMA'));
    
    return types;
  }

  parseFunctionSignature() {
    this.consume('LEFT_PAREN', 'Expected "("');
    
    const parameters = this.parseParameters();
    
    this.consume('RIGHT_PAREN', 'Expected ")"');
    
    let returnType = null;
    if (this.match('COLON')) {
      this.consume('COLON', 'Expected ":"');
      returnType = this.parseTypeAnnotation();
    }
    
    return {
      parameters,
      returnType
    };
  }

  parseParameters() {
    const params = [];
    
    if (!this.check('RIGHT_PAREN')) {
      do {
        const name = this.consume('IDENTIFIER', 'Expected parameter name').value;
        this.consume('COLON', 'Expected ":" after parameter name');
        const type = this.parseTypeAnnotation();
        
        params.push({
          name,
          type
        });
        
        if (this.match('COMMA')) {
          this.consume('COMMA', 'Expected "," after parameter');
        }
      } while (this.match('COMMA'));
    }
    
    return params;
  }

  // Additional parsing methods would continue here...
  // This is a simplified version for demonstration
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmadocsParser;
} else if (typeof window !== 'undefined') {
  window.EmadocsParser = EmadocsParser;
}
