"use strict";

var hearts = document.querySelectorAll(".heart");
var cars = document.querySelectorAll("main .car");
;
var carsData;
if (!localStorage.getItem("cars")) {
  // Build The Required Data
  carsData = Array.from(cars).map(function (car) {
    return {
      carName: car.dataset.car || "",
      favourite: car.classList.contains("favourite"),
      category: car.dataset.category || "",
      largeImg: car.dataset.largeimg || car.dataset.img || "",
      mobileImg: car.dataset.mobileimg || car.dataset.img || "",
      gas: car.dataset.gas || "",
      steeringWheel: car.dataset.steeringwheel || "",
      passengers: car.dataset.passengers || "",
      price: car.dataset.price || "",
      discount: car.dataset.discount || null,
      id: car.dataset.id || ""
    };
  });
  localStorage.setItem("cars", JSON.stringify(carsData));
} else {
  // Return It If It Already Exist
  carsData = JSON.parse(localStorage.getItem("cars") || "[]");
}

// Specify The Favourite Cars
hearts.forEach(function (heart) {
  var heartCar = heart.closest(".car");
  if (!heartCar) return;
  var carName = heartCar.dataset.car;
  var carData = carsData.find(function (c) {
    return c.carName === carName;
  });
  if (carData !== null && carData !== void 0 && carData.favourite) {
    heart.classList.add("favourite", "fa-solid");
    heart.classList.remove("fa-regular");
    heartCar.classList.add("favourite");
  }
});
hearts.forEach(function (heart) {
  heart.addEventListener("click", function () {
    var _heart$parentElement, _heart$parentElement2;
    var heartCar = (_heart$parentElement = heart.parentElement) === null || _heart$parentElement === void 0 ? void 0 : _heart$parentElement.parentElement;
    heart.classList.toggle("favourite");
    (_heart$parentElement2 = heart.parentElement) === null || _heart$parentElement2 === void 0 || (_heart$parentElement2 = _heart$parentElement2.parentElement) === null || _heart$parentElement2 === void 0 || _heart$parentElement2.classList.toggle("favourite");
    if (heart.classList.contains("favourite")) {
      heart.classList.remove("fa-regular");
      heart.classList.add("fa-solid");
    } else {
      heart.classList.add("fa-regular");
      heart.classList.remove("fa-solid");
    }
    if (!window.localStorage.getItem("cars")) {
      throw Error("Data not found!");
    } else {
      var _carsData = JSON.parse(window.localStorage.getItem("cars") || "");
      for (var i = 0; i < _carsData.length; i++) {
        if (_carsData[i].carName === heartCar.dataset.car) {
          _carsData[i].favourite = heart.classList.contains("favourite");
        }
      }
      window.localStorage.setItem("cars", JSON.stringify(_carsData));
    }
  });
});
var recomendationCars = document.querySelectorAll("main .recomendation-cars .card .major .car-image img");
function changeCarImg() {
  recomendationCars.forEach(function (car) {
    if (window.innerWidth === 768) {
      car.src = car.dataset.mobileimg || "";
    } else {
      car.src = car.dataset.largeimg || "";
    }
  });
}
window.addEventListener("load", changeCarImg);
window.addEventListener("resize", changeCarImg);
var favouritesPage = document.querySelector("main.favourite-page .list");
var noFavourites = document.querySelector(".no-favourites");
function checkNoFavourites() {
  var carsData = JSON.parse(window.localStorage.getItem("cars") || "");
  for (var i = 0; i < carsData.length; i++) {
    if (carsData[i].favourite) {
      return;
    }
  }
  favouritesPage === null || favouritesPage === void 0 || favouritesPage.classList.add("hide");
  noFavourites === null || noFavourites === void 0 || noFavourites.classList.add("show");
}
window.addEventListener("load", function () {
  checkNoFavourites();
  if (window.localStorage.getItem("cars")) {
    var _carsData2 = JSON.parse(window.localStorage.getItem("cars") || "");
    var _loop = function _loop(i) {
      if (_carsData2[i].favourite) {
        var card = document.createElement("div");
        card.className = "card car rad-10 bg-white p-20";
        favouritesPage === null || favouritesPage === void 0 || favouritesPage.appendChild(card);
        for (var key in _carsData2[i]) {
          if (!_carsData2[i].hasOwnProperty(key)) continue;
          var value = _carsData2[i][key];
          if (key === "largeImg" || key === "mobileImg") {
            value = value || _carsData2[i]["img"];
          }
          if (value != null) {
            card.setAttribute("data-".concat(key.toLowerCase()), value.toString());
          }
        }
        var top = document.createElement("div");
        top.className = "top";
        card.appendChild(top);
        var title = document.createElement("div");
        title.className = "title between-flex";
        top.appendChild(title);
        var carName = document.createElement("h3");
        carName.className = "m-0";
        carName.textContent = _carsData2[i].carName;
        title.appendChild(carName);
        var removeIcon = document.createElement("i");
        removeIcon.className = "fa-solid fa-trash fs-20 remove";
        title.appendChild(removeIcon);
        removeIcon.addEventListener("click", function () {
          var _removeIcon$parentEle2;
          _carsData2[i].favourite = false;
          window.localStorage.setItem("cars", JSON.stringify(_carsData2));
          for (var _i = 0; _i < _carsData2.length; _i++) {
            if (_carsData2[_i].favourite) {
              var _removeIcon$parentEle;
              (_removeIcon$parentEle = removeIcon.parentElement) === null || _removeIcon$parentEle === void 0 || (_removeIcon$parentEle = _removeIcon$parentEle.parentElement) === null || _removeIcon$parentEle === void 0 || (_removeIcon$parentEle = _removeIcon$parentEle.parentElement) === null || _removeIcon$parentEle === void 0 || _removeIcon$parentEle.remove();
              return;
            }
          }
          checkNoFavourites();
          (_removeIcon$parentEle2 = removeIcon.parentElement) === null || _removeIcon$parentEle2 === void 0 || (_removeIcon$parentEle2 = _removeIcon$parentEle2.parentElement) === null || _removeIcon$parentEle2 === void 0 || (_removeIcon$parentEle2 = _removeIcon$parentEle2.parentElement) === null || _removeIcon$parentEle2 === void 0 || _removeIcon$parentEle2.remove();
        });
        var category = document.createElement("span");
        category.className = "category d-block mt-10 fs-14 fw-bold";
        category.textContent = _carsData2[i].category;
        top.appendChild(category);
        var carImage = document.createElement("div");
        carImage.className = "car-image txt-c mt-50 mb-60";
        card.appendChild(carImage);
        var img = document.createElement("img");
        img.src = _carsData2[i].largeImg;
        img.alt = _carsData2[i].carName;
        img.dataset.mobileimg = _carsData2[i].mobileImg;
        img.dataset.largeimg = _carsData2[i].largeImg;
        carImage.appendChild(img);
        var bottom = document.createElement("div");
        bottom.className = "bottom";
        card.appendChild(bottom);
        var info = document.createElement("div");
        info.className = "info between-flex fs-17";
        bottom.appendChild(info);
        var gasInfo = document.createElement("div");
        gasInfo.className = "gasoline-info";
        info.appendChild(gasInfo);
        var gasIcon = document.createElement("i");
        gasIcon.className = "fa-solid fa-gas-pump";
        gasInfo.appendChild(gasIcon);
        var litres = document.createElement("span");
        litres.textContent = "".concat(_carsData2[i].gas, "L");
        gasInfo.appendChild(litres);
        var steeringWheelInfo = document.createElement("div");
        steeringWheelInfo.className = "Steering-wheel-info";
        info.appendChild(steeringWheelInfo);
        var steeringWheelIcon = document.createElement("i");
        steeringWheelIcon.className = "fa-solid fa-car";
        steeringWheelInfo.appendChild(steeringWheelIcon);
        var type = document.createElement("span");
        type.textContent = _carsData2[i].steeringWheel;
        steeringWheelInfo.appendChild(type);
        var passengersInfo = document.createElement("div");
        passengersInfo.className = "passengers-info";
        info.appendChild(passengersInfo);
        var passengersIcon = document.createElement("i");
        passengersIcon.className = "fa-solid fa-users";
        passengersInfo.appendChild(passengersIcon);
        var passengersNumber = document.createElement("span");
        passengersNumber.textContent = "".concat(_carsData2[i].passengers, " People");
        passengersInfo.appendChild(passengersNumber);
        var priceHolder = document.createElement("div");
        priceHolder.className = "price-info between-flex mt-25";
        bottom.appendChild(priceHolder);
        var _price = document.createElement("span");
        _price.className = "fs-18 fw-bold p-relative d-block mb-3 price";
        _price.textContent = "$".concat(_carsData2[i].price, "/");
        if (_carsData2[i].discount) {
          var afterDiscount = document.createElement("div");
          afterDiscount.className = "after-discount";
          priceHolder.appendChild(afterDiscount);
          afterDiscount.appendChild(_price);
          var discount = document.createElement("span");
          discount.className = "discount fs-12 fw-bold";
          discount.textContent = "$".concat(_carsData2[i].discount);
          afterDiscount.appendChild(discount);
        } else {
          priceHolder.appendChild(_price);
        }
        var rental = document.createElement("a");
        rental.className = "rad-3 d-block w-fit";
        rental.href = "car.html?id=".concat(_carsData2[i].id);
        rental.textContent = "Rental Now";
        priceHolder.appendChild(rental);
      }
    };
    for (var i = 0; i < _carsData2.length; i++) {
      _loop(i);
    }
  }
});
var detailsIcon = document.querySelector("header .left-side .search .details");
detailsIcon.addEventListener("click", function () {
  window.location.href = "cars-details.html";
});
var priceSlider = document.querySelector("aside form .slider");
var sliderValue = document.querySelector("aside form .slider-value");
function slider() {
  priceSlider.style.backgroundColor = "#264BC8";
  sliderValue.textContent = "Max: $".concat(priceSlider.value, ".00");
}
var infoSection = document.querySelector(".car-page .info");
var carInfoImg = document.querySelector(".car-page .car-info .images .main-image img");
var carInfoCategory = document.querySelectorAll(".car-page .category");
var carInfoName = document.querySelectorAll(".car-page .car-name");
var carInfoCapacity = document.querySelectorAll(".car-page .capacity");
var carInfoSteeringWheel = document.querySelectorAll(".car-page .steering-wheel");
var carInfoGas = document.querySelectorAll(".car-page .gas");
var carInfoPrice = document.querySelector(".car-page .price-info .price");
var idParam = new URLSearchParams(window.location.search).get("id");
var _loop2 = function _loop2(i) {
  if (carsData[i].id === idParam) {
    if (carInfoImg) {
      carInfoImg.src = carsData[i].largeImg;
    }
    carInfoCategory.forEach(function (category) {
      category.textContent = carsData[i].category;
    });
    carInfoName.forEach(function (name) {
      name.textContent = carsData[i].carName;
    });
    carInfoCapacity.forEach(function (passengers) {
      passengers.textContent = carsData[i].passengers;
    });
    carInfoSteeringWheel.forEach(function (wheel) {
      wheel.textContent = carsData[i].steeringWheel;
    });
    carInfoGas.forEach(function (gas) {
      gas.textContent = carsData[i].gas;
    });
    if (carInfoPrice) {
      carInfoPrice.children[0].textContent = "$".concat(carsData[i].price, "/");
    }
    if (carsData[i].discount) {
      var discount = document.createElement("span");
      discount.className = "discount fs-12 fw-bold fs-14";
      discount.textContent = "$".concat(carsData[i].discount);
      carInfoPrice === null || carInfoPrice === void 0 || carInfoPrice.appendChild(discount);
    }
    if (infoSection) {
      infoSection.dataset.car = carsData[i].carName;
    }
  }
};
for (var i = 0; i < carsData.length; i++) {
  _loop2(i);
}
var carPage = document.querySelector(".car-page .list");
var billPageLink = document.querySelector(".car-page .price-info a");
if (billPageLink) {
  billPageLink.href = "bill.html?id=".concat(idParam);
}
var viewOne = document.querySelectorAll(".view-1");
var viewTwo = document.querySelector(".view-2");
function changeView() {
  if (innerWidth <= 650) {
    viewOne.forEach(function (view) {
      view.src = "imgs/view-1-mobile.png";
    });
    viewTwo.src = "imgs/view-2-mobile.png";
  } else {
    viewOne.forEach(function (view) {
      view.src = "imgs/view-1.png";
    });
    viewTwo.src = "imgs/view-2.png";
  }
}
if (viewOne && viewTwo) {
  addEventListener("resize", changeView);
  addEventListener("DOMContentLoaded", changeView);
}
var commentOne = document.querySelectorAll(".comments .comment .comment-info p")[0];
var commentTwo = document.querySelectorAll(".comments .comment .comment-info p")[1];
function changeTextLength(text, chars) {
  if (text.length <= chars) throw Error("The Text Length Is Smaller Than The Given Chars");
  var newText = "";
  for (var _i2 = 0; _i2 < chars; _i2++) {
    newText += text[_i2];
  }
  newText += "...";
  return newText;
}
if (commentOne && commentTwo) {
  var originalTextOne = commentOne.textContent;
  var originalTextTwo = commentTwo.textContent;
  addEventListener("DOMContentLoaded", function () {
    if (innerWidth <= 768) {
      var shortTextOne = changeTextLength(commentOne.textContent || "", 80);
      var shortTextTwo = changeTextLength(commentTwo.textContent || "", 80);
      commentOne.textContent = shortTextOne;
      commentTwo.textContent = shortTextTwo;
    } else {
      var largeTextOne = originalTextOne;
      var largeTextTwo = originalTextTwo;
      commentOne.textContent = largeTextOne;
      commentTwo.textContent = largeTextTwo;
    }
  });
  addEventListener("resize", function () {
    if (innerWidth <= 768) {
      var shortTextOne = changeTextLength(commentOne.textContent || "", 80);
      var shortTextTwo = changeTextLength(commentTwo.textContent || "", 80);
      commentOne.textContent = shortTextOne;
      commentTwo.textContent = shortTextTwo;
    } else {
      var largeTextOne = originalTextOne;
      var largeTextTwo = originalTextTwo;
      commentOne.textContent = largeTextOne;
      commentTwo.textContent = largeTextTwo;
    }
  });
}

