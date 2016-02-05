export default class {
  private _data = [];
  add(data) {
    this._data = data || [];
    return this;
  }
  search(keyword) {
    let regex = new RegExp(keyword, 'i');
    return this._data.filter((item) => {
      return regex.test(item.name) ||
        regex.test(item.pinyin) ||
        regex.test(item.py) ||
        regex.test(item.title);
    });
  }
};
