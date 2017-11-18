/**
 * Created by chaika on 02.02.16.
 */

var Templates = require('../Templates');
var Storage = require('../LocalStorage');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};
//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

var sum=0;

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    function samePizza(obj) {
        return obj.pizza.id === pizza.id && obj.size === size;
    }
    var same = Cart.filter(samePizza);
    if (same.length > 0) {
        same[0].quantity++;
    } else {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
    }
    sum+=pizza[size].price;
    //Оновити вміст кошика на сторінці
    updateCart();

}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    var thisSize=cart_item.size;
    if(thisSize==="big_size") sum-=cart_item.pizza.big_size.price*cart_item.quantity;
    else sum-=cart_item.pizza.small_size.price*cart_item.quantity;

    Cart.splice(Cart.indexOf(cart_item),1);

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...
    var saved_orders = Storage.get("cart");
    if (saved_orders) {
        Cart = saved_orders;
        Cart.forEach(calculateSum);
    }

    updateCart();
}
function calculateSum(cart_item){
    var thisSize=cart_item.size;
    if(thisSize==="big_size")
        sum+=cart_item.pizza.big_size.price*cart_item.quantity;
    else
        sum+=cart_item.pizza.small_size.price*cart_item.quantity;


}
function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.find(".orders").html("");

    if(Cart.length===0) {
        $(".toOrder").attr("disabled", "disabled");
        console.log("disabled");
    }
    else if (Cart.length>0 && $(".toOrder").attr("disabled")==="disabled"){
        $(".toOrder").prop("disabled", false)
        console.log("enabled");
    }


    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);
        var thisSize=cart_item.size;

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;

            if(thisSize==="big_size")
                sum+=cart_item.pizza.big_size.price;
            else
                sum+=cart_item.pizza.small_size.price;

            //Оновлюємо відображення
            updateCart();
        });


        $node.find(".minus").click(function(){
            //Збільшуємо кількість замовлених піц

            if(cart_item.quantity===1)
                removeFromCart(cart_item);
            else{
                cart_item.quantity -= 1;

                if(thisSize==="big_size")
                    sum-=cart_item.pizza.big_size.price;
                else
                    sum-=cart_item.pizza.small_size.price;

            }

            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".delete").click(function(){
            removeFromCart(cart_item);
        });

        if(thisSize==="big_size")
            $node.find(".price").text(cart_item.pizza.big_size.price*cart_item.quantity + " грн");

        else
            $node.find(".price").text(cart_item.pizza.small_size.price*cart_item.quantity + " грн");

        $cart.find(".orders").append($node);

    }

    Cart.forEach(showOnePizzaInCart);

    $cart.find(".badge_order").text(Cart.length);
    $cart.find(".sum").text(sum + " грн");

    Storage.set("cart",	Cart);
}


$(".deleteOrders").click(function () {
    Cart = [];
    sum=0;
    updateCart();
});

$(".toOrder").click(function () {
    if(Cart.length!==0){
        location.href="/order.html";
    }
});


exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;