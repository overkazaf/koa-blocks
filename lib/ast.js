const Lexer = require('./lexer');
function AST(expression) {
	this.input = expression;
	this.lexer = new Lexer(expression);
	this.state = {
		type: 'Program',
		body: []
	};
	this.tokens = [];
	this.currentToken = null;
	this.c = 0;
	this.program();
}

AST.Program = 'Program';
AST.Literal = 'Literal';

AST.prototype.program = function() {
	this.lexer.lex();
	this.tokens = this.lexer.tokens;

	while (this.c < this.tokens.length) {
		const token = this.next();
		const { type, value } = token;
		if (type === 'Paren' && value === '(') {
			const id = this.la(2).value;
			let params = [];
			let tmp;
			while ((tmp = this.next()) !== false && tmp.type !== 'Paren') {
				params.push(tmp.value);
			}
			this.state.body.push({
				type: 'CallStatement',
				id,
				params,
			});
		} else if (type === 'Punctuator') {
			continue;
		} else if (type === 'Keyword') {
			if (value === 'var') {
				const stmt = [];

				let tmp;
				while ((tmp = this.next()) !== false && tmp.type !== 'Punctuator') {
					stmt.push(tmp);
				}

				this.state.body.push({
					type: 'Declaration',
					body: stmt,
				});
			}
		} else {
			this.state.body.push(token);
		}
	}
}

AST.prototype.la = function(k = 1) {
	if (this.c === 0) {
		return false;
	} else {
		return this.tokens[this.c - k];
	}
}

AST.prototype.ll = function(k = 1) {
	if (k < 0) k += 1;
	if (k > this.tokens.length - 1) {
		return false;
	} else {
		return this.tokens[k];
	}
}

AST.prototype.next = function() {
	const token = this.tokens[this.c++];
	this.currentToken = token;
	return token;
}

AST.prototype.codeGen = function() {

}

AST.prototype.recursive = function() {}
AST.prototype.constant = function() {}
AST.prototype.variable = function() {}


var code = 'name="kevin"';
var ast = new AST(code);

console.log(ast.lexer.tokens);
console.log(ast.state);

module.exports = AST;