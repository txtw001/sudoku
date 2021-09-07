export default class SudokuGenerator {
  constructor(solver, constraints, randomGen) {
    if (!solver) {
      throw new Error('Solver missing');
    }
    if (!constraints || constraints.setSize() < 1) {
      throw new Error('Invalid constraint set');
    }
    if (!randomGen) {
      throw new Error('Random generator missing');
    }

    this.solver = solver;
    this.rng = randomGen;
    this.constraintSet = constraints;

    this.size = 9;
    this.sqrt_s = Math.round(Math.sqrt(this.size));
    this.noConstraints = this.constraintSet.setSize();

    this.possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.possiblePositionsInSquare = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }

  generate(difficulty) {
    const sudokuResult = new Array(this.size * this.size);

    // In case some initial parameter fail to generate a solution
    // Attempt 10 generations at max
    for (let it = 0; it < 10; it++) {
      const distinct = this._randomShuffle(this.possibleValues);
      const sudoku = new Array(this.size * this.size).fill(0);

      // initialise squares with 1 number
      // sq_i - square index 0..8
      for (let sq_i = 0; sq_i < 9; sq_i++) {
        // set square
        const k = this._getInt(0, 8); // index 0-8
        const index = this._indexInSquare(sq_i, k);

        sudoku[index] = distinct[sq_i];
      }

      // Generate incident matrix
      const mtx = [];
      const rowData = [];
      let totalRows = 0;
      for (let i = 1; i <= this.size; i++) {
        for (let j = 1; j <= this.size; j++) {
          const value = sudoku[(i - 1) * this.size + (j - 1)];
          if (value > 0 && value <= this.size) {
            const constraints = this.constraintSet.getConstraints(i, j, value);
            mtx.push(...constraints);
            rowData.push({ i, j, k: value });
            totalRows++;
          } else {
            for (let k = 1; k <= this.size; k++) {
              const constraints = this.constraintSet.getConstraints(i, j, k);
              mtx.push(...constraints);
              rowData.push({ i, j, k });
              totalRows++;
            }
          }
        }
      }

      const totalCols = this.constraintSet.noConstraints();
      this.solver.init(mtx, totalCols, totalRows);

      if (this.solver.solve()) {
        // Solution found
        // create Result array
        // eslint-disable-next-line no-restricted-syntax
        for (const sol of this.solver.solution) {
          const rd = rowData[sol.row];
          sudokuResult[(rd.i - 1) * this.size + (rd.j - 1)] = rd.k;
        }
        break;
      } else {
        console.log('No solution at iteration ', it + 1);
      }
    }

    if (this.solver.solution.length === this.size * this.size) {
      // keep clues
      const prepared = new Array(this.size * this.size).fill(0);
      for (let sq_i = 0; sq_i < 9; sq_i++) {
        // Select how many clues to keep in square b
        const keep = this._getNoClues(difficulty);
        const positions = this._randomShuffle(this.possiblePositionsInSquare);

        for (let i = 0; i < keep; i++) {
          const k = positions[i];
          const index = this._indexInSquare(sq_i, k);

          prepared[index] = sudokuResult[index];
        }
      }
      return { generated: prepared, solved: sudokuResult };
    }

    return null;
  }

  _indexInSquare(sq_i, k) {
    // sq_i - square index (0..8)
    // k - cell index in square (0..8)
    const { sqrt_s } = this;
    const sq_base_i = Math.floor(sq_i / sqrt_s) * sqrt_s;
    const sq_base_j = (sq_i % sqrt_s) * sqrt_s;
    const sq_local_i = Math.floor(k / sqrt_s);
    const sq_local_j = k % sqrt_s;

    return (sq_base_i + sq_local_i) * this.size + sq_base_j + sq_local_j;
  }

  // eslint-disable-next-line no-unused-vars
  _getNoClues(difficulty) {
    return 8;
    /* const randomCnt = this._getInt(1, 9);
    let maxCluesInSquare = 6;
    // difficulty starts from 0
    if (difficulty > 1) {
      maxCluesInSquare = difficulty > 2 ? 4 : 5;
    }

    const minCluesInSquare = 2;
    return Math.max(Math.min(randomCnt - 2 * difficulty, maxCluesInSquare), minCluesInSquare); */
  }

  // Random Utility functions
  _getInt(min, max) {
    if (min === undefined || max === undefined) throw new Error('Random int: min and max required');
    return Math.floor(this.rng() * (max - min + 1)) + min;
  }

  _getArrayOfInts(count, min, max) {
    const a = new Array(count);
    for (let i = 0; i < count; i++) {
      a[i] = this._getInt(min, max);
    }
    return a;
  }

  _randomShuffle(arr) {
    const a = [...arr];
    for (let i = 0; i < a.length; i++) {
      const idx = this._getInt(0, a.length - 1);
      [a[i], a[idx]] = [a[idx], a[i]]; // swap
    }
    return a;
  }
}
