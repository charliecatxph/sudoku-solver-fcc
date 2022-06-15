'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const solve = new SudokuSolver();

module.exports = function (app) {
  app.route('/api/check')
    .post((req, res) => {
      let { puzzle, coordinate = false, value = false } = req.body;
      
      if (!coordinate || !value || !puzzle) {
        res.json({ error : "Required field(s) missing"})
        return;
      }

      if (!solve.validate(puzzle)[0]) {
        const message = solve.validate(puzzle)[1];
        if (message === "Required field missing") {
          res.json({ error : "Required field(s) missing"})
          return;
        } else {
          res.json({ error : message })
          return;
        }
        
      }
      coordinate = coordinate.toLowerCase();
      value = parseInt(value);
      let coordinates = [!coordinate.match(/[a-z]/g) ? false : coordinate.match(/[a-z]/g).join(""), !coordinate.match(/\d/g) ? false : parseInt(coordinate.match(/\d/g).join(""))];
      coordinates[1] >= 1 && coordinates[1] <= 9 ? null : coordinates[1] = false
      coordinates[1] ? coordinates[1] -= 1 : null;
      switch(coordinates[0]) {
        case "a" : {
          coordinates[0] = 0;
          break;
        }
        case "b" : {
          coordinates[0] = 1;
          break;
        }
        case "c" : {
          coordinates[0] = 2;
          break;
        }
        case "d" : {
          coordinates[0] = 3;
          break;
        }
        case "e" : {
          coordinates[0] = 4;
          break;
        }
        case "f" : {
          coordinates[0] = 5;
          break;
        }
        case "g" : {
          coordinates[0] = 6;
          break;
        }
        case "h" : {
          coordinates[0] = 7;
          break;
        }
        case "i" : {
          coordinates[0] = 8;
          break;
        }
        default: {
          coordinates[0] = false
        }
      }
      if (coordinates[0] === false || coordinates[1] === false) {
        res.json({ error : "Invalid coordinate" })
        return;
      }
      if (value < 1 || value > 9) {
        res.json({ error : "Invalid value" });
        return;
      } else if (!value) {
        res.json({ error : "Invalid value" })
        return;
      } else {
        if (solve.check(puzzle, coordinates[0], coordinates[1], value)[0]) {
          res.json({ valid : true })
        } else {
          res.json({ valid : false, conflict : solve.check(puzzle, coordinates[0], coordinates[1], value)[1]})
        }

      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) {
        res.json({ error : "Required field missing"});
        return;
      }
      if (!solve.validate(puzzle)[0]) {
        res.json({ error: solve.validate(puzzle)[1] })
      } else {
        if (solve.solve(puzzle) !== false) {
          res.json({ solution: solve.solve(puzzle) })
        } else {
          res.json({ error: 'Puzzle cannot be solved' })
        }
      }
    });
};