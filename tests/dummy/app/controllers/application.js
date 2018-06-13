import Controller from '@ember/controller';

export default Controller.extend({
  projection: false,
  takeOut: true,
  lockAxis: false,

  actions: {
    toggle(prop) {
      this.toggleProperty(prop);
    },

    lock(author) {
      author.toggleProperty('lock');
    },

    // BEGIN-SNIPPET guards
    // Can only pick up item if it's not locked
    canPick({item}) {
      return !item.lock;
    },

    // Here we restrict putting an item between two locked items for example
    canPut(state) {
      const next = state.nextItem();
      const prev = state.prevItem();
      return !next || !prev || !(next.get('lock') && prev.get('lock'));
    }
    // END-SNIPPET
  }

});
