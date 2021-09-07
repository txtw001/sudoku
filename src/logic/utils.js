export default {
  // Print Utility Function
  printSudoku(sudoku, size = 9) {
    for (let i = 0; i < size; i++) {
      let s = '';
      for (let j = 0; j < size; j++) {
        s = `${s + sudoku[i * size + j]}  `;
      }
      console.log(s);
    }
  },
  arrayCompare(a, b, compare) {
    if (a.length !== b.length) {
      return false;
    }
    const c = compare || ((p1, p2) => p1 === p2);
    for (let i = 0; i < a.length; i++) {
      if (!c(a[i], b[i])) {
        return false;
      }
    }
    return true;
    // eslint-disable-next-line comma-dangle
  }
};