// function changeCommentText(): void {
//   let mobileTextOne = "We are very happy with the service from the MORENT App. Morent has a low price...";
//   let largeTextOne = "We are very happy with the service from the MORENT App. Morent has a low price and also a large variety of cars with good and comfortable facilities. In addition, the service provided by the officers is also very friendly and very polite.";

//   let mobileTextTwo = "We are greatly helped by the services of the MORENT Application. Morent has a low...";
//   let largeTextTwo = "We are greatly helped by the services of the MORENT Application. Morent has low prices and also a wide variety of cars with good and comfortable facilities. In addition, the service provided by the officers is also very friendly and very polite."

//   window.addEventListener("DOMContentLoaded", () => {
//     if (window.innerWidth <= 768) {
//       commentOne.textContent = mobileTextOne;
//       commentTwo.textContent = mobileTextTwo;
//     } else {
//       commentOne.textContent = largeTextOne;
//       commentTwo.textContent = largeTextTwo;
//     }
//   });

//   window.addEventListener("resize", () => {
//     if (window.innerWidth <= 768) {
//       console.log(commentOne);
//       commentOne.textContent = mobileTextOne;
//       commentTwo.textContent = mobileTextTwo;
//     } else {
//       commentOne.textContent = largeTextOne;
//       commentTwo.textContent = largeTextTwo;
//     }
//   });
// }

