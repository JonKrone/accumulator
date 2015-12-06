var directionNames = "n ne e se s sw w nw".split(" ");
var directions = {
  "n":  new Vector( 0, -1),
  "ne": new Vector( 1, -1),
  "e":  new Vector( 1,  0),
  "se": new Vector( 1,  1),
  "s":  new Vector( 0,  1),
  "sw": new Vector(-1,  1),
  "w":  new Vector(-1,  0),
  "nw": new Vector(-1, -1)
};

var plan = ["############################",
            "#      #    #      o      ##",
            "#            ~             #",
            "#~         #####           #",
            "##         #   #    ##     #",
            "###           ##     #     #",
            "#           ###      #     #",
            "#   ####                   #",
            "#   ##       o             #",
            "# o  #         o       ### #",
            "#    #                     #",
            "############################"];

var valley = ["############################",
 			  "#####                 ######",
			  "##   ***     O          **##",
 			  "#   *##**         **  O  *##",
			  "#    ***          ##**    *#",
			  "# O     O         ##***    #",
			  "#           *     ##**     #",
			  "#          *#*             #",
			  "#**       **#**       O    #",
			  "#***      **##**         **#",
			  "##****    *###***       *###",
			  "############################"];

var dangerLand = [ "####################################################",
				   "#                 ####         ****              ###",
				   "#   *  @  ##                 ########       OO    ##",
				   "#   *    ##        O O                 ****       *#",
				   "#       ##*         @              ##########     *#",
				   "#      ##***  *         ****                     **#",
				   "#* **  #  *  ***      #########                  **#",
				   "#* **  #      *               #   *              **#",
				   "#     ##              #   O   #  ***          ######",
				   "#*            @       #       #   *        O  #    #",
				   "#*                    #  ######                 ** #",
				   "###          ****          ***                  ** #",
				   "#       O                        @         O       #",
				   "#   *     ##  ##  ##  ##               ###      *  #",
				   "#   **         #          O   *       #####  O     #",
				   "##  **  O   O  #  #    ***  ***        ###      ** #",
				   "###               #   *****                    ****#",
				   "####################################################"];
// var dangerLand = [ "####################################################",
// 				   "#                 ####         ****              ###",
// 				   "#   *     ##                 ########             ##",
// 				   "#   *    ##          O                 ****       *#",
// 				   "#       ##*         @              ##########     *#",
// 				   "#      ##***  *         ****                     **#",
// 				   "#* **  #  *  ***      #########                  **#",
// 				   "#* **  #      *               #   *              **#",
// 				   "#     ##              #       #  ***          ######",
// 				   "#*                    #       #   *           #    #",
// 				   "#*                    #  ######                 ** #",
// 				   "###          ****          ***                  ** #",
// 				   "#                                                  #",
// 				   "#   *     ##  ##  ##  ##               ###      *  #",
// 				   "#   **         #              *       #####        #",
// 				   "##  **         #  #    ***  ***        ###      ** #",
// 				   "###               #   *****                    ****#",
// 				   "####################################################"];

function Grid (width, height) {
	this.space = new Array(width * height);
	this.width = width;
	this.height = height;
}
Grid.prototype.forEach = function (f, context) {
	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
			var value = this.space[x + y * this.width];
			if (value != null)
				f.call(context, value, new Vector(x, y));
		}
	}
};
Grid.prototype.isInside = function(vector) {
	return vector.x >= 0 && vector.x < this.width &&
		   vector.y >= 0 && vector.y < this.height;
};
Grid.prototype.get = function(vector) {
	return this.space[vector.x + this.width * vector.y];
};
Grid.prototype.set = function(vector, value) {
	this.space[vector.x + this.width * vector.y] = value;
};
// Grid.prototype.directionTo = function(vector, other) {
// 	// find ray from vector to other, translate to direction
// 	var diff = other.minus(vector);
// 	var angle = 180 + 180 / Math.PI * Math.atan2(-diff.x, -diff.y);
// 	console.log(angle);
// 	for (key in directions) {
// 		if (directions[key].x == diff.x && directions[key].y == diff.y)
// 			return key
// 	}
// 	return 
// };

