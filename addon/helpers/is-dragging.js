import { helper } from '@ember/component/helper';

export function isDragging([item, stateItem, stateDragging]) {
  return stateDragging && item === stateItem;
}

export default helper(isDragging);
