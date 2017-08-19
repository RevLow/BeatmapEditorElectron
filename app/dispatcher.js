export default class Dispatcher {
  constructor(){
    this.stores = [];
  }

  addStore(store){
    this.stores.push(store);
  }

  trigger(event, action){
    for(const index in this.stores) {
      let store = this.stores[index];
      store.trigger(event, action);
    }
  }
}