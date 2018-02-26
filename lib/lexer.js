function isType(type, obj) {
	return Object.prototype.toString.call(obj) === '[Object ' + type + ']';
}

function isNumber(char) {
	return '0' <= char && char <= '9';
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
		console.log('this.now', this.now, 'isNumber()', isNumber(this.now));
		if (isNumber(this.now)) {
			this.eatNumber();
		} else if (this.now === ' ') {
			this.eatSpace();
		} else {
			throw new Error('Unsupported method');
		}
	}
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
		text: text,
		value: Number(text)
	});
}

Lexer.prototype.eatSpace = function() {
	while(this.index < this.len) {
		this.now = this.text.charAt(this.index);
		
		if (/\s/.test(this.now)) {
			this.index++;
		} else {
			break;
		}
	}

	this.tokens.push({
		text: ' ',
		isSpace: true,
		value: ' '
	});
};



module.exports = Lexer;
