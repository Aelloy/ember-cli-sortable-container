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
    return rdistance(this, rect);
  }

  offset(rect) {
    return rect.center().offset(this.center());
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
    this.move(fit(this, rect));
  }

  static fromElement(element) {
    const {left, top, right, bottom} = element.getBoundingClientRect();
    return new Rect(left, top, right, bottom);
  }
}

export function offsetWithin({x, y}, {left, top}) {
  return new Point(x - left, y - top);
}

export function clientPoint({clientX, clientY}) {
  return new Point(clientX, clientY);
}

export function shiftPoint({x, y}, {x: dx, y: dy}) {
  return new Point(x - dx, y - dy);
}

export function overlap({left: l1, right: r1, top: t1, bottom: b1},
                        {left: l2, right: r2, top: t2, bottom: b2}) {
  return max(l1, l2) <= min(r1, r2) && max(t1, t2) <= min(b1, b2);
}

export function offset(rect1, rect2) {
  return center(rect1).offset(center(rect2));
}

export function center({top, bottom, left, right}) {
  return new Point((right + left) / 2, (bottom + top) / 2);
}

export function distance({x: x1, y: y1}, {x: x2, y: y2}) {
  return sqrt(pow(y1 - y2, 2) + pow(x1 - x2, 2));
}

export function rdistance(r1, r2) {
  return distance(center(r1), center(r2));
}

export function fit({left: iLeft, right: iRight, top: iTop, bottom: iBottom},
                    {left: oLeft, right: oRight, top: oTop, bottom: oBottom}) {
  let x = max(iLeft - max(0, iRight - oRight), oLeft);
  let y = max(iTop - max(0, iBottom - oBottom), oTop);
  return new Point(x, y);
}

export function join({left: l1, right: r1, top: t1, bottom: b1},
                     {left: l2, right: r2, top: t2, bottom: b2}) {
  return new Rect(min(l1, l2), min(t1, t2), max(r1, r2), max(b1, b2));
}

export function joinList(rects) {
  if (!isEmpty(rects))
    return rects.reduce(join);
}
