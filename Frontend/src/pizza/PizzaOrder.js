
var Storage = require('../LocalStorage');
var MAP = require('../GoogleMaps');
var API = require('../API');
var LiqPay = require("../LiqPay");

/* Name validation */

var nameREGEX = /^[a-zA-Z-А-ЯЁЇІЄҐа-яіїёє']+$/;
var inputName =$("#inputName");
var nameGroup = $(".name-group");
var nameHelp = $(".name-help-block");
function checkName() {
    if (inputName.val().match(nameREGEX)) {
        nameGroup.removeClass("has-error");
        nameGroup.addClass("has-success");
        nameHelp.addClass("none");
        return true;
    } else {
        nameGroup.removeClass("has-success");
        nameGroup.addClass("has-error");
        nameHelp.removeClass("none");
        return false;
    }
}

/* Phone validation */
var phoneREGEX = /(\+38)?0\d{9}$/;
var inputPhone = $("#inputPhone");
var phoneGroup = $(".phone-group");
var phoneHelp = $(".phone-help-block");

function checkPhone () {
    if (inputPhone.val().match(phoneREGEX)) {
        phoneGroup.removeClass("has-error");
        phoneGroup.addClass("has-success");
        phoneHelp.addClass("none");
        return true;
    } else {
        phoneGroup.removeClass("has-success");
        phoneGroup.addClass("has-error");
        phoneHelp.removeClass("none");
        return false;
    }
}

/* Address validation */
var addressREGEX = /(\+38)?0\d{9}$/;
var inputAddress = $("#inputAdress");
var addressGroup = $(".address-group");
var addressHelp = $(".address-help-block");

var addressInfo=$(".addressInfo");
var timeInfo=$(".timeInfo");

function checkAddress() {
    if(inputAddress.val().trim()!==""){
        addressGroup.removeClass("has-error");
        addressGroup.addClass("has-success");
        addressHelp.addClass("none");
        return true;
    }
    else {
        addressGroup.removeClass("has-success");
        addressGroup.addClass("has-error");
        addressHelp.removeClass("none");
        return false;
    }

}


function initialise() {
    inputName.bind("input", function () {
        checkName();
    });
    inputPhone.bind("input", function () {
        checkPhone();
    });

    inputAddress.bind("input", function () {
        addressInfo.text(inputAddress.val());
        MAP.geocodeAddress(inputAddress.val(), function (err, coordinates) {
            if(err){
                console.log("Can't find address");
            } else {
                MAP.setMarker(coordinates);
                MAP.calculateRoute(new google.maps.LatLng(50.464379, 30.519131), coordinates, function (err, res) {
                    if (res) {
                        timeInfo.text(res);
                    } else {
                        timeInfo.text(" невідомий");
                        addressInfo.text(" невідома");
                    }
                });
            }
        });
        checkAddress();
    });


    $(".next_step_button").click(function () {
        checkName();
        checkPhone();
        checkAddress();
        if (checkName() && checkPhone() && checkAddress()){
            API.createOrder({
                name: inputName.val(),
                phone: inputPhone.val(),
                address: inputAddress.val(),
                pizzas: Storage.get("cart")
            }, function (err, res) {
                if(err){
                    console.log("Can't create order");
                }
                else{
                    window.LiqPayCheckoutCallback = LiqPay.initialise(res.data, res.signature);
                    }
            });
            //console.log(Storage.get("cart")) ;
        }
        else{
            console.log("checkFailed") ;
        }

    });
}


exports.initialiseOrder = initialise;
exports.checkAddress = checkAddress;
