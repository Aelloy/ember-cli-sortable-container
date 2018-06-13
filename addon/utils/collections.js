export function findIndex(collection, cb) {
  let i = -1;
  for (let el of collection) {
    i++;
    if (cb(el)) return i;
  }
  return -1;
}
