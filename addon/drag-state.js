import EmberObject, { computed } from '@ember/object';
import { findIndex } from './utils/collections';
import { getOwner } from '@ember/application';
import { offsetWithin, Rect } from './utils/geometry';
import { isPresent, isBlank } from '@ember/utils';
import { alias } from '@ember/object/computed';
import Velocity from 'velocity';

export default EmberObject.extend({

  items: alias('container.items'),

  findTarget(target) {
    const index = findIndex(this.container.element.children, (el) => el.contains(target));
    if (index < 0) return false;

    this.setProperties({
      index,
      originalIndex: index,
      originalElement: this.container.element.children[index],
      item: this.get('items').objectAt(index)
    });
    return true;
  },

  prepare(pointer) {
    const rect = Rect.fromElement(this.get('originalElement'));
    const element = this.get('originalElement').cloneNode(true);
    element.style.width = `${rect.width()}px`;
    element.style.height = `${rect.height()}px`;
    element.style.zIndex = '1050';
    element.style.position = "fixed";
    this.setProperties({rect, element, offset: offsetWithin(pointer, rect)});
  },

  attach() {
    const root = getOwner(this.container).application.rootElement;
    document.querySelector(root).appendChild(this.get('element'));
    this.set('inDOM', true);
  },

  detach() {
    this.get('element').remove();
    this.set('inDOM', false);
  },

  move(point, bounds) {
    const rect = this.get('rect');
    point.shift(this.get('offset'));
    rect.move(point);
    if (isPresent(bounds)) rect.fit(bounds);
    Velocity.hook(this.get('element'), 'left', `${rect.left}px`);
    Velocity.hook(this.get('element'), 'top', `${rect.top}px`);
  },

  drop() {
    this.detach();
  },

  takeOut() {
    this.get('container.items').removeObject(this.get('item'));
    this.setProperties({currentIndex: undefined, takenOut: true});
  },

  insertItem() {
    let index = this.get('targetIndex');
    if (isBlank(index)) return;

    const oldIndex = this.get('items').indexOf(this.get('item'));
    if (oldIndex >= 0) {
      index -= oldIndex < index ? 1 : 0;
      this.get('items').removeObject(this.get('item'));
    }
    this.get('items').insertAt(index, this.get('item'));
    this.setProperties({index, takenOut: false});
  },

  prevItem() {
    return this.get('targetIndex') && this.get('items').objectAt(this.get('targetIndex') - 1);
  },

  nextItem() {
    return this.get('targetIndex') && this.get('items').objectAt(this.get('targetIndex'));
  }
});
