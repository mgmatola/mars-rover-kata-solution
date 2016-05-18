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
  const state = {
    x: 3,
    y: 4,
    direction: 0,
    encounteredObstacle: false
  };

  // Directions are stored as integers. Letters are for display.
  const directions = {
    0: 'N',
    1: 'E',
    2: 'S',
    3: 'W',
    length: 4
  };

  /* Private helper functions. */

  const isOccupied = () => {
    return obstacles.some((obstacle) => obstacle.x === state.x && obstacle.y === state.y);
  };

  const rotateRight = () => {
    state.direction++;
    state.direction %= directions.length;
  };

  const rotateLeft = () => {
    state.direction--;
    if (state.direction < 0) {
      state.direction += directions.length;
    }
  };

  const increment = (coordinate) => {
    return () => {
      var previous = state[coordinate];
      state[coordinate]++;
      state[coordinate] %= marsSize;
      if (isOccupied()) {
        state.encounteredObstacle = true;
        state[coordinate] = previous;
      }
    };
  };

  const incrementX = increment('x');
  const incrementY = increment('y');

  const decrement = (coordinate) => {
    return () => {
      var previous = state[coordinate];
      state[coordinate]--;
      if (state[coordinate] < 0) {
        state[coordinate] += marsSize;
      }
      if (isOccupied()) {
        state.encounteredObstacle = true;
        state[coordinate] = previous;
      }
    };
  };

  const decrementX = decrement('x');
  const decrementY = decrement('y');

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
    x: state.x,
    y: state.y,
    direction: directions[state.direction],
    encounteredObstacle: state.encounteredObstacle
  });

  const execute = (commands) => {
    commands.forEach((command) => {
      typeof commandLookup[command] === 'function'
        ? commandLookup[command]()
        : commandLookup[command][state.direction]();
    });
    //console.log(commands, status());
  }

  return Object.freeze({
    status,
    execute
  });

};
