const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const unsolved_puzzle_string = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
const solved_puzzle_string = "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
const unsolved_puzzle_string_brk = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37x";
const unsolved_puzzle_string_not = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37";
const unsolved_puzzle_string_inv = "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

suite('UnitTests', () => {
    test("Logic handles a valid puzzle string of 81 characters", (done) => {
        assert.equal(solver.solve(solved_puzzle_string), solved_puzzle_string);
        done(); 
    });
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) => {
        assert.equal(solver.solve(unsolved_puzzle_string_brk)[0], false);
        done();
    });
    test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
        assert.equal(solver.solve(unsolved_puzzle_string_not)[0], false);
        done();
    });

    test("Logic handles a valid row placement", (done) => {
        assert.equal(solver.checkRowPlacement(unsolved_puzzle_string, 1, 9), false);
        done();
    });
    test("Logic handles an invalid row placement", (done) => {
        assert.equal(solver.checkRowPlacement(unsolved_puzzle_string, 1, 1), true);
        done();
    });
    test("Logic handles a valid column placement", (done) => {
        assert.equal(solver.checkColPlacement(unsolved_puzzle_string, 1, 3), false);
        done();
    });
    test("Logic handles an invalid column placement", (done) => {
        assert.equal(solver.checkColPlacement(unsolved_puzzle_string, 1, 7), true);
        done();
    });
    test("Logic handles a valid region (3x3 grid) placement", (done) => {
        assert.equal(solver.checkRegionPlacement(unsolved_puzzle_string, 0, 1, 3), false);
        done();
    });
    test("Logic handles an invalid region (3x3 grid) placement", (done) => {
        assert.equal(solver.checkRegionPlacement(unsolved_puzzle_string, 0, 1, 2), true);
        done();
    });
    test("Valid puzzle strings pass the solver", (done) => {
        assert.equal(solver.solve(unsolved_puzzle_string)[0], true);
        done();
    });
    test("Invalid puzzle strings fail the solver", (done) => {
        assert.equal(solver.solve(unsolved_puzzle_string_inv), false);
        done();
    });
    test("Solver returns the expected solution for an incomplete puzzle", (done) => {
        assert.equal(solver.solve(unsolved_puzzle_string), solved_puzzle_string)
        done();
    });
});
