const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext('2d');

//Part of : how many cases, what's the size ...
var nb_case = Math.floor(screen.width/10);	//Math.floor(screen.width/25);
console.log("%c Number of case for a line : " , "color: red");
console.log(nb_case);
console.log("%c Number of in the entire square : " , "color: red");
console.log(nb_case**2);
const difficulty = 2/10;
canvas.width = nb_case*10;
var w_canvas = canvas.width;
var case_size = w_canvas/nb_case;
canvas.height = nb_case*10;

//Part for all of the variable that is used
var grid = new Array (nb_case);
var i;
var j;
var xA;
var yA;
var xB;
var yB; 
var path;
var closedList = [];	//closedList gonna contain all the cell that were been visited
var openList = [];		//openList gonna contain all the neighbors for the last cell visited

//Random spawn for the point A and B
xA = Math.floor(Math.random() * (nb_case - 1) + 1) - 1;
yA = Math.floor(Math.random() * (nb_case - 1) + 1) - 1;
xB = Math.floor(Math.random() * (nb_case - 1) + 1) - 1;
yB = Math.floor(Math.random() * (nb_case - 1) + 1) - 1;
var start;
var end;
const nexus_color = "yellow"; //Color of the two points
var path = [];

//Creation of the grid
for (i = 0; i < nb_case; i++){
 	ctx.beginPath();
 	ctx.moveTo(0,i*case_size);
 	ctx.lineTo(w_canvas,i*case_size);
 	ctx.stroke();
 	ctx.closePath();
/*-------------------------------*/
 	ctx.beginPath();
 	ctx.moveTo(i*case_size,0);
 	ctx.lineTo(i*case_size,w_canvas);
 	ctx.stroke();
 	ctx.closePath();
}

//Function for each cell
function Cells(i,j){
	this.i = i;
	this.j = j;
	this.wall = false;
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.show = function(color){
		ctx.fillStyle = color;
		ctx.fillRect(this.i*case_size,this.j*case_size,case_size,case_size);
	}
	this.neighbors = [];
	this.previous = undefined;
	this.addNeighbors = function(grid) {
		i = this.i;
		j = this.j;
		if(i < nb_case - 1){
			this.neighbors.push(grid[i+1][j]);
		}
		if (i > 0){
			this.neighbors.push(grid[i-1][j]);
		}
		if (j < nb_case - 1){
			this.neighbors.push(grid[i][j+1]);
		}
		if (j > 0){
			this.neighbors.push(grid[i][j-1]);
		}
	}
}

//Initialisation of all the cell
for (i = 0; i < nb_case; i++){
	grid[i] = new Array (nb_case);
}

for (i = 0; i < nb_case; i++){
	for(j = 0; j < nb_case; j++){
		grid[i][j] = new Cells(i,j);
	}
}

for (i = 0; i < nb_case; i++){
	for(j = 0; j < nb_case; j++){
		grid[i][j].addNeighbors(grid);
	}
}

for (i = 0; i < nb_case; i++){
	for(j = 0; j < nb_case; j++){
		if (Math.random()<difficulty){
			grid[i][j].wall = true;
			grid[i][j].show("#000");
		}
	}		
}

//Initialising the two points
start = grid[xA][yA];
console.group("%c Coordinates of the start" , "color: yellow");
console.log("x : " + start.i);
console.log("y : " + start.j);
console.groupEnd();
end = grid[xB][yB];
console.group("%c Coordinates of the end" , "color: yellow");
console.log("x : " + end.i);
console.log("y : " + end.j);
console.groupEnd();
grid[xA][yA].show(nexus_color);
grid[xB][yB].show(nexus_color);
start.wall = false;
end.wall = false;

openList.push(start);


//Principal function
function A(){
	if (openList.length > 0){
		var lowestIndex = 0;

		//Searching of the cell with the littler index of path to go to the point 2
		for (i = 0; i < openList.length; i++){
			if(openList[i].f < openList[lowestIndex].f){
				lowestIndex = i;
			}
			if(openList[i].f == openList[lowestIndex].f){
				if (openList[i].g == openList[lowestIndex].g){
					lowestIndex = i;
				}
			}
		}
		var current = openList[lowestIndex];

		//Try if the current cell is the point 2
		if (current === end){
			console.log("Finis !");
			var temp = current;
			path.push(temp);
			while(temp.previous){
				path.push(temp.previous);
				temp = temp.previous;
			}

			//Display of the good path with the orange color for each cell in the good path
			for (i = 0; i < path.length; i++){
				if (i==0){
					grid[path[i].i][path[i].j].show(nexus_color);
				}else if(i == path.length-1){
					grid[path[i].i][path[i].j].show(nexus_color);
				}else{
					grid[path[i].i][path[i].j].show("orange");
				}
			}
			console.log("%c Path length : " , "color: orange");
			console.log(path.length);
			return -1, false;
		}

		//We actualise the list
		RemoveFromArray(this.openList, current);
		closedList.push(current);

		//Testing all of the neighbors of the current cell (max 3)
		var neighbors = current.neighbors;
		for (i = 0; i < neighbors.length; i++){
			var neighbor = neighbors[i];

			//If he's not a wall and he's not yet visited
			if (!closedList.includes(neighbor) && !neighbor.wall){
				var tempG = current.g + heuristic(neighbor, current);	//Potential futur cost of the cell (increase by 1)
				
				//If the neighbor is unknow of the list... We add it
				if (!openList.includes(neighbor)){
					openList.push(neighbor);
				}else if (tempG >= neighbor.g){
					continue
				}
				neighbor.g = tempG;											//The cost of the cell increased
				neighbor.h = heuristic(neighbor, end); //Vector of the distance (A <-> B)
				neighbor.f = neighbor.g + neighbor.h;	//Adjust the heuristic
				neighbor.previous = current;
			}
		}
	}else{
		console.log("Pas d'issue");
		alert("Aucune issue existante")
		return -1, false;
	}	

	//Display all the neighbors cells
	for(i = 0; i < openList.length; i++){
		if (openList[i].i==xA && openList[i].j==yA){
			grid[openList[i].i][openList[i].j].show(nexus_color);
		}else if(openList[i].i==xB && openList[i].j==yB){
			grid[openList[i].i][openList[i].j].show(nexus_color);
		}else{
			grid[openList[i].i][openList[i].j].show("red");
		}
	}

	//Display all the visited cells
	for(i = 0; i < closedList.length; i++){
		if (closedList[i].i==xA && closedList[i].j==yA){
			grid[closedList[i].i][closedList[i].j].show(nexus_color);
		}else if(closedList[i].i==xB && closedList[i].j==yB){
			grid[closedList[i].i][closedList[i].j].show(nexus_color);
		}else{
			grid[closedList[i].i][closedList[i].j].show("blue");
		}
	}
}

//Function to calculate the actual heuristic of the current cell compared to point B
function heuristic(a,b){
	var d = Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
	return d*2;
}

//Function to remove an element from an array
function RemoveFromArray(arr, elt){
	for (i = arr.length - 1; i >= 0; i--) {
		if (arr[i] == elt){
			arr.splice(i, 1);
		}
	}
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

var interval = setInterval(A,1);
