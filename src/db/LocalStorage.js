// Abstraction for storage driver
export default class LocalStorage {
  constructor() {
    this.storage = window.localStorage;
  }

  save(key, value) {
    this._checkKey(key);
    this.storage.setItem(key, JSON.stringify({ wrap: value }));
  }

  update(key, value) {
    this.save(key, value);
  }

  read(key) {
    this._checkKey(key);
    const read = this.storage.getItem(key);
    if (read) {
      return JSON.parse(read).wrap;
    }
    return null;
  }

  delete(key) {
    this._checkKey(key);
    this.storage.removeItem(key);
  }

  _checkKey(key) {
    if (!(key instanceof String || typeof key === typeof 'abc') || !key) {
      throw new Error('LocalStorage: Invalid key!');
    }
  }
}
