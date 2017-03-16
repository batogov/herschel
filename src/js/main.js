"use strict";

(function() {

    var items;

    var itemsContainer = document.querySelector(".content__items");

    var activeCategoryFilter = 'category-all';
    var filters = document.querySelectorAll("input[type=radio]");


    for (var i = 0; i < filters.length; i++) {
        filters[i].onclick = function (event) {

            var filteredItems = items.slice(0);

            var categoryValue = document.querySelector("input[name=category]:checked").value;
            var colorValue = document.querySelector("input[name=color]:checked").value;
            var priceValue = document.querySelector("input[name=price]:checked").value;

            filteredItems = filteredItems.filter(function (item, i, arr) {

                var categoryFlag = item.category === categoryValue || categoryValue === 'all';
                var colorFlag = item.color === colorValue || colorValue === 'all';
                var priceFlag;

                if (priceValue === 'all') {
                    priceFlag = true;
                } else {
                    if (priceValue === '100+') {
                        priceFlag = parseInt(item.price) >= 100;
                    } else {
                        var priceMinMax = priceValue.split("-");
                        priceFlag = parseInt(item.price) >= parseInt(priceMinMax[0]) && parseInt(item.price) <= parseInt(priceMinMax[1]);
                    }
                }

                return categoryFlag && colorFlag && priceFlag;
            });

            renderItems(filteredItems);

        }
    }

    
    getItems();


    function renderItems (items) {
        itemsContainer.innerHTML = "";
        var fragment = document.createDocumentFragment();

        items.forEach(function (item) {
            var element = getElementFromTemplate(item);
            fragment.appendChild(element);
        });

        itemsContainer.appendChild(fragment);
    }

    
    function getItems() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/items.json');

        xhr.onload = function (event) {
            var rawData = event.target.response;
            var loadedItems = JSON.parse(rawData);
            items = loadedItems;

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