const Lexer = require('./lexer');
function AST(expression) {
	this.lexer = new Lexer(expression);
	this.state = {
		type: 'Program',
		body: []
	};

	this.program();
}

AST.Program = 'Program';
AST.Literal = 'Literal';

AST.prototype.program = function() {
	this.lexer.lex();

	console.log('this.lexer.tokens', this.lexer.tokens);
}

AST.prototype.recursive = function() {}
AST.prototype.constant = function() {}
AST.prototype.variable = function() {}


var code = 'if(a) { var c = "44"; } else { var d = 33; }';
var ast = new AST(code);

module.exports = AST;