/* Provides top level immutability */
export function immutable(target: Function) {
  Object.freeze(target);
  Object.freeze(target.prototype);
}

