
# Motif

This is a decomissioned project, which exists only for historical purposes. Built in an era where IE6 was the coolest browser on the block.

## Javascript object framework

The Motif Javascript object collection was designed to add interactive content to web pages using simple declarations in XHTML with JSON syntax. It exists of several core classes which add support for inheritance and script inclusion but the major amount of classes are UI parts and helpers.

### Packages, objects & dependencies

Packages are defined with javascript the object initializer statement 

	Motif = {};

once created objects are attached as members of the object.

Objects can be either initialized or are static, a static object is part of the framework and therefor can be directly used, static object is written like 
	
	Motif.Object = {};

The initilizers are function types which can be contructed with the new operator these are written like

	Motif.Object = function() {};

Most objects are defined in files with a similar name. (exceptions are made for objects which only apply to the defined class.) `Motif.page.include`(script) supplies the dependency inclusion possibility. When extending an object or simply reuse one, the script file name corresponds to the contents which makes inclusion a bit more transparent.

### Reuse & Inheritance

Creating derived classes can be done simply by invoking a function object within the derived function object. 

	Motif.Derived = function() {
		this.inheritFrom = Motif.Object; 
		this.inheritFrom();
	}; 

On the other hand we have a Motif.Utility.extend method which is compatible with this idea and adds base method references which makes overriding and a base reference possible.

### Controls

`Motif.Ui.Controls` is the package with the result objects. These objects add a greater user experience to web based applications and empower the end user to get tasks done faster. Anything derived from the `Motif.Ui.Controls.Control` object can be loaded by using XHTML syntax and therefor easy to declare and configure.

### Class Reference

[rayraegah.github.io/motif](http://rayraegah.github.io/motif/docs/motif/1.7.14/)