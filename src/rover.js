module.exports = function() {

  // Use strict mode to allow more ES6 features in Node.js.
  'use strict';

  // Scenario setup.
  const marsSize = 10;
  const obstacles = [
    { x: 7, y: 7 },
    { x: 8, y: 8 },
    { x: 5, y: 3 }
  ];

  // State variables with intitial values.
  let x = 3;
  let y = 4;
  let direction = 0;
  let encounteredObstacle = false;

  // Directions are stored as integers. Letters are for display.
  const directions = {
    0: 'N',
    1: 'E',
    2: 'S',
    3: 'W',
    length: 4
  }

  /* Private helper functions. */

  const isOccupied = () => {
    return obstacles.some((obstacle) => obstacle.x === x && obstacle.y === y);
  };

  const rotateRight = () => {
    direction++;
    direction %= directions.length;
  };

  const rotateLeft = () => {
    direction--;
    if (direction < 0) {
      direction += directions.length;
    }
  };

  const incrementX = () => {
    var previousX = x;
    x++;
    x %= marsSize;
    if (isOccupied()) {
      encounteredObstacle = true;
      x = previousX;
    }
  };

  const decrementX = () => {
    var previousX = x;
    x--;
    if (x < 0) {
      x += marsSize;
    }
    if (isOccupied()) {
      encounteredObstacle = true;
      x = previousX;
    }
  };

  const incrementY = () => {
    var previousY = y;
    y++;
    y %= marsSize;
    if (isOccupied()) {
      encounteredObstacle = true;
      y = previousY;
    }
  };

  const decrementY = () => {
    var previousY = y;
    y--;
    if (y < 0) {
      y += marsSize;
    }
    if (isOccupied()) {
      encounteredObstacle = true;
      y = previousY;
    }
  };

  /* Private helper command map. */

  const commandLookup = {
    'R': rotateRight,
    'L': rotateLeft,
    'F': {
      0: incrementY,
      1: incrementX,
      2: decrementY,
      3: decrementX
    },
    'B': {
      0: decrementY,
      1: decrementX,
      2: incrementY,
      3: incrementX
    }
  };

  /* Public methods. */

  // Cannot freeze object returned by status due to bug in Jasmine's
  // toEqual() when testing frozen objects.
  const status = () => ({
    x: x,
    y: y,
    direction: directions[direction],
    encounteredObstacle: encounteredObstacle
  });

  const execute = (commands) => {
    commands.forEach((command) => {
      typeof commandLookup[command] === 'function'
        ? commandLookup[command]()
        : commandLookup[command][direction]();
    });
    //console.log(commands, status());
  }

  return Object.freeze({
    status,
    execute
  });

};
