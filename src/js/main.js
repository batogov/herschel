"use strict";

(function() {

    var itemsContainer = document.querySelector(".content__items");

    items.forEach(function (item) {
       var element = getElementFromTemplate(item);
       itemsContainer.appendChild(element);
    });

    function getElementFromTemplate(data) {

        var element = document.createElement('div');
        element.classList.add("content-item");

        element.innerHTML = Mustache.render(document.querySelector("#item-template").innerHTML, data);

        return element
    }

})();