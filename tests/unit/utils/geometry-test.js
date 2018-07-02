import { Point, Rect, join, joinList } from 'dummy/utils/geometry';
import { module, test } from 'qunit';

module('Unit | Utility | Geometry | Point', function(/* hooks */) {
  test('Point.shift({x, y}) shifts the point by the specified values in the negative direction', function(assert) {
    let p = new Point(1, 1);

    p.shift({x: 1, y: -1});
    assert.deepEqual(p, new Point(0, 2));
  });

  test('Point.offset(point) returns a point that represents a diff vector', function(assert) {
    let p1 = new Point(1, 1);
    let p2 = new Point(3, 3);

    assert.deepEqual(p1.offset(p2), new Point(2, 2));
  });

  test('Point.distance(point) calculates the distance between points', function(assert) {
    let p1 = new Point(0, 0);
    let p2 = new Point(2, 2);

    let d = p1.distance(p2);
    assert.equal(d, p2.distance(p1));
    assert.ok(Math.abs(d - 2.83) < 0.01);
  });
});


module('Unit | Utility | Geometry | Rect', function(/* hooks */) {
  test('Rect.width() and Rect.height() return the proper values', function(assert) {
    let r = new Rect(1, 1, 2, 3);

    assert.equal(r.width(), 1);
    assert.equal(r.height(), 2);
  });

  test('Rect.center() returns the center point of the rectangle', function(assert) {
    let r = new Rect(0, 0, 2, 4);

    assert.deepEqual(r.center(), new Point(1, 2));
  });

  test('Rect.distance(rect) calculates the distance between the rectangles', function(assert) {
    let r1 = new Rect(-1, -1, 1, 1);
    let r2 = new Rect(1, 1, 3, 3);

    let d = r1.distance(r2);
    assert.equal(d, r2.distance(r1));
    assert.ok(Math.abs(d - 2.83) < 0.01);
  });

  test('Rect.offset(rect) returns a point that represents a diff vector between centers of two rects', function(assert) {
    let r1 = new Rect(0, 0, 2, 2);
    let r2 = new Rect(1, 1, 3, 3);

    assert.deepEqual(r1.offset(r1), new Point(0, 0));
    assert.deepEqual(r2.offset(r1), new Point(1, 1));
  });

  test('Rect.offsetWithin(point) returns the point\'s offset within the rect', function(assert) {
    let r = new Rect(2, 2, 4, 4);
    let p = new Point(3, 3);

    assert.deepEqual(r.offsetWithin(p), new Point(1, 1));
  });


  test('Rect.overlap(rect) when rects touch each other returns true', function(assert) {
    let r1 = new Rect(-1, -1, 1, 1);
    let r2 = new Rect(1, 1, 3, 3);

    assert.ok(r1.overlap(r2));
    assert.ok(r2.overlap(r1));
  });

  test('Rect.overlap(rect) when one rect includes other returns true', function(assert) {
    let r1 = new Rect(0, 0, 3, 3);
    let r2 = new Rect(1, 1, 2, 2);

    assert.ok(r1.overlap(r2));
    assert.ok(r2.overlap(r1));
  });

  test('Rect.overlap(rect) when rects overlap returns true', function(assert) {
    let r1 = new Rect(0, 0, 3, 3);
    let r2 = new Rect(1, 1, 4, 2);

    assert.ok(r1.overlap(r2));
    assert.ok(r2.overlap(r1));
  });

  test('Rect.overlap(rect) when rects don\'t overlap returns false', function(assert) {
    let r1 = new Rect(0, 0, 1, 1);
    let r2 = new Rect(2, 0, 3, 1);

    assert.notOk(r1.overlap(r2));
    assert.notOk(r2.overlap(r1));
  });

  test('Rect.fit(rect) adjusts coordinates in first rect to stay within bounds of the second one', function(assert) {
    let outer = new Rect(0, 0, 3, 3);
    let inner = new Rect(1, 1, 2, 2);
    let left_overlapping = new Rect(-1, -1, 1, 1);
    let right_overlapping = new Rect(2, 2, 4, 4);
    let bigger = new Rect(1, 1, 5, 5);

    inner.fit(outer);
    assert.deepEqual(inner, new Rect(1, 1, 2, 2));

    left_overlapping.fit(outer);
    assert.deepEqual(left_overlapping, new Rect(0, 0, 2, 2));

    right_overlapping.fit(outer);
    assert.deepEqual(right_overlapping, new Rect(1, 1, 3, 3));

    bigger.fit(outer);
    assert.deepEqual(bigger, new Rect(0, 0, 4, 4));
  });
});


module('Unit | Utility | Geometry | Supporting functions', function(/* hooks */) {
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
});
