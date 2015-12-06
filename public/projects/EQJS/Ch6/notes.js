function speak(phrase) {
		console.log("The " + this.type + " rabbit says '" + phrase + "'\n");
}

var fatRabbit = {type: "fat", speak: speak };

speak.apply(fatRabbit, ["Burp!", "Suckle.."]);
speak.call(fatRabbit, ["Burp!", "Suckle.."]);


						//  PROTOTYPES 	//
var empty = {};
console.log(empty.toString);
console.log(empty.toString(), "\n\n");

// Object.prototype is the superparent of most every Object
// Function.prototype is the superparent of all Functions but Object.prototype is its prototype.
// Array.prototype is the superparent of all Arrays but Object.prototype is its prototype.
console.log(Object.prototype);
console.log(Function.prototype);
console.log(Array.prototype);
console.log("\n");


var protoRabbit = {
	speak: function(line) {
		console.log("The " + this.type + " rabbit says '" + line + "'");
	}
};
var fluffy = Object.create(protoRabbit);
fluffy.type = "killer";
fluffy.speak("SKREEEE!");

function Rabbit(type) {
	this.type = type;
}
var fluffy2 = new Rabbit("killer");
var dead = new Rabbit("dead");
console.log(fluffy2, dead);
console.log("\n");

Rabbit.prototype.speak = function(phrase) {
	console.log("The " + this.type + " rabbit says '" + phrase + "' with " + this.teeth + " teeth");
}
Rabbit.prototype.teeth = "small, ground";
fluffy2.teeth = "long, sharp, and bloody";

fluffy2.speak("You're dead");
dead.speak("I know");
// The prototype of a constructor is Function.prototype and not the prototype property
// contained within the constructor.


fluffy2.speak("I'm gonna eat you");
dead.speak("But you're a herbivore!");