function World(map, legend) {
	var grid = new Grid(map[0].length, map.length);
	this.grid = grid; // Created for access within map.forEach because it removes us from the
	this.legend = legend;					// function scope of the constructor

	map.forEach(function(line, y) {
		for (var x = 0; x < line.length; x++)
			grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
	});
}
World.prototype.turn = function() {
	var acted = [];
	this.grid.forEach(function(critter, vector) {
		if (critter.act && acted.indexOf(critter) == -1) {
			acted.push(critter);
			this.letAct(critter, vector);
		}
	}, this);
};
World.prototype.letAct = function(critter, vector) {
	var action = critter.act(new View(this, vector));
	if (action && action.type == "move") {
		var dest = this.checkDestination(action, vector);
		if (dest && this.grid.get(dest) == null) {
			this.grid.set(vector, null);
			this.grid.set(dest, critter);
		}
	}
};
World.prototype.checkDestination = function(action, vector) {
  if (directions.hasOwnProperty(action.direction)) {
    var dest = vector.plus(directions[action.direction]);
    if (this.grid.isInside(dest)) return dest;
  }
};
World.prototype.toString = function() {
	var output = "";
	for (var y = 0; y < this.grid.height; y++) {
		for(var x = 0; x < this.grid.width; x++) {
			var e = this.grid.get(new Vector(x, y));
			output += charFromElement(e);
		}
		output += "\n";
	}
	return output + "\033[0G";
};

function LifelikeWorld(map, legend) {
	World.call(this, map, legend);
}
LifelikeWorld.prototype = Object.create(World.prototype);

var actionTypes = Object.create(null);

LifelikeWorld.prototype.letAct = function(critter, vector) {
	var action = critter.act(new View(this, vector));
	var handled = action && action.type in actionTypes &&
					actionTypes[action.type].call(this, critter, vector, action);
	if (!handled) {
		critter.energy -= 0.2;
		if (critter.energy <= 0)
			this.grid.set(vector, null);
	}
};

actionTypes.grow = function(critter) {
	critter.energy += 0.5;
	return true;
};
actionTypes.move = function(critter, vector, action) {
	var dest = this.checkDestination(action, vector);
	if (dest == null || critter.energy <= 1 || this.grid.get(dest) != null)
		return false;
	critter.energy -= 1;
	this.grid.set(vector, null);
	this.grid.set(dest, critter);
	return true;
}
actionTypes.eat = function(critter, vector, action) {
	var animalType = critter.originChar;
	var dest = this.checkDestination(action, vector);
	var eatWhat = this.grid.get(dest);

	var atDest = dest != null && eatWhat;
	if (!atDest || atDest.energy == null)
		return false;
	// console.log(critter, "eating", eatWhat);
	// var eatWhat = elementFromChar(this.legend, this.grid.get(dest));

	if (animalType == "O") {
		atDest.energy -= 20;
		critter.energy += 15;
	} 
	if (animalType == "@") {
		// console.log("AntEater is eating", eatWhat);
		critter.energy += atDest.energy * 1.5;
		atDest.energy = -1;
	}
	if (atDest.energy <= 0) {
		this.grid.set(dest, null);
	}
	return true;
};
actionTypes.reproduce = function(critter, vector, action) {
	var baby = elementFromChar(this.legend, critter.originChar);
	var dest = this.checkDestination(action, vector);

	if (dest == null ||
			critter.energy <= Math.min(2 * baby.energy, critter.energy/3) ||
				this.grid.get(dest) != null)
		return false
	critter.energy -= Math.min(2 * baby.energy, critter.energy/3);
	this.grid.set(dest, baby);
	return true;
};

function View(world, vector) {
	this.world = world;
	this.vector = vector;
}
View.prototype.look = function(dir) {
	var target = this.vector.plus(directions[dir]);
	if (this.world.grid.isInside(target))
		return charFromElement(this.world.grid.get(target));
	return "#";
};
View.prototype.findAll = function(ch) {
	var found = [];
	for (var dir in directions)
		if (this.look(dir) == ch)
			found.push(dir);
	return found;
};
View.prototype.find = function(ch) {
	var found = this.findAll(ch);
	if (found.length == 0) return null;
	return randomElement(found);
};
// View.prototype.findFar = function(ch) {
// 	var found = [];
// 	for (var adjacent in directions) {
// 		var newView = new View(this.world, this.vector.plus(directions[adjacent]));

