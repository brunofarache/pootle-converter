'use strict';

var nconf = require('nconf'),
	fs = require('fs'),
	parser = require('xmldom').DOMParser,
	serializer = require('xmldom').XMLSerializer;

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

converters.android = {
	fromPottle: function(content) {
		var template = '<?xml version="1.0" encoding="utf-8"?><resources></resources>',
			doc = new parser().parseFromString(template),
			lines = content.split('\n'),
			root = doc.childNodes[1];

		for (var i = 0; i < lines.length; i++) {
			var line = lines[i],
				pair = line.split('='),
				key	= pair[0],
				value = pair[1],
				child = doc.createElement('string');

			child.setAttribute('name', key);
			child.appendChild(doc.createTextNode(value));

			root.appendChild(child);
		}

		content = new serializer().serializeToString(doc);

		content = content.replace(/<resources>/, '\n<resources>');
		content = content.replace(/<\/resources>/, '\n</resources>');
		content = content.replace(/<string /g, '\n\t<string ');

		return {
			content: content,
			output: 'strings.xml'
		};
	},

	toPottle: function(content) {
		var doc = new parser().parseFromString(content),
			lines = doc.getElementsByTagName('string'),
			result = '';

		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];

			if (i > 0) {
				result += '\n';
			}

			result += line.getAttribute('name');
			result += '=';
			result += line.textContent;
		}

		return {
			content: result,
			output: 'Language.properties'
		}; 
	}
}

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
else if (/.xml$/.test(input)) {
	format = 'android';
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