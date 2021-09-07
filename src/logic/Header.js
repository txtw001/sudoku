import Node from './Node';

export default class Header extends Node {
  constructor(name) {
    super(null);
    this.size = 0;
    this.name = name;
  }

  inc() {
    this.size++;
  }

  dec() {
    this.size--;
  }
}
