# Pootle Converter

This command-line tool helps converting Pootle translation files to Android (strings.xml) and iOS localization (Localizable.strings) files.

## Install

```bash
	[sudo] npm install pootle -g
```

## Usage

### Android

Android (strings.xml) to Java properties (Language.properties):

```bash
	pootle -i strings.xml
```

Java properties (Language.properties) to Android (strings.xml):

```bash
	pootle -i Language.properties -f android
```

### iOS

iOS (Localizable.strings) to Java properties (Language.properties):

```bash
	pootle -i Localizable.strings
```

Java properties (Language.properties) to iOS (Localizable.strings):

```bash
	pootle -i Language.properties -f ios
```