// 		for (var farDir in newView.findAll(ch)) {
// 			found.push(this.world.grid.directionTo(this.vector, directions.farDir));
// 		}
// 	}
// 	found = [].concat.apply([], found);


// 	if (found.length == 0) {
// 		return null;
// 	}
// 	console.log("looking for", ch, "and found:", found);
// 	return randomElement(found);
// };


function Wall() {}

function BouncingCritter() {
	this.direction = randomElement(directionNames);
};
BouncingCritter.prototype.act = function(view) {
	if (view.look(this.direction) != " ")
		this.direction = view.find(" ") || "s";
	return {type: "move", direction: this.direction};
};

function WallFollower() {
	this.dir = "s";
}
WallFollower.prototype.act = function(view) {
	var start = this.dir;
	if (view.look(dirPlus(this.dir, -3)) != " ")
		start = this.dir = dirPlus(this.dir, -2);
	while (view.look(this.dir) != " ") {
		this.dir = dirPlus(this.dir, 1);
		if (this.dir == start) break;
	}
	return {type: "move", direction: this.dir };
};

function Plant() {
	this.energy = 3 + Math.random() * 4;
}
Plant.prototype.act = function(view) {
	if (this.energy > 15) {
		var space = view.find(" ");
		if (space)
			return {type: "reproduce", direction: space};
	}
	if (this.energy < 20)
		return {type: "grow"};
};

function PlantEater() {
	this.energy = 20;
}
PlantEater.prototype.act = function(view) {
	var space = view.find(" ");
	if (this.energy > 60 && space)
		return {type: "reproduce", direction: space};
	var plant = view.find("*");
	if (plant)
		return {type: "eat", direction: plant};
	if (space)
		return {type: "move", direction: space};
};

function SmartHerbivore() {
	this.energy = 20;
}
SmartHerbivore.prototype.act = function(view) {
	var space = view.find(" ");
	if (this.energy > 60 && space)
		return {type: "reproduce", direction: space};
	var plant = view.find("*");
	if (plant)
		return {type: "eat", direction: plant};
	if (space)
		return {type: "move", direction: space};
};

function AntEater() {
	this.energy = 60;
}
AntEater.prototype.act = function(view) {
	var space = view.find(" ");
	if (this.energy > 90 && space) {
		return {type: "reproduce", direction: space}
	}

	var food = view.find("O");
	if (food) {
		return {type: "eat", direction: food};
	}
	if (space)
		return {type: "move", direction: space};
};

function Vector(x, y) {
	this.x = x;
	this.y = y;
}
Vector.prototype.plus = function(other) {
	return new Vector(this.x + other.x, this.y + other.y);
};
Vector.prototype.minus = function(other) {
	return new Vector(this.x - other.x, this.y - other.y);
}

function dirPlus(dir, n) {
	var index = directionNames.indexOf(dir);
	return directionNames[(index + n + 8) % 8];
}

function elementFromChar(legend, ch) {
	if (ch == " ") return null;

	var e = new legend[ch]();
	e.originChar = ch;
	return e;
}
function charFromElement(e) {
	if (e == null) return " ";
	return e.originChar;
}

function randomElement(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

var sleep = require('sleep');

var caveWorld = new World(plan, {"#": Wall,
							 "o": BouncingCritter,
							 "~": WallFollower });
// for (var i = 0; i < 5; i++) {
// 	caveWorld.turn();
// 	sleep.usleep(300000);
// 	process.stdout.write(caveWorld.toString());
// 	// console.log(world.toString());
// }


var valleyWorld = new LifelikeWorld(valley, {"#": Wall,
								   "*": Plant,
								   "O": SmartHerbivore});
// for (var i = 0; i < 500; i++) {
// 	valleyWorld.turn();
// 	sleep.usleep(300000);
// 	process.stdout.write(valleyWorld.toString());
// 	// console.log(world.toString());
// }

var dangerWorld = new LifelikeWorld(dangerLand, {"#": Wall,
												"@": AntEater,
												"O": SmartHerbivore,
												"*": Plant});
for (var i = 0; i < 500; i++) {
	dangerWorld.turn();
	sleep.usleep(350000);
	process.stdout.write(dangerWorld.toString());
	// console.log(world.toString());
}