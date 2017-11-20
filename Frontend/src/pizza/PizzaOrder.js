
var Storage = require('../LocalStorage');
//var MAP = require('../Maps');
var API = require('../API');


/* Name validation */

var nameREGEX = /[a-zA-Z-А-ЯЁЇІЄҐа-яіїёє']+$/;
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
/*/!* Adress validation *!/
var adressInput = $("#inputAdress");
var adressLabel = $(".label-adress");
var adressHint = $(".adressHint");
function checkAdress() {
    MAP.getFullAddress(adressInput.val(), function (err, adress) {
        console.log("+ " + adress);
        if(!err) {
            adressInput.addClass("valid");
            adressInput.removeClass("invalid");
            adressLabel.addClass("valid");
            adressLabel.removeClass("invalid");
            adressHint.addClass("none");
            return true;
        } else {
            adressInput.removeClass("valid");
            adressInput.addClass("invalid");
            adressLabel.addClass("invalid");
            adressLabel.removeClass("valid");
            adressHint.removeClass("none");
            return false;
        }
    });
}*/


function initialise() {
    inputName.bind("input", function () {
        checkName();
    });
    inputPhone.bind("input", function () {
        checkPhone();
    });
    inputAddress.bind("input", function () {
        addressInfo.text(inputAddress.val());

    });

    $(".next_step_button").click(function () {
        checkName();
        checkPhone();
        //checkAddress();
        if (checkName() && checkPhone()){
                    API.createOrder({
                name: inputName.val(),
                phone: inputPhone.val(),
                address: inputAddress.val(),
                pizzas: Storage.get("cart")
            }, function (err, res) {
                if(err){
                    console.log("Can't create order")
                }
            });
            console.log(Storage.get("cart")) ;
        }
        else{
            console.log("checkFailed") ;
        }

    });

   /* $("#inputAdress").bind("input", function () {
        console.log(adressInput.val());
        MAP.geocodeAddress(adressInput.val(), function (err, coordinates) {
            if(err){
                console.log("Can't find adress")
            } else {
                MAP.setMarker(coordinates);
                MAP.calculateRoute(new google.maps.LatLng(50.464379, 30.519131), coordinates, function (err, res) {
                    if (res) {
                        $(".order-summery-time").html("<b>Приблизний час доставки:</b> " + res);
                        MAP.getFullAddress(adressInput.val(), function (err, adress) {
                            if(!err) {
                                console.log(adress);
                                $(".order-summery-adress").html("<b>Адреса доставки:</b> " + adress);
                            }
                        });
                    } else {
                        $(".order-summery-time").html("<b>Приблизний час доставки:</b> -/-");
                        $(".order-summery-adress").html("<b>Адреса доставки:</b> -/-");
                    }
                });
            }
        });
    });*/


}


exports.initialiseOrder = initialise;
/*
exports.setAdress = setAdress;
exports.checkAdress = checkAdress;*/
