export default class Node {
  constructor(column, row) {
    this.column = column;
    this.row = row;
    this.head = null;
    this.left = null;
    this.right = null;
    this.up = null;
    this.down = null;
  }
}
