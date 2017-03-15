"use strict";

(function() {


    var itemsContainer = document.querySelector(".content__items");

    getItems();


    function renderItems (items) {
        items.forEach(function (item) {
            var element = getElementFromTemplate(item);
            itemsContainer.appendChild(element);
        });
    }

    
    function getItems() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/items.json');

        xhr.onload = function (event) {
            var rawData = event.target.response;
            var loadedItems = JSON.parse(rawData);

            renderItems(loadedItems);
        };

        xhr.send();
    }


    function getElementFromTemplate(data) {
        var element = document.createElement('div');
        element.classList.add("content-item");

        element.innerHTML = Mustache.render(document.querySelector("#item-template").innerHTML, data);

        return element
    }


})();