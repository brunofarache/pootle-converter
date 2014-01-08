# Pootle Converter

This command-line tool helps converting Pootle translation files to Android (strings.xml) and iOS localization (Localizable.strings) files.

## Install

```
	[sudo] npm install pootle -g
```

## Usage

### Android

Android (strings.xml) to Java properties (Language.properties):

```
	pootle -i strings.xml
```

Java properties (Language.properties) to Android (strings.xml):

```
	pootle -i Language.properties -f android
```

### iOS

iOS (Localizable.strings) to Java properties (Language.properties):

```
	pootle -i Localizable.strings
```

Java properties (Language.properties) to iOS (Localizable.strings):

```
	pootle -i Language.properties -f ios
```