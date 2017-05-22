(function(){
  'Use strict'

  angular.module('checkListApp', [])
  .controller('ToBuyListController', ToBuyListController)
  .controller('BoughtListController', BoughtListController)
  .controller('addToBuyListController', addToBuyListController)
  .provider('ItemListService', ItemListServiceProvider)
  .config(Config);

  Config.$inject = ['ItemListServiceProvider'];
  function Config(ItemListServiceProvider) {
    // add 5 item to list

    ItemListServiceProvider.defaults.initialToBuyList =[
      {name:'apple', quantity:10},
      {name:'orange', quantity:10},
      {name:'milk', quantity:10},
      {name:'chocolate', quantity:10},
      {name:'veg', quantity:10},
    ]
  }

  ToBuyListController.$inject = ['ItemListService'];
  function ToBuyListController(ItemListService) {
    var showList = this;
    showList.items = ItemListService.getToBuyList();

    showList.itemBought = function (itemIndex) {
      ItemListService.itemBought(itemIndex);
    };

  }

  addToBuyListController.$inject = ['ItemListService']
  function addToBuyListController(ItemListService){
    var showList = this;

    var name = '';
    var quantity = '';

    showList.addItem = function(name, quantity){
      ItemListService.addToBuyList(name, quantity);
    }
  }

  BoughtListController.$inject = ['ItemListService'];
  function BoughtListController(ItemListService) {
    var showList = this;

    showList.items = ItemListService.getBoughtList();

  }


  // If not specified, maxItems assumed unlimited
  function ItemListService(maxItems, initialToBuyList) {
    var service = this;

    // List of to buy items
    var toBuyList = initialToBuyList;

    //List of bought items
    var boughtList = [];

    service.itemBought = function(toBuyListIndex){

      //add to bought list
      boughtList.push(toBuyList[toBuyListIndex]);
      //remove from to buy list
      toBuyList.splice(toBuyListIndex, 1);


    }

    service.addToBuyList = function (itemName, quantity) {
      if ((maxItems === undefined) ||
          (maxItems !== undefined) && (toBuyList.length < maxItems)) {
            if(itemName != undefined && quantity != undefined){
              var item = {
                name: itemName,
                quantity: quantity
              };
              toBuyList.push(item);
            }
      }
      else {
        throw new Error("Max items (" + maxItems + ") reached.");
      }
    };

    service.getToBuyList = function () {
      return toBuyList;
    };

    service.getBoughtList = function () {
      return boughtList;
    };
  }

  function ItemListServiceProvider() {
    var provider = this;

    provider.defaults = {
      maxItems: 10,
      initialToBuyList: []
    };

    provider.$get = function () {
      var itemList = new ItemListService(provider.defaults.maxItems, provider.defaults.initialToBuyList);

      return itemList;
    };
  }


})();
