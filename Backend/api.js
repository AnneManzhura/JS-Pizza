/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');

/*function base64(str) {
    return new Buffer(str).toString('base64');
}

var crypto = require('crypto'); function sha1(string) {
    var sha1 = crypto.createHash('sha1'); sha1.update(string);
    return sha1.digest('base64');
}*/
var crypto = require('crypto');

function sha1(string) {
    var sha1 = crypto.createHash('sha1'); sha1.update(string);
    return sha1.digest('base64');
}

function base64(str) {
    return new Buffer(str).toString('base64');
}

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};


exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);

    var price = 0;
    var description = "Замовлення піци: " + order_info.name + "\nАдреса доставки: " + order_info.address + "\nТелефон: "
        + order_info.phone + "\nЗамовлення:\n";
    order_info.pizzas.forEach(function (item) {
        if (item.size === 'big_size') {
            description += "- " + item.quantity + " шт. [Велика] " + item.pizza.title + ";\n";
            price += item.quantity * item.pizza.big_size.price;
        } else if (item.size === 'small_size'){
            description += "- " + item.quantity + " шт. [Мала] " + item.pizza.title + ";\n";
            price += item.quantity * item.pizza.small_size.price;
        }
    });
    description+="\nРазом "+ price+ "грн";

    //console.log(description);


    var order = {
        version: 3,
        public_key: "i1163725787", action: "pay",
        amount: price,
        currency: "UAH",
        description: description,
        order_id: Math.random(),
//!!!Важливо щоб було 1, бо інакше візьме гроші!!!
        sandbox: 1
    };


    var data = base64(JSON.stringify(order));
    var signature = sha1("SN5tAWzjWjI78WMO9lHG8OrbIsz3OH5BcChV05KE" + data + "SN5tAWzjWjI78WMO9lHG8OrbIsz3OH5BcChV05KE");
    res.send({
        success: true,
        data: data,
        signature: signature
    });
};