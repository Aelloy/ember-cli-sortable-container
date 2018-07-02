import { isEmpty } from '@ember/utils';
const { min, max, sqrt, pow } = Math;

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  shift({x, y}) {
    this.x -= x;
    this.y -= y;
  }

  offset({x, y}) {
    return new Point(x - this.x, y - this.y);
  }

  distance({x, y}) {
    return sqrt(pow(this.y - y, 2) + pow(this.x - x, 2));
  }
}

export class Rect {
  constructor(x1, y1, x2, y2) {
    this.left = x1;
    this.top = y1;
    this.right = x2;
    this.bottom = y2;
  }

  width() {
    return this.right - this.left;
  }

  height() {
    return this.bottom - this.top;
  }

  center() {
    return new Point((this.right + this.left) / 2, (this.bottom + this.top) / 2);
  }

  distance(rect) {
    const c1 = this.center();
    const c2 = rect.center();
    return sqrt(pow(c1.y - c2.y, 2) + pow(c1.x - c2.x, 2));
  }

  offset(rect) {
    return rect.center().offset(this.center());
  }

  offsetWithin({x, y}) {
    return new Point(x - this.left, y - this.top);
  }

  overlap({left, right, top, bottom}) {
    return max(left, this.left) <= min(right, this.right)
        && max(top, this.top) <= min(bottom, this.bottom);
  }

  move({x, y}) {
    const width = this.width();
    const height = this.height();
    this.left = x;
    this.right = x + width;
    this.top = y;
    this.bottom = y + height;
  }

  fit(rect) {
    const x = max(this.left - max(0, this.right - rect.right), rect.left);
    const y = max(this.top - max(0, this.bottom - rect.bottom), rect.top);
    this.move({x, y});
  }

  static fromElement(element) {
    const {left, top, right, bottom} = element.getBoundingClientRect();
    return new Rect(left, top, right, bottom);
  }
}

export function clientPoint({clientX, clientY}) {
  return new Point(clientX, clientY);
}

export function join({left: l1, right: r1, top: t1, bottom: b1},
                     {left: l2, right: r2, top: t2, bottom: b2}) {
  return new Rect(min(l1, l2), min(t1, t2), max(r1, r2), max(b1, b2));
}

export function joinList(rects) {
  if (!isEmpty(rects))
    return rects.reduce(join);
}
