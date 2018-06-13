import Velocity from 'velocity';
import { isPresent } from '@ember/utils';
import { fit, rdistance, offset, Rect } from './utils/geometry';

export default class DraggableItem {

  constructor(element, item) {
    this.cloneElement(element);
    this.item = item;
    this.attached = false;
  }

  move(point, bounds) {
    this.updateRect(point);
    // console.log(this.rect);
    if (isPresent(bounds)) this.updateRect(fit(this.rect, bounds));
    Velocity.hook(this.element, 'left', `${this.rect.left}px`);
    Velocity.hook(this.element, 'top', `${this.rect.top}px`);
  }

  updateRect({x, y}) {
    this.rect = new Rect(x, y, x + this.width, y + this.height);
  }

  appendTo(root) {
    document.querySelector(root).appendChild(this.element);
    this.attached = true;
  }

  remove() {
    if (this.attached) this.element.parentNode.removeChild(this.element);
  }

  rdistance(rect) {
    return rdistance(this.rect, rect);
  }

  offset(rect) {
    return offset(this.rect, rect);
  }

  cloneElement(node) {
    this.element = node.cloneNode(true);
    this.element.removeAttribute('id');
    let { width, height } = node.getBoundingClientRect();
    this.height = height;
    this.width = width;
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
    this.element.style.zIndex = '1050';
    this.element.style.position = "fixed";
  }
}
