const Lexer = require('./Lexer');

const code = '123.123123 23';
const lexer = new Lexer(code);
lexer.lex();

console.log('tks', lexer.tokens);