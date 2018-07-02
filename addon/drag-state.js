import EmberObject from '@ember/object';
import { getOwner } from '@ember/application';
import { Rect } from './utils/geometry';
import { isPresent, isBlank } from '@ember/utils';
import { alias } from '@ember/object/computed';

export default EmberObject.extend({

  items: alias('container.items'),

  findTarget(target) {
    if (this.container.get('dragHandle') && !this._isDragHandle(target)) return false;

    const children = Array.from(this.container.element.children);
    const index = children.findIndex((el) => el.contains(target));
    if (index < 0) return false;

    this.setProperties({
      index,
      originalIndex: index,
      originalElement: this.container.element.children[index],
      item: this.get('items').objectAt(index),
      eventTarget: target,
      isChanged: false
    });
    return true;
  },

  _isDragHandle(el) {
    return el.classList.contains(this.container.get('dragHandle')) ||
           (el.parentElement && el.parentElement != this.container.element && this._isDragHandle(el.parentElement));
  },

  prepare(pointer) {
    const rect = Rect.fromElement(this.get('originalElement'));
    const element = this.get('originalElement').cloneNode(true);
    element.style.width = `${rect.width()}px`;
    element.style.height = `${rect.height()}px`;
    element.style.position = "fixed";
    if (this.container.get('draggedClass')) element.classList.add(this.container.get('draggedClass'));
    this.setProperties({rect, element, offset: rect.offsetWithin(pointer)});
  },

  attach() {
    const root = getOwner(this.container).application.rootElement;
    document.querySelector('body').classList.add('no-select');
    document.querySelector(root).appendChild(this.get('element'));
    this.set('isDragging', true);
  },

  detach() {
    this.get('element').remove();
    document.querySelector('body').classList.remove('no-select');
    this.setProperties({isDragging: false, item: undefined, takenOut: false});
  },

  move(point, bounds) {
    const rect = this.get('rect');
    point.shift(this.get('offset'));
    rect.move(point);
    if (isPresent(bounds)) rect.fit(bounds);
    window.requestAnimationFrame(() => {
      this.get('element').style.left = `${rect.left}px`;
      this.get('element').style.top = `${rect.top}px`;
    });
  },

  drop() {
    this.detach();
  },

  takeOut() {
    this.get('container.items').removeObject(this.get('item'));
    this.setProperties({index: undefined, takenOut: true, isChanged: true});
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
    this.setProperties({index, takenOut: false, isChanged: (index != oldIndex)});
  },

  prevItem() {
    return isPresent(this.get('targetIndex')) && this.get('items').objectAt(this.get('targetIndex') - 1);
  },

  nextItem() {
    return isPresent(this.get('targetIndex')) && this.get('items').objectAt(this.get('targetIndex'));
  }
});
