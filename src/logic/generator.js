import DLX from './DLX';
import SudokuClassicConstraintSet from './SudokuClassicConstraintSet';
import SudokuGenerator from './SudokuGenerator';

const seedrandom = require('seedrandom');

export default {
  generateShudoku(difficulty) {
    return new Promise((resolve, reject) => {
      const date = new Date();
      const seed = `${date.getFullYear()}${date.getMonth()}${date.getDay()}${difficulty}`;

      // eslint-disable-next-line new-cap
      const rng = new seedrandom(seed);
      const solver = new DLX();
      const constraintSet = new SudokuClassicConstraintSet();

      const sudokuGen = new SudokuGenerator(solver, constraintSet, rng);
      const sudoku = sudokuGen.generate(difficulty);
      if (sudoku) {
        resolve(sudoku);
      } else {
        reject(new Error('Unable to generate a valid game'));
      }
    });
    // eslint-disable-next-line comma-dangle
  }
};
