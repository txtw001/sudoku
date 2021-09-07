import D2LL from './D2LL';

/*
 *  Part of the implementation of Donald E. Knuth, Stanford University
 *  Dancing Links Algorithm
 */
export default class DLX {
  constructor() {
    this.d2ll = new D2LL();
    this.solution = [];
  }

  init(mtx, cols, rows) {
    this.d2ll.init(mtx, cols, rows);
  }

  solve() {
    if (this.d2ll.root === this.d2ll.root.right) {
      return false;
    }
    const result = this._solve();

    // clear the list
    this.d2ll.clear();

    return result;
  }

  _solve() {
    if (this.d2ll.root === this.d2ll.root.right) {
      // Solution found
      return true;
    }
    // Choose col with min number of nodes
    const c = this.d2ll.minNodesColumn();

    // Cover c
    this.d2ll.coverColumn(c);

    for (let r = c.down; r !== c; r = r.down) {
      this.solution.push(r);

      for (let j = r.right; j !== r; j = j.right) {
        this.d2ll.coverColumn(j.head);
      }

      if (this._solve()) {
        // Solution found
        return true;
      }
      // Backtrack
      for (let j = r.left; j !== r; j = j.left) {
        this.d2ll.uncoverColumn(j.head);
      }

      this.solution.pop();
    }

    this.d2ll.uncoverColumn(c);

    return false;
  }
}
