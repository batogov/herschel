"use strict";

(function() {


    var items = [];
    var filteredItems = [];

    var itemsContainer = document.querySelector(".content__items");

    var filters = document.querySelectorAll("input[type=radio]");

    var moreBtn = document.querySelector(".content__more-btn");
    var noMoreItemsSpan = document.querySelector(".content__no-more-items");

    var currentPage = 0;
    var PAGE_SIZE = 4;

    var collapsePanel = document.querySelector(".filters__collapse-panel");
    var form = document.querySelector(".filters__form");


    for (var i = 0; i < filters.length; i++) {
        filters[i].addEventListener("click", applyFilters);
    }

    
    getItems();


    function renderItems (items, pageNumber, replace) {
        if (replace) {
            itemsContainer.innerHTML = "";
        }

        var fragment = document.createDocumentFragment();

        var from = pageNumber * PAGE_SIZE;
        var to = from + PAGE_SIZE;
        var pageItems = items.slice(from, to);

        if (items.length === 0) {

            noMoreItemsSpan.classList.remove("content__no-more-items--hidden");
            noMoreItemsSpan.innerHTML = "No items to show :(";
            moreBtn.classList.add("content__more-btn--hidden");

        } else if (to >= items.length) {

            noMoreItemsSpan.classList.remove("content__no-more-items--hidden");
            noMoreItemsSpan.innerHTML = "No more items to show :(";
            moreBtn.classList.add("content__more-btn--hidden");

        } else if (to < items.length) {

            noMoreItemsSpan.classList.add("content__no-more-items--hidden");
            moreBtn.classList.remove("content__more-btn--hidden");

        }

        pageItems.forEach(function (item) {
            var element = getElementFromTemplate(item);
            fragment.appendChild(element);
        });

        itemsContainer.appendChild(fragment);
    }


    function applyFilters(event) {

        filteredItems = items.slice(0);

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

        currentPage = 0;
        renderItems(filteredItems, currentPage, true);
    }

    
    function getItems() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/items.json');

        xhr.onload = function (event) {
            var rawData = event.target.response;
            var loadedItems = JSON.parse(rawData);

            items = loadedItems;
            filteredItems = loadedItems;

            renderItems(items, 0, true);
        };

        xhr.send();
    }


    function getElementFromTemplate(data) {
        var element = document.createElement('div');
        element.classList.add("content-item");

        element.innerHTML = Mustache.render(document.querySelector("#item-template").innerHTML, data);

        return element;
    }


    moreBtn.addEventListener("click", function(event) {
        renderItems(filteredItems, ++currentPage, false);
    });


    collapsePanel.addEventListener("click", function(event) {
        collapsePanel.classList.toggle("filters__collapse-panel--open");
        form.classList.toggle("filters__form--hidden");
    });


})();