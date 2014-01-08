'use strict';

var nconf = require('nconf'),
	fs = require('fs');

nconf.argv({
	'format': {
		alias: 'f',
		'default': 'ios'
	},
	'input': {
		alias: 'i'
	}
});

var converters = {};

converters.ios = {
	fromPottle: function(content) {
		content = content.replace(/=/g, '"="');
		content = '"' + content.split('\n').join('";\n"') + ';"';

		return {
			content: content,
			output: 'Localizable.strings'
		};
	},

	toPottle: function(content) {
		content = content.replace(/"="/g, '=');
		content = content.replace(/(^"|";$)/mg, '');

		return {
			content: content,
			output: 'Language.properties'
		};
	}
}

var input = nconf.get('input'),
	content = fs.readFileSync(input, { encoding: 'utf8' }),
	format, pottle;

if (/.strings$/.test(input)) {
	format = 'ios';
}
else if (/.properties$/.test(input)) {
	format = nconf.get('format');
	pottle = true;
}

var converter = converters[format],
	result;

if (pottle) {
	result = converter.fromPottle.call(converter, content);	
}
else {
	result = converter.toPottle.call(converter, content);
}

fs.writeFile(result.output, result.content);