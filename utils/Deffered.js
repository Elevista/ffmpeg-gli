export default function Deffered () {
  this.promise = new Promise((resolve, reject) => Object.assign(this, { resolve, reject }))
}
