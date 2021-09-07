import Header from './Header';
import Node from './Node';

/*
 *  Part of the implementation of Donald E. Knuth, Stanford University
 *  Dancing Links Algorithm
 */
export default class D2LL {
  constructor() {
    const root = new Header('root');
    root.size = Number.MAX_SAFE_INTEGER;
    this.root = root;
    // Make it circular
    this.root.right = root;
    this.root.left = root;
    this.root.down = root;
    this.root.left = root;
    this.nodeRefs = []; // keep nodes in memory
  }

  clear() {
    // Initialise to empty List
    this.root.right = this.root;
    this.root.left = this.root;
    this.root.down = this.root;
    this.root.left = this.root;
    if (this.nodeRefs.length > 0) this.nodeRefs = [];
  }

  init(mat, cols, rows) {
    if (!mat || !cols || !rows || !Array.isArray(mat) || mat.length !== cols * rows) {
      throw new Error('D2LL.init: List initialization error');
    }

    this.clear();

    for (let j = 0; j < cols; j++) {
      const colHeader = new Header(j);
      this.nodeRefs.push(colHeader);

      // Connect header horizontally
      // Add horizontal links
      // List is circular, root left is the last
      const last = this.root.left;
      colHeader.left = last;
      colHeader.right = last.right;
      last.right.left = colHeader;
      last.right = colHeader;

      // Add initial vertical links
      colHeader.up = colHeader;
      colHeader.down = colHeader;

      let actualRow = colHeader;
      for (let i = 0; i < rows; i++) {
        if (mat[i * cols + j]) {
          const node = new Node(j, i);
          this.nodeRefs.push(node);
          colHeader.inc();
          // connect vertically
          node.head = colHeader;
          node.up = actualRow;
          node.down = actualRow.down;
          actualRow.down.up = node;
          actualRow.down = node;

          // connect horizontally
          let colIterator = colHeader.left;
          let closestLeft = null;
          while (colIterator !== colHeader && closestLeft === null) {
            closestLeft = this.verticalSearch(colIterator, i);
            colIterator = colIterator.left;
          }
          if (closestLeft) {
            node.left = closestLeft;
            node.right = closestLeft.right;
            closestLeft.right.left = node;
            closestLeft.right = node;
          } else {
            node.left = node;
            node.right = node;
          }
          //
          actualRow = node;
        }
      }
    }
  }

  minNodesColumn() {
    let node = null;
    let value = Number.MAX_SAFE_INTEGER;

    for (let head = this.root.right; head !== this.root; head = head.right) {
      if (head.size < value) {
        value = head.size;
        node = head;
      }
    }

    return node;
  }

  coverColumn(colRef) {
    const c = colRef; // For lint, colRef is reference type

    // 1. Remove c from headers
    c.left.right = c.right;
    c.right.left = c.left;

    // 2. Remove related rows
    for (let i = c.down; i !== c; i = i.down) {
      for (let j = i.right; j !== i; j = j.right) {
        j.down.up = j.up;
        j.up.down = j.down;
        j.head.dec();
      }
    }
  }

  uncoverColumn(colRef) {
    const c = colRef; // For lint, colRef is reference type

    // Reconnect related rows
    for (let i = c.up; i !== c; i = i.up) {
      for (let j = i.left; j !== i; j = j.left) {
        j.head.inc();
        j.down.up = j;
        j.up.down = j;
      }
    }

    // 2. Reconnect c to column headers
    c.right.left = c;
    c.left.right = c;
  }

  verticalSearch(node, rowIdx) {
    for (let i = node.down; i !== node; i = i.down) {
      if (i.row === rowIdx) {
        return i;
      }
    }
    return null;
  }
}
