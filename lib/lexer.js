function isType(type, obj) {
	return Object.prototype.toString.call(obj) === '[Object ' + type + ']';
}

function isNumber(char) {
	return '0' <= char && char <= '9';
}

function isPunctuator(char) {
	return /\+|\-|\*|\%|\;|\=/.test(char);
}

function Lexer(expression) {
	this.tokens = [];
	this.text = expression;
	this.cur = void 0;
	this.index = 0;
	this.len = this.text.length;
}

Lexer.prototype.lex = function() {
	while (this.index < this.len) {
		this.now = this.text.charAt(this.index);
		if (isNumber(this.now)) {
			this.eatNumber();
		} else if (this.now === ' ') {
			this.index++;
		} else if (/\{|\}/.test(this.now)) {
			this.eatBrace();
		} else if (isPunctuator(this.now)) {
			this.eatPunctuator();
		} else if (this.now === '\'' || this.now === '\"') {
			this.eatString();
		} else if (/\w/.test(this.now)) {
			this.eatVar();
		} else if (/\(|\)/.test(this.now)) {
			this.eatParen();
		} else {
			throw new Error('Unsupported method');
		}
	}

	this.fixTokens();
}

Lexer.prototype.eatBrace = function() {
	this.tokens.push({
		type: 'Brace',
		value: this.now
	});
	this.index++;
}

Lexer.prototype.eatParen = function() {
	this.tokens.push({
		type: 'Paren',
		value: this.now
	});
	this.index++;
}

Lexer.prototype.eatPunctuator = function() {
	this.index++;
	this.tokens.push({
		type: 'Punctuator',
		value: this.now
	});
}

Lexer.prototype.eatVar = function() {
	const re = /\w+/;
	const sub = this.text.substring(this.index);
	if (re.test(sub)) {
		const group = sub.match(re);
		const str = group[0];
		this.index += str.length;
		this.tokens.push({
			type: 'Variable',
			value: str
		});
	}
};

const KeyWordMap = {
	var: 1,
	const: 1,
	let: 1,
	for: 1,
	while: 1,
	if: 1,
	else: 1,
};

Lexer.prototype.fixTokens = function() {
	this.tokens = this.tokens.map((token) => {
		const { type, value } = token;
		if (type === 'Variable') {
			if (token.value in KeyWordMap) {
				return {
					type: 'Keyword',
					value: token.value
				};
			} else {
				return {
					type: 'Identifier',
					value: token.value
				};
			}
		} else if (type === 'Punctuator') {
			if (value === '=') {
				return {
					type: 'Assign',
					value: '=',
				}
			} else {
				return {
					type,
					value,
				}
			}
		} else {
			return token;
		}
	});
}

Lexer.prototype.eatNumber = function() {
	let text = '';
	while(this.index < this.len) {
		this.now = this.text.charAt(this.index);
		if (isNumber(this.now) || this.now === '.') {
			text += this.now;
			this.index++;
		} else {
			break;
		}
	}

	this.tokens.push({
		type: 'Numberic',
		value: Number(text)
	});
}

Lexer.prototype.eatString = function() {
	let text = '';
	while(this.index < this.len) {
		this.now = this.text.charAt(this.index);
		if (typeof this.now === 'string') {
			text += this.now;
			this.index++;
			if ((this.now === '\'' || this.now === '\"') && text.length > 1) {
				break;
			}
		} else {
			break;
		}
	}

	this.tokens.push({
		type: 'String',
		value: text.substring(1, text.length - 1)
	});
};



module.exports = Lexer;