// if (commentOne && commentTwo) {
//   changeCommentText();
// }

addEventListener("load", function () {
  checkNoFavourites();
  if (window.localStorage.getItem("cars")) {
    var _carsData3 = JSON.parse(window.localStorage.getItem("cars") || "");
    var _loop3 = function _loop3(_i3) {
      var card = document.createElement("div");
      card.className = "card car rad-10 bg-white p-20";
      carPage === null || carPage === void 0 || carPage.appendChild(card);
      for (var key in _carsData3[_i3]) {
        if (!_carsData3[_i3].hasOwnProperty(key)) continue;
        var value = _carsData3[_i3][key];
        if (key === "largeImg" || key === "mobileImg") {
          value = value || _carsData3[_i3]["img"];
        }
        if (value != null) {
          card.setAttribute("data-".concat(key.toLowerCase()), value.toString());
        }
      }
      var top = document.createElement("div");
      top.className = "top";
      card.appendChild(top);
      var title = document.createElement("div");
      title.className = "title between-flex";
      top.appendChild(title);
      var carName = document.createElement("h3");
      carName.className = "m-0";
      carName.textContent = _carsData3[_i3].carName;
      title.appendChild(carName);
      var removeIcon = document.createElement("i");
      removeIcon.className = "fa-solid fa-trash fs-20 remove";
      title.appendChild(removeIcon);
      removeIcon.addEventListener("click", function () {
        var _removeIcon$parentEle4;
        _carsData3[_i3].favourite = false;
        window.localStorage.setItem("cars", JSON.stringify(_carsData3));
        for (var _i4 = 0; _i4 < _carsData3.length; _i4++) {
          if (_carsData3[_i4].favourite) {
            var _removeIcon$parentEle3;
            (_removeIcon$parentEle3 = removeIcon.parentElement) === null || _removeIcon$parentEle3 === void 0 || (_removeIcon$parentEle3 = _removeIcon$parentEle3.parentElement) === null || _removeIcon$parentEle3 === void 0 || (_removeIcon$parentEle3 = _removeIcon$parentEle3.parentElement) === null || _removeIcon$parentEle3 === void 0 || _removeIcon$parentEle3.remove();
            return;
          }
        }
        checkNoFavourites();
        (_removeIcon$parentEle4 = removeIcon.parentElement) === null || _removeIcon$parentEle4 === void 0 || (_removeIcon$parentEle4 = _removeIcon$parentEle4.parentElement) === null || _removeIcon$parentEle4 === void 0 || (_removeIcon$parentEle4 = _removeIcon$parentEle4.parentElement) === null || _removeIcon$parentEle4 === void 0 || _removeIcon$parentEle4.remove();
      });
      var category = document.createElement("span");
      category.className = "category d-block mt-10 fs-14 fw-bold";
      category.textContent = _carsData3[_i3].category;
      top.appendChild(category);
      var carImage = document.createElement("div");
      carImage.className = "car-image txt-c mt-50 mb-60";
      card.appendChild(carImage);
      var img = document.createElement("img");
      img.src = _carsData3[_i3].largeImg;
      img.alt = _carsData3[_i3].carName;
      img.dataset.mobileimg = _carsData3[_i3].mobileImg;
      img.dataset.largeimg = _carsData3[_i3].largeImg;
      carImage.appendChild(img);
      var bottom = document.createElement("div");
      bottom.className = "bottom";
      card.appendChild(bottom);
      var info = document.createElement("div");
      info.className = "info between-flex fs-17";
      bottom.appendChild(info);
      var gasInfo = document.createElement("div");
      gasInfo.className = "gasoline-info";
      info.appendChild(gasInfo);
      var gasIcon = document.createElement("i");
      gasIcon.className = "fa-solid fa-gas-pump";
      gasInfo.appendChild(gasIcon);
      var litres = document.createElement("span");
      litres.textContent = "".concat(_carsData3[_i3].gas, "L");
      gasInfo.appendChild(litres);
      var steeringWheelInfo = document.createElement("div");
      steeringWheelInfo.className = "Steering-wheel-info";
      info.appendChild(steeringWheelInfo);
      var steeringWheelIcon = document.createElement("i");
      steeringWheelIcon.className = "fa-solid fa-car";
      steeringWheelInfo.appendChild(steeringWheelIcon);
      var type = document.createElement("span");
      type.textContent = _carsData3[_i3].steeringWheel;
      steeringWheelInfo.appendChild(type);
      var passengersInfo = document.createElement("div");
      passengersInfo.className = "passengers-info";
      info.appendChild(passengersInfo);
      var passengersIcon = document.createElement("i");
      passengersIcon.className = "fa-solid fa-users";
      passengersInfo.appendChild(passengersIcon);
      var passengersNumber = document.createElement("span");
      passengersNumber.textContent = "".concat(_carsData3[_i3].passengers, " People");
      passengersInfo.appendChild(passengersNumber);
      var priceHolder = document.createElement("div");
      priceHolder.className = "price-info between-flex mt-25";
      bottom.appendChild(priceHolder);
      var price = document.createElement("span");
      price.className = "fs-18 fw-bold p-relative d-block mb-3 price";
      price.textContent = "$".concat(_carsData3[_i3].price, "/");
      if (_carsData3[_i3].discount) {
        var afterDiscount = document.createElement("div");
        afterDiscount.className = "after-discount";
        priceHolder.appendChild(afterDiscount);
        afterDiscount.appendChild(price);
        var discount = document.createElement("span");
        discount.className = "discount fs-12 fw-bold";
        discount.textContent = "$".concat(_carsData3[_i3].discount);
        afterDiscount.appendChild(discount);
      } else {
        priceHolder.appendChild(price);
      }
      var rental = document.createElement("a");
      rental.className = "rad-3 d-block w-fit";
      rental.href = "car.html?id=".concat(_carsData3[_i3].id);
      rental.textContent = "Rental Now";
      priceHolder.appendChild(rental);
    };
    for (var _i3 = 0; _i3 < 6; _i3++) {
      _loop3(_i3);
    }
  }
});
var billIdParam = new URLSearchParams(window.location.search).get("id");
var billCarImg = document.querySelector(".summary .info .image img");
var billCarName = document.querySelector(".summary .info div .name");
var price = document.querySelectorAll(".summary .car-price");
if (billCarImg && billCarName && price) {
  addEventListener("DOMContentLoaded", function () {
    var _loop4 = function _loop4(_i5) {
      if (carsData[_i5].id === billIdParam) {
        if (billCarImg) billCarImg.src = carsData[_i5].mobileImg;
        billCarName.textContent = carsData[_i5].carName;
        price.forEach(function (carPrice) {
          carPrice.textContent = "$".concat(carsData[_i5].price);
        });
      }
    };
    for (var _i5 = 0; _i5 < carsData.length; _i5++) {
      _loop4(_i5);
    }
  });
}
var paymentMethods = document.querySelectorAll(".billing-info .payment-method .method input[type='radio']");
paymentMethods.forEach(function (method) {
  method.addEventListener("change", function () {
    var _method$parentElement;
    paymentMethods.forEach(function (otherMethod) {
      var _otherMethod$parentEl;
      var otherFields = (_otherMethod$parentEl = otherMethod.parentElement) === null || _otherMethod$parentEl === void 0 || (_otherMethod$parentEl = _otherMethod$parentEl.parentElement) === null || _otherMethod$parentEl === void 0 ? void 0 : _otherMethod$parentEl.nextElementSibling;
      if (otherFields) otherFields.style.display = "none";
    });
    var selectedField = (_method$parentElement = method.parentElement) === null || _method$parentElement === void 0 || (_method$parentElement = _method$parentElement.parentElement) === null || _method$parentElement === void 0 ? void 0 : _method$parentElement.nextElementSibling;
    if (selectedField) selectedField.style.display = "grid";
  });
});