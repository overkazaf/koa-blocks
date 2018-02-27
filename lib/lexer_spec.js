const Lexer = require('./Lexer');

const code = 'var a = 123.123123; var b = "bbbb";';
const lexer = new Lexer(code);
lexer.lex();

console.log('tks', lexer.tokens);