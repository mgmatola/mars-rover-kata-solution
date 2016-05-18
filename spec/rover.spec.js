var Rover = require('../src/rover');

describe('Rover', () => {

  var me;

  beforeEach(() => {
    me = Rover();
  });

  it('starts at ', () => {
    expect(me.status()).toEqual({ x: 3, y: 4, direction: 'N', encounteredObstacle: false});
  });

  it("- status object does not allow changes to Rover", () => {
    expect(me.status()).toEqual({ x: 3, y: 4, direction: 'N', encounteredObstacle: false});
    var statusCopy = me.status();
    statusCopy.x = 5;
    statusCopy.y = 5;
    statusCopy.direction = 'G';
    statusCopy.encounteredObstacle = true;
    expect(me.status()).toEqual({ x: 3, y: 4, direction: 'N', encounteredObstacle: false});
  });

  it('can follow set of arbitrary commands', () => {
    me.execute(['F', 'F', 'L', 'F', 'R', 'B']);
    expect(me.status()).toEqual({ x: 2, y: 5, direction: 'N', encounteredObstacle: false});
  });

  it('can make full cirlce of right turns', () => {
    me.execute(['R']);
    expect(me.status()).toEqual({ x: 3, y: 4, direction: 'E', encounteredObstacle: false});
    me.execute(['R']);
    expect(me.status()).toEqual({ x: 3, y: 4, direction: 'S', encounteredObstacle: false});
    me.execute(['R']);
    expect(me.status()).toEqual({ x: 3, y: 4, direction: 'W', encounteredObstacle: false});
    me.execute(['R']);
    expect(me.status()).toEqual({ x: 3, y: 4, direction: 'N', encounteredObstacle: false});
  });

  it('can make full cirlce of left turns', () => {
    me.execute(['L']);
    expect(me.status()).toEqual({ x: 3, y: 4, direction: 'W', encounteredObstacle: false});
    me.execute(['L']);
    expect(me.status()).toEqual({ x: 3, y: 4, direction: 'S', encounteredObstacle: false});
    me.execute(['L']);
    expect(me.status()).toEqual({ x: 3, y: 4, direction: 'E', encounteredObstacle: false});
    me.execute(['L']);
    expect(me.status()).toEqual({ x: 3, y: 4, direction: 'N', encounteredObstacle: false});
  });

  it('can go forward from each direction', () => {
    me.execute(['F']);
    expect(me.status()).toEqual({ x: 3, y: 5, direction: 'N', encounteredObstacle: false});
    me.execute(['R', 'F']);
    expect(me.status()).toEqual({ x: 4, y: 5, direction: 'E', encounteredObstacle: false});
    me.execute(['R', 'F']);
    expect(me.status()).toEqual({ x: 4, y: 4, direction: 'S', encounteredObstacle: false});
    me.execute(['R', 'F']);
    expect(me.status()).toEqual({ x: 3, y: 4, direction: 'W', encounteredObstacle: false});
  });

  it('can go back from each direction', () => {
    me.execute(['B']);
    expect(me.status()).toEqual({ x: 3, y: 3, direction: 'N', encounteredObstacle: false});
    me.execute(['R', 'B']);
    expect(me.status()).toEqual({ x: 2, y: 3, direction: 'E', encounteredObstacle: false});
    me.execute(['R', 'B']);
    expect(me.status()).toEqual({ x: 2, y: 4, direction: 'S', encounteredObstacle: false});
    me.execute(['R', 'B']);
    expect(me.status()).toEqual({ x: 3, y: 4, direction: 'W', encounteredObstacle: false});
  });

  it('can wrap N to S', () => {
    me.execute(['F', 'F', 'F', 'F', 'F', 'F', 'F']);
    expect(me.status()).toEqual({ x: 3, y: 1, direction: 'N', encounteredObstacle: false});
  });

  it('can wrap E to W', () => {
    me.execute(['R', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F']);
    expect(me.status()).toEqual({ x: 1, y: 4, direction: 'E', encounteredObstacle: false});
  });

  it('can wrap S to N', () => {
    me.execute(['B', 'B', 'B', 'B', 'B', 'B']);
    expect(me.status()).toEqual({ x: 3, y: 8, direction: 'N', encounteredObstacle: false});
  });

  it('can wrap W to E', () => {
    me.execute(['L', 'F', 'F', 'F', 'F', 'F']);
    expect(me.status()).toEqual({ x: 8, y: 4, direction: 'W', encounteredObstacle: false});
  });

  it('can avoid obstacles when approaching from left', () => {
    // Obstacle at { x: 7, y: 7}.
    me.execute(['F', 'F', 'F', 'R', 'F', 'F', 'F', 'F']);
    expect(me.status()).toEqual({ x: 6, y: 7, direction: 'E', encounteredObstacle: true});
  });

  it('can avoid obstacles when approaching from right', () => {
    // Obstacle at { x: 7, y: 7}.
    me.execute(['R', 'F', 'F', 'F', 'F', 'F', 'L', 'F', 'F', 'F', 'L', 'F']);
    expect(me.status()).toEqual({ x: 8, y: 7, direction: 'W', encounteredObstacle: true});
  });

  it('can avoid obstacles when approaching from top', () => {
    // Obstacle at { x: 5, y: 3}.
    me.execute(['R', 'F', 'F', 'R', 'F']);
    expect(me.status()).toEqual({ x: 5, y: 4, direction: 'S', encounteredObstacle: true});
  });

  it('can avoid obstacles when approaching from bottom', () => {
    // Obstacle at { x: 5, y: 3}.
    me.execute(['B', 'B', 'R', 'F', 'F', 'L', 'F']);
    expect(me.status()).toEqual({ x: 5, y: 2, direction: 'N', encounteredObstacle: true});
  });

});
