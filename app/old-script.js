var LEVELS = require('levels');

ShuffleGrid = require("shufflegrid");


/* AIShuffleGrid ************************************************************/

// Nodes contain expected cost and current state
// Expected cost is calculated from the past path cost plus heuristic future cost
// Future cost is estimated by taking the sum of the distances of each tile from their correct positions

// First generate the initial node from the initial grid state
// Go down the tree repeatedly selecting the children with the lowest expected cost
// Once you reach a node with no children then generate it's children and add them to the tree
// Calculate expected values for the children and propagate the minimum of those up the tree, updating the 
// expected values of all of the nodes above it to be equal to the minimum of their respective children
// Once a node is reached which has a future cost of 0 then a solution has been found, calculate solution from tree


function generateRoot(shuffleGrid) {
    var root = {};
    root.state = [];
    for (var y=0; y<shuffleGrid.tiles.length; y++) {
        root.state[y] = [];
        for (var x=0; x<shuffleGrid.tiles[0].length; x++) {
            if (shuffleGrid.tiles[y][x] == null) {
                root.state[y][x] = null;
            } else {
                root.state[y][x] = [shuffleGrid.tiles[y][x].data("y"), shuffleGrid.tiles[y][x].data("x")];
            }
        }
    }

    root.parent = null;
    root.lastTile = null;
    root.g = 0;
    root.h = futurePathCost(root);
    root.f = root.h;

    return root;
}

// Sum the distances of each tile from its correct position
function futurePathCost(node) {
    var total = 0;
    for (var y=0; y<node.state.length; y++) {
        for (var x=0; x<node.state[0].length; x++) {
            var tile = node.state[y][x];
            if (tile == null) continue;
            total += Math.abs(y-tile[0]) + Math.abs(x-tile[1]);
        }
    }
    return total;
}

function selectRecursively(node) {
    // Assume that the children are already sorted in ascending order
    while (typeof node.children !== "undefined") {
        node = node.children[0];
    }
    return node;
}

function generateChildren(node) {
    node.children = [];
    // First find null tile
    for (var y=0; y<node.state.length; y++) {
        for (var x=0; x<node.state[0].length; x++) {
            var tile = node.state[y][x];
            if (tile == null) {
                var nully = y;
                var nullx = x;
            }
        }
    }

    // Try selecting the tiles adjacent to the null tile
    var tiles = [];

    if (nullx >= 1) tiles.push(node.state[nully][nullx-1]);  // Left of null tile
    if (nullx < node.state[0].length-1) tiles.push(node.state[nully][nullx+1]);  // Right of null tile

    if (nully >= 1) tiles.push(node.state[nully-1][nullx]);  // Above null tile
    if (nully < node.state.length-1) tiles.push(node.state[nully+1][nullx]);  // Below null tile

    // For each movable tile, generate a new child with that tile moved into the null tile position
    // Skip over the tile if it was the last tile to be moved (duplicate moves can never be useful)
    for (var i=0; i<tiles.length; i++) {
        var tileToMove = tiles[i];
        if (node.lastTile === tileToMove) continue;
        
        // Generate new node and set its state
        var newNode = {};
        newNode.state = [];
        for (var y=0; y<node.state.length; y++) {
            newNode.state[y] = [];
            for (var x=0; x<node.state[0].length; x++) {
                var oldTile = node.state[y][x];
                if (oldTile === tileToMove) {
                    newNode.state[y][x] = null;
                } else if (nully === y && nullx === x) {
                    newNode.state[y][x] = tileToMove;
                } else {
                    newNode.state[y][x] = oldTile;
                }
            }
        }

        // Create all other values for the node
        newNode.parent = node;
        newNode.lastTile = tileToMove;
        newNode.g = node.g + 1;
        newNode.h = futurePathCost(newNode);
        newNode.f = newNode.g + newNode.h;

        node.children.push(newNode);

    }

    // Update the f values for all of the nodes parents in the tree
    updateRecursively(node);
    
}

function updateRecursively(node) {
    while (node.parent !== null) {
        // Sort children in ascending order by f value (most promising first)
        node.children.sort(function(a, b) {return a.f-b.f});
        
        // Update f value of current node to be the minimum of its children
        node.f = node.children[0].f;

        // Keep going up until the top of the tree has been reached
        node = node.parent;
    }
}

function iterate(rootNode) {
    var selectedNode = selectRecursively(rootNode);
    if (selectedNode.h === 0) return true;
    generateChildren(selectedNode);
    updateRecursively(selectedNode);
    return false;
}

function iterations(rootNode, number) {
    for (var i=0; i<number; i++) {
        if (iterate(rootNode)) {
            return true;
        }
    }
    return false;
}


function makeAIControlled(shuffleGrid) {

    var MOVE_INTERVAL = 1000;
    var NUM_ITERATIONS = 30;

    var makeMove = function(root) {
        // First perform some iterations
        var solutionFound = iterations(root, NUM_ITERATIONS);
        if (solutionFound) {
            $("#floppy-thoughts").html("<em>I think I've got it!</em>");
        }

        // Set the new root to the most promising child, chop off unreachable branches
        root = root.children[0];
        root.parent = null;

        // Find out which shuffle grid tile corresponds to the node tile
        var lastTile = root.lastTile;
        for (var y=0; y<shuffleGrid.tiles.length; y++) {
            for (var x=0; x<shuffleGrid.tiles[0].length; x++) {
                var $gridTile = shuffleGrid.tiles[y][x];
                if ($gridTile !== null && lastTile[0] == $gridTile.data("y") && lastTile[1] == $gridTile.data("x")) {
                    var $tileToMove = $gridTile;
                }
            }
        }

        shuffleGrid._tryMoveTile($tileToMove, function(moved) {
            if (!moved) {
                console.log("Tile was not moved: " + lastTile);
            } else {
                if (shuffleGrid._numIncorrect() === 0) {
                    // AI has successfully completed the grid!
                    shuffleGrid._gridCompleted();
                } else {
                    // Still moves to go, schedule next move
                    setTimeout(function() {makeMove(root);}, MOVE_INTERVAL);
                }
            }
        });
    }

    var startAI = function() {
        $("#floppy-thoughts").html("<em>Lets begin!</em>");

        var root = generateRoot(shuffleGrid);
        setTimeout(makeMove(root), MOVE_INTERVAL);
    }

    shuffleGrid.start = function(completionCallback) {
        shuffleGrid.completionCallback = completionCallback;
        shuffleGrid._randomShuffle(startAI);
    };
}


/* ready ********************************************************************/

function startEverything() {

    var level = LEVELS[1];

    var playerFinished = false;
    var playerShuffleGrid = new ShuffleGrid(level, $("#player-container"), 420, 420);
    playerShuffleGrid.start(function() {
        playerFinished = true;
        console.log("You completed your grid in "+playerShuffleGrid.movesTaken+" moves!");
    });

    var floppyShuffleGrid = new ShuffleGrid(level, $("#ai-container"), 240, 240);
    makeAIControlled(floppyShuffleGrid);
    floppyShuffleGrid.start(function() {
        console.log("Floppy completed his grid in "+floppyShuffleGrid.movesTaken+" moves!");
        if (playerFinished) {
            $("#floppy-thoughts").html("<em>You beat me, well done!</em>");
        } else {
            $("#floppy-thoughts").html("<em><strong>Yay!</strong> I won!</em>");
        }
    });

}

module.exports.startEverything = startEverything;
