import { find, settled, getContext } from '@ember/test-helpers';
import { isEmpty } from '@ember/utils';

function findElement(selector) {
  if (selector instanceof HTMLElement) {
    if (selector.classList.contains('ember-cli-sortable-container')) return selector;
    return selector.querySelector('.ember-cli-sortable-container');
  }
  return find(`${selector} .ember-cli-sortable-container`);
}

function findComponent(selector) {
  let elem = findElement(selector);
  if (!elem) throw new Error(`Cannot find a sortable container element within ${selector}`);
  let cpt = getContext().owner.lookup('-view-registry:main')[elem.id];
  if (!cpt) throw new Error(`A sortable container element within ${selector} doesn't match a component`);
  return cpt;
}

export async function sortableMove(selector, indexFrom, indexTo) {
  let cpt = findComponent(selector);
  let originalElement = cpt.element.children[indexFrom];

  [indexFrom, indexTo].forEach((index) => {
    if (isEmpty(index)) {
      throw new Error(`You need to pass a source index and a target index to sortableMove`);
    }
    if (index < 0 || index >= cpt.element.children.length) {
      throw new Error(`An index supplied to sortableMove is beyond the sortable item range`);
    }
  });

  cpt.state.setProperties({
    index: indexTo,
    targetIndex: indexTo,
    originalIndex: indexFrom,
    originalElement: originalElement,
    item: cpt.state.get('items').objectAt(indexFrom),
    eventTarget: originalElement,
    element: originalElement.cloneNode(true),
    isChanged: false
  });

  if (cpt.callback('canPick')) {
    cpt.callback('onDragStart');
    cpt.state.get('items').removeObject(cpt.state.get('item'));
    const newIndex = cpt.callback('canPut') ? indexTo : indexFrom;
    cpt.state.get('items').insertAt(newIndex, cpt.state.get('item'));
    cpt.state.set('isChanged', newIndex != indexFrom);
    cpt.callback('onDragEnd');
  }

  cpt.state.get('element').remove();
  return settled();
}

// TODO: sortableTakeOut()
