import { Point, Rect, center, distance, rdistance, overlap, fit, join, joinList, offset } from 'dummy/utils/geometry';
import { module, test } from 'qunit';

module('Unit | Utility | geometry', function(/* hooks */) {

  test('center(rect) returns center point of the rectangle', function(assert) {
    let rect = new DOMRect(0, 0, 2, 4);

    let {x, y} = center(rect);
    assert.equal(x, 1);
    assert.equal(y, 2);
  });

  test('distance(point, point) calculates the distance between points', function(assert) {
    let p1 = new Point(0, 0);
    let p2 = new Point(2, 2);

    let d = distance(p1, p2);
    assert.equal(d, distance(p2, p1));
    assert.ok(Math.abs(d - 2.83) < 0.01);
  });

  test('rdistance(rect, rect) calculates the distance between rects', function(assert) {
    let r1 = new DOMRect(-1, -1, 2, 2);
    let r2 = new DOMRect(1, 1, 2, 2);

    let d = rdistance(r1, r2);
    assert.equal(d, rdistance(r2, r1));
    assert.ok(Math.abs(d - 2.83) < 0.01);
  });

  test('overlap(rect, rect) when rects touch each other returns true', function(assert) {
    let r1 = new DOMRect(-1, -1, 2, 2);
    let r2 = new DOMRect(1, 1, 2, 2);

    assert.ok(overlap(r1, r2));
    assert.ok(overlap(r2, r1));
  });

  test('overlap(rect, rect) when one rect includes other returns true', function(assert) {
    let r1 = new DOMRect(0, 0, 3, 3);
    let r2 = new DOMRect(1, 1, 1, 1);

    assert.ok(overlap(r1, r2));
    assert.ok(overlap(r2, r1));
  });

  test('overlap(rect, rect) when rects overlap returns true', function(assert) {
    let r1 = new DOMRect(0, 0, 3, 3);
    let r2 = new DOMRect(1, 1, 3, 1);

    assert.ok(overlap(r1, r2));
    assert.ok(overlap(r2, r1));
  });

  test('overlap(rect, rect) when rects don\'t overlap returns false', function(assert) {
    let r1 = new DOMRect(0, 0, 1, 1);
    let r2 = new DOMRect(2, 0, 1, 1);

    assert.notOk(overlap(r1, r2));
    assert.notOk(overlap(r2, r1));
  });

  test('fit(rect, rect) adjusts coordinates in first rect to stay within bounds of the second one', function(assert) {
    let outer = new DOMRect(0, 0, 3, 3);
    let inner = new DOMRect(1, 1, 1, 1);
    let left_overlapping = new DOMRect(-1, -1, 2, 2);
    let right_overlapping = new DOMRect(2, 2, 2, 2);
    let bigger = new DOMRect(1, 1, 4, 4);

    assert.deepEqual(fit(inner, outer), new Point(inner.x, inner.y));
    assert.deepEqual(fit(left_overlapping, outer), new Point(0, 0));
    assert.deepEqual(fit(right_overlapping, outer), new Point(1, 1));
    assert.deepEqual(fit(bigger, outer), new Point(0, 0));
  });

  test('join(rect, rect) returns outer bounds for two rects joined {left, top, right, bottom}', function(assert) {
    let rect1 = new DOMRect(0, 0, 3, 3);
    let rect2 = new DOMRect(1, 1, 1, 1);
    let rect3 = new DOMRect(3, 0, 1, 4);

    assert.deepEqual(join(rect1, rect2), new Rect(0, 0, 3, 3));
    assert.deepEqual(join(rect1, rect3), new Rect(0, 0, 4, 4));
  });

  test('joinList(rects) returns outer bounds for a list of rects or undefined if list is empty', function(assert) {
    let rect1 = new DOMRect(0, 0, 3, 3);
    let rect2 = new DOMRect(1, 1, 1, 1);
    let rect3 = new DOMRect(3, 0, 1, 4);

    assert.deepEqual(joinList([rect1, rect2, rect3]), new Rect(0, 0, 4, 4));
    assert.equal(joinList([]), undefined);
  });

  test('Point.offset(point) returns a point that represents a diff vector', function(assert) {
    let point1 = new Point(3, 3);
    let point2 = new Point(1, 1);

    assert.deepEqual(point1.offset(point2), new Point(2, 2));
  });

  test('offset(rect, rect) returns a point that represents a diff vector between centers of two rects', function(assert) {
    let rect1 = new DOMRect(0, 0, 2, 2);
    let rect2 = new DOMRect(1, 1, 2, 2);

    assert.deepEqual(offset(rect1, rect1), new Point(0, 0));
    assert.deepEqual(offset(rect2, rect1), new Point(1, 1));
  });
});
