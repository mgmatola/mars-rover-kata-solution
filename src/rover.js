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

  // Directions are stored as integers. Letters are for display.
  const directions = Object.freeze({
    0: 'N',
    1: 'E',
    2: 'S',
    3: 'W',
    length: 4
  });

  // State variables with intitial values.
  const state = {
    x: 3,
    y: 4,
    direction: 0,
    encounteredObstacle: false
  };

  /* Private helper functions. */

  const isOccupied = () => {
    return obstacles.some((obstacle) => obstacle.x === state.x && obstacle.y === state.y);
  };

  const wrap = (modulo) =>
    (a, b) => (((a + b) % modulo) + modulo) % modulo;

  const wrapMars = wrap(marsSize);
  const wrapDirection = wrap(directions.length); // Safe, now that directions has been frozen.

  const rotate = (delta) => {
    return () => {
      state.direction = wrapDirection(state.direction, delta);
    };
  };

  const rotateRight = rotate(1);
  const rotateLeft = rotate(-1);

  const move = (coordinate, delta) => {
    return () => {
      var previous = state[coordinate];
      state[coordinate] = wrapMars(state[coordinate], delta);
      if (isOccupied()) {
        state.encounteredObstacle = true;
        state[coordinate] = previous;
      }
    };
  };

  const moveOneSpaceAlongXAxis = move('x', 1);
  const moveOneSpaceAlongYAxis = move('y', 1);
  const moveMinusOneSpaceAlongXAxis = move('x', -1);
  const moveMinusOneSpaceAlongYAxis = move('y', -1);

  /* Private helper command map. */

  const commandLookup = {
    'R': rotateRight,
    'L': rotateLeft,
    'F': {
      0: moveOneSpaceAlongYAxis,
      1: moveOneSpaceAlongXAxis,
      2: moveMinusOneSpaceAlongYAxis,
      3: moveMinusOneSpaceAlongXAxis
    },
    'B': {
      0: moveMinusOneSpaceAlongYAxis,
      1: moveMinusOneSpaceAlongXAxis,
      2: moveOneSpaceAlongYAxis,
      3: moveOneSpaceAlongXAxis
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
  };

  return Object.freeze({
    status,
    execute
  });

};
