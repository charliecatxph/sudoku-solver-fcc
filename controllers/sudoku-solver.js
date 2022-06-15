class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81 && puzzleString.length >= 1) {
      return [false, "Expected puzzle to be 81 characters long"];
    } else if (puzzleString.match(/[^123456789.]/g)) {
      return [false, "Invalid characters in puzzle"];
    } else if (puzzleString.length === 0) {
      return [false, "Required field missing"];
    } else {
      return [true, puzzleString];
    }
  }

  parseString(puzzleString) {
    if (this.validate(puzzleString)[0]) {
      const puzzle_str = puzzleString.replace(/\./g, 0);
      const temp_arr = puzzle_str.split('');
      const puzzle_arr = temp_arr.map(e => parseInt(e));
      let board = [];

      for (let x = 0; x < puzzle_arr.length; x += 9) {
        board.push(puzzle_arr.slice(x, x + 9));
      }
      return [true, board];
    } else {
      return [false, this.validate(puzzleString)[1]];
    }
  }

  checkRowPlacement(puzzleString, row, value) {
    const puzzleArr = this.parseString(puzzleString);
    const grid = puzzleArr[1];

    if (puzzleArr[0]) {
      for (let i = 0; i < 9; i++) {
        if (grid[row][i] === value) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
    
  }

  checkColPlacement(puzzleString, column, value) {
    const puzzleArr = this.parseString(puzzleString);
    const grid = puzzleArr[1];

    if (puzzleArr[0]) {
      for (let i = 0; i < 9; i++) {
        if (grid[i][column] === value) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const puzzleArr = this.parseString(puzzleString);
    const grid = puzzleArr[1];
    if (puzzleArr[0]) {
      let x_coordinate = row - row % 3;
      let y_coordinate = column - column % 3;

      for (let i = x_coordinate; i < x_coordinate + 3; i++) {
        for (let j = y_coordinate; j < y_coordinate + 3; j++) {
          if (grid[i][j] === value) {
            return true;
          }
        }
      }
      return false;
    } else {
      return false;
    }
  }

  check(puzzleString, row, column, value) {
    const puzzleArr = this.validate(puzzleString);
    const puzzleArr_r = this.parseString(puzzleString);
    const grid = puzzleArr[1];
    if (puzzleArr[0]) {
      let conflicts = [];
      if (puzzleArr_r[1][row][column] === value) {
        return [true, []];
      }
      if (this.checkRowPlacement(grid, row, value)) {
        conflicts.push("row");
      }
      if (this.checkColPlacement(grid, column, value)) {
        conflicts.push("column");
      }
      if (this.checkRegionPlacement(grid, row, column, value)) {
        conflicts.push("region");
      }
      return [!this.checkRowPlacement(grid, row, value) && !this.checkColPlacement(grid, column, value) && !this.checkRegionPlacement(grid, row, column, value), conflicts];
    } else {
      return false;
    }
  }

  isValid(grid, row, column, value) {
    let conflicts = [];
    grid = grid.flat().join("").replace(/0/g, ".")
    if (grid[row][column] === value) {
      return [true, []];
    }

    if (this.checkRowPlacement(grid, row, value)) {
      conflicts.push("row");
    }
    if (this.checkColPlacement(grid, column, value)) {
      conflicts.push("column");
    }
    if (this.checkRegionPlacement(grid, row, column, value)) {
      conflicts.push("region");
    }

    return [!this.checkRowPlacement(grid, row, value) && !this.checkColPlacement(grid, column, value) && !this.checkRegionPlacement(grid, row, column, value), conflicts];
  }

  recursive_solver(puzzleArr) {
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (puzzleArr[row][column] === 0) {
          for (let numberToTry = 1; numberToTry <= 9; numberToTry++) {
            if (this.isValid(puzzleArr, row, column, numberToTry)[0]) {
              puzzleArr[row][column] = numberToTry;
              if (this.recursive_solver(puzzleArr)) {
                return true;
              }
              else {
                puzzleArr[row][column] = 0;
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    let puzzleArr = this.parseString(puzzleString);
    let solvedString = "";
    if (puzzleArr[0]) {
      if (this.recursive_solver(puzzleArr[1])) {
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            solvedString += puzzleArr[1][i][j];
          }
        }
        return solvedString;
      } else {
        return false;
      }
    } else {
      return [false, puzzleArr[1]];
    }
  }
}

module.exports = SudokuSolver;

