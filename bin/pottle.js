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
	},
	'output': {
		alias: 'o',
		'default': 'Language.properties'
	}
});

var converters = {};

converters.ios = {
	toPottle: function(content) {
		content = content.replace(/"="/g, '=');
		content = content.replace(/(^"|";$)/mg, '');

		return content;
	}
}

var format = nconf.get('format'),
	input = nconf.get('input'),
	output = nconf.get('output'),
	content = fs.readFileSync(input, { encoding: 'utf8' });

var converter = converters[format];

content = converter.toPottle.call(converter, content);

fs.writeFile(output, content);