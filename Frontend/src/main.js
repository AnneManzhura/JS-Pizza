/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready

    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var PizzaOrder = require('./pizza/PizzaOrder');
    var Map=require('./GoogleMaps');
    //var Pizza_List = require('./Pizza_List');

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();
    PizzaOrder.initialiseOrder();

    google.maps.event.addDomListener(window, 'load', Map.initialiseMaps());

});