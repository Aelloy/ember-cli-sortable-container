import Controller from '@ember/controller';
import Velocity from 'velocity-animate';

export default Controller.extend({
  projection: false,
  takeOut: true,
  lockAxis: false,
  dragHandle: null,

  saveChanges() {
    // just for callback illustration purposes
  },

  actions: {
    toggle(prop) {
      this.toggleProperty(prop);
    },

    toggleDragHandle() {
      this.set('dragHandle', this.get('dragHandle') ? null : 'drag-handle');
    },

    lock(author) {
      author.toggleProperty('lock');
    },

    // BEGIN-SNIPPET guards
    // Can only pick up an item if it's not locked
    canPick({item}) {
      return !item.lock;
    },

    // Here we restrict putting an item between two locked items as an example
    canPut(state) {
      const next = state.nextItem();
      const prev = state.prevItem();
      return !next || !prev || !(next.get('lock') && prev.get('lock'));
    },
    // END-SNIPPET

    // BEGIN-SNIPPET animate
    onDragStart(state) {
      const transform = {
        transform: ["rotateZ(-2deg)", "rotateZ(0deg)"],
        boxShadow: ["3px 3px 10px", "0px 0px 0px"]
       };
      return Velocity(state.get('element'), transform, { duration: 100 });
    },

    onDragEnd(state) {
      const transform = {
        transform: ["rotateZ(0deg)", "rotateZ(-2deg)"],
        boxShadow: ["0px 0px 0px", "3px 3px 10px"]
      };

      if (state.get('isChanged')) this.saveChanges();
      return Velocity(state.get('element'), transform, { duration: 100 });
    }
    // END-SNIPPET
  }

});
