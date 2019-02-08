Array.prototype.pushIfAbsent = function (obj) {
  if (!this.includes(obj)) {
    this.push(obj)
  }
}