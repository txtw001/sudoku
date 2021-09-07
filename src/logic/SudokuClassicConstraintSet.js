export default class SudokuClassicConstraintSet {
  constructor() {
    this.sSize = 4;
    this.size = 9;
    // Sparse matrix data options
    // Algo only checks truthiness
    this.set = 1;
    this.empty = 0;
  }

  setSize() {
    return this.sSize;
  }

  noConstraints() {
    return this.sSize * this.size * this.size;
  }

  getConstraints(i, j, k) {
    if (!Number.isInteger(i) || !Number.isInteger(j) || !Number.isInteger(k) || k < 1 || k > 9) {
      throw new Error('SudokuClassicConstraintSet.getConstraints(): Invalid Input arguments');
    }
    const mtx = [];
    this.rowConditions(mtx, i, k);
    this.columnConditions(mtx, j, k);
    this.cellConditions(mtx, i, j);
    this.squareConditions(mtx, i, j, k);

    return mtx;
  }

  rowConditions(mtx, i, k) {
    for (let r = 1; r <= this.size; r++) {
      for (let n = 1; n <= this.size; n++) {
        if (r === i && k === n) mtx.push(this.set);
        else mtx.push(this.empty);
      }
    }
  }

  columnConditions(mtx, j, k) {
    for (let c = 1; c <= this.size; c++) {
      for (let n = 1; n <= this.size; n++) {
        if (c === j && k === n) mtx.push(this.set);
        else mtx.push(this.empty);
      }
    }
  }

  cellConditions(mtx, i, j) {
    for (let r = 1; r <= this.size; r++) {
      for (let c = 1; c <= this.size; c++) {
        if (r === i && c === j) mtx.push(this.set);
        else mtx.push(this.empty);
      }
    }
  }

  squareConditions(mtx, i, j, k) {
    for (let b = 1; b <= this.size; b++) {
      for (let n = 1; n <= this.size; n++) {
        const box = Math.floor((i - 1) / 3) * 3 + Math.floor((j - 1) / 3) + 1;
        if (box === b && k === n) mtx.push(this.set);
        else mtx.push(this.empty);
      }
    }
  }
}
