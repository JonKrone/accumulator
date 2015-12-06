var util = require('util');

// EQJS exercise 1
function Vector (x, y) {
	this.x = x;
	this.y = y;
}
Vector.prototype.plus = function(vec) {
	return new Vector(this.x + vec.x, this.y + vec.y);
};
Vector.prototype.minus = function(vec) {
	return new Vector(this.x - vec.x, this.y - vec.y);
};
Object.defineProperty(Vector.prototype, "length", {
	get: function() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}
});

// Testing our new Vector
console.log(new Vector(1, 2).plus(new Vector(2, 3)));
console.log(new Vector(1, 2).minus(new Vector(2, 3)));
console.log(new Vector(3, 4).length);


// StretchCell activity located in EQJS_Ch6_tablebuilder
// Sequence Interface, Exercise 3

function Iterator(collection) {
	this.length = collection.length;
	this.first = this.compile(collection);

	this.current = this.first;
}
Iterator.prototype.compile = function(collection) {
	var _next = null;
	for (var i = this.length - 1; i >= 0; i--) {
		_next = {
			content: collection[i],
			next: _next
		};
	}
	return _next;
};
Iterator.prototype.next = function() {
	var next = this.current.next;
	var toReturn = this.current.content;

	if (next == null) {
		// console.log("Reached end of collection, redirect to beginning.");
		this.current = this.first;
	}
	this.current = next;
	return toReturn;

};

function ArraySeq(arr) {
	Iterator.call(this, arr);
}
ArraySeq.prototype = Object.create(Iterator.prototype);
function RangeSeq(start, end, step) {
	if (isNaN(step)) step = 1;
	
	var arr = [];
	for (var i = start; i < end; i += step) {
		arr[i - start] = i;
	}

	ArraySeq.call(this, arr);
}
RangeSeq.prototype = Object.create(Iterator.prototype);

function logFive(iterator) {
	// console.log(iterator);
	for (var i = 0; i < Math.min(iterator.length, 5); i++) {
		console.log(iterator.next());
	}
	console.log("\n");
}


var iter = new Iterator([1, 3, 5, 7, 9, 11]);
console.log(util.inspect(iter.current, {showHidden: false, depth: null}));
logFive(iter);
// logFive(new Iterator([1, 2]));
logFive(new ArraySeq([1, 2]));
logFive(new RangeSeq(100, 1000));

/*Design an interface that abstracts iteration over a collection of values.
An object that provides this interface represents a sequence, and the interface
must somehow make it possible for code that uses such an object to iterate over
the sequence, looking at the element values it is made up of and having some way to find out when the end of the sequence is reached.

When you have specified your interface, try to write a function logFive that takes
a sequence object and calls console.log on its first five elements—or fewer, if the
sequence has fewer than five elements.

Then implement an object type ArraySeq that wraps an array and allows iteration over
the array using the interface you designed. Implement another object type RangeSeq
that iterates over a range of integers (taking from and to arguments to its constructor)
instead.*/