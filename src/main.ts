const hearts = document.querySelectorAll(".heart") as NodeListOf<HTMLElement>;
const cars = document.querySelectorAll("main .car") as NodeListOf<HTMLDivElement>;

interface CarData {
  carName: string;
  favourite: boolean;
  category: string;
  largeImg: string;
  mobileImg: string;
  gas: string;
  steeringWheel: string;
  passengers: string;
  price: string;
  discount: string | null;
  id: string;
};

let carsData: CarData[];

if (!localStorage.getItem("cars")) {
  // Build The Required Data
  carsData = Array.from(cars).map((car) => ({
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
    id: car.dataset.id || "",
  }));
  localStorage.setItem("cars", JSON.stringify(carsData));
} else {
  // Return It If It Already Exist
  carsData = JSON.parse(localStorage.getItem("cars") || "[]");
}

// Specify The Favourite Cars
hearts.forEach((heart) => {
  const heartCar = heart.closest(".car") as HTMLElement;
  if (!heartCar) return;

  const carName = heartCar.dataset.car;
  const carData = carsData.find((c) => c.carName === carName);

  if (carData?.favourite) {
    heart.classList.add("favourite", "fa-solid");
    heart.classList.remove("fa-regular");
    heartCar.classList.add("favourite");
  }
});


hearts.forEach((heart) => {
  heart.addEventListener("click", () => {
    let heartCar = heart.parentElement?.parentElement as HTMLDivElement;
    heart.classList.toggle("favourite");
    heart.parentElement?.parentElement?.classList.toggle("favourite");
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
      let carsData = JSON.parse(window.localStorage.getItem("cars") || "");
      for (let i = 0; i < carsData.length; i++) {
        if (carsData[i].carName === heartCar.dataset.car) {
          carsData[i].favourite = heart.classList.contains("favourite");
        }
      }
      window.localStorage.setItem("cars", JSON.stringify(carsData));
    }
  });
});

const recomendationCars = document.querySelectorAll(
  "main .recomendation-cars .card .major .car-image img"
) as NodeListOf<HTMLImageElement>;

function changeCarImg(): void {
  recomendationCars.forEach((car) => {
    if (window.innerWidth === 768) {
      car.src = car.dataset.mobileimg || "";
    } else {
      car.src = car.dataset.largeimg || "";
    }
  });
}

window.addEventListener("load", changeCarImg);
window.addEventListener("resize", changeCarImg);

const favouritesPage = document.querySelector(
  "main.favourite-page .list"
) as HTMLDivElement;
const noFavourites = document.querySelector(
  ".no-favourites"
) as HTMLParagraphElement;

function checkNoFavourites(): void {
  let carsData = JSON.parse(window.localStorage.getItem("cars") || "");
  for (let i = 0; i < carsData.length; i++) {
    if (carsData[i].favourite) {
      return;
    }
  }
  favouritesPage?.classList.add("hide");
  noFavourites?.classList.add("show");
}

window.addEventListener("load", () => {
  checkNoFavourites();
  if (window.localStorage.getItem("cars")) {
    let carsData = JSON.parse(window.localStorage.getItem("cars") || "");
    for (let i = 0; i < carsData.length; i++) {
      if (carsData[i].favourite) {
        let card = document.createElement("div");
        card.className = "card car rad-10 bg-white p-20";
        favouritesPage?.appendChild(card);

        for (const key in carsData[i]) {
          if (!carsData[i].hasOwnProperty(key)) continue;
          let value = carsData[i][key];
          if (key === "largeImg" || key === "mobileImg") {
            value = value || carsData[i]["img"];
          }
          if (value != null) {
            card.setAttribute(`data-${key.toLowerCase()}`, value.toString());
          }
        }

        let top = document.createElement("div");
        top.className = "top";
        card.appendChild(top);

        let title = document.createElement("div");
        title.className = "title between-flex";
        top.appendChild(title);

        let carName = document.createElement("h3");
        carName.className = "m-0";
        carName.textContent = carsData[i].carName;
        title.appendChild(carName);

        let removeIcon = document.createElement("i");
        removeIcon.className = "fa-solid fa-trash fs-20 remove";
        title.appendChild(removeIcon);

        removeIcon.addEventListener("click", () => {
          carsData[i].favourite = false;
          window.localStorage.setItem("cars", JSON.stringify(carsData));
          for (let i = 0; i < carsData.length; i++) {
            if (carsData[i].favourite) {
              removeIcon.parentElement?.parentElement?.parentElement?.remove();
              return;
            }
          }
          checkNoFavourites();
          removeIcon.parentElement?.parentElement?.parentElement?.remove();
        });

        let category = document.createElement("span");
        category.className = "category d-block mt-10 fs-14 fw-bold";
        category.textContent = carsData[i].category;
        top.appendChild(category);

        let carImage = document.createElement("div");
        carImage.className = "car-image txt-c mt-50 mb-60";
        card.appendChild(carImage);

        let img = document.createElement("img");
        img.src = carsData[i].largeImg;
        img.alt = carsData[i].carName;
        img.dataset.mobileimg = carsData[i].mobileImg;
        img.dataset.largeimg = carsData[i].largeImg;
        carImage.appendChild(img);

        let bottom = document.createElement("div");
        bottom.className = "bottom";
        card.appendChild(bottom);

        let info = document.createElement("div");
        info.className = "info between-flex fs-17";
        bottom.appendChild(info);

        let gasInfo = document.createElement("div");
        gasInfo.className = "gasoline-info";
        info.appendChild(gasInfo);

        let gasIcon = document.createElement("i");
        gasIcon.className = "fa-solid fa-gas-pump";
        gasInfo.appendChild(gasIcon);

        let litres = document.createElement("span");
        litres.textContent = `${carsData[i].gas}L`;
        gasInfo.appendChild(litres);

        let steeringWheelInfo = document.createElement("div");
        steeringWheelInfo.className = "Steering-wheel-info";
        info.appendChild(steeringWheelInfo);

        let steeringWheelIcon = document.createElement("i");
        steeringWheelIcon.className = "fa-solid fa-car";
        steeringWheelInfo.appendChild(steeringWheelIcon);

        let type = document.createElement("span");
        type.textContent = carsData[i].steeringWheel;
        steeringWheelInfo.appendChild(type);

        let passengersInfo = document.createElement("div");
        passengersInfo.className = "passengers-info";
        info.appendChild(passengersInfo);

        let passengersIcon = document.createElement("i");
        passengersIcon.className = "fa-solid fa-users";
        passengersInfo.appendChild(passengersIcon);

        let passengersNumber = document.createElement("span");
        passengersNumber.textContent = `${carsData[i].passengers} People`;
        passengersInfo.appendChild(passengersNumber);

        let priceHolder = document.createElement("div");
        priceHolder.className = "price-info between-flex mt-25";
        bottom.appendChild(priceHolder);

        let price = document.createElement("span");
        price.className = "fs-18 fw-bold p-relative d-block mb-3 price";
        price.textContent = `$${carsData[i].price}/`;

        if (carsData[i].discount) {
          let afterDiscount = document.createElement("div");
          afterDiscount.className = "after-discount";
          priceHolder.appendChild(afterDiscount);

          afterDiscount.appendChild(price);

          let discount = document.createElement("span");
          discount.className = "discount fs-12 fw-bold";
          discount.textContent = `$${carsData[i].discount}`;
          afterDiscount.appendChild(discount);
        } else {
          priceHolder.appendChild(price);
        }

        let rental = document.createElement("a");
        rental.className = "rad-3 d-block w-fit";
        rental.href = `car.html?id=${carsData[i].id}`;
        rental.textContent = "Rental Now";
        priceHolder.appendChild(rental);
      }
    }
  }
});

let detailsIcon = document.querySelector(
  "header .left-side .search .details"
) as HTMLElement;
detailsIcon.addEventListener("click", () => {
  window.location.href = "cars-details.html";
});

let priceSlider = document.querySelector(
  "aside form .slider"
) as HTMLInputElement;
let sliderValue = document.querySelector(
  "aside form .slider-value"
) as HTMLParagraphElement;

function slider() {
  priceSlider.style.backgroundColor = "#264BC8";
  sliderValue.textContent = `Max: $${priceSlider.value}.00`;
}

let infoSection = document.querySelector(".car-page .info") as HTMLDivElement;
let carInfoImg = document.querySelector(".car-page .car-info .images .main-image img") as HTMLImageElement;
let carInfoCategory = document.querySelectorAll(".car-page .category") as NodeListOf<HTMLSpanElement>;
let carInfoName = document.querySelectorAll(".car-page .car-name") as NodeListOf<HTMLSpanElement>;
let carInfoCapacity = document.querySelectorAll(".car-page .capacity") as NodeListOf<HTMLSpanElement>;
let carInfoSteeringWheel = document.querySelectorAll(".car-page .steering-wheel") as NodeListOf<HTMLSpanElement>;
let carInfoGas = document.querySelectorAll(".car-page .gas") as NodeListOf<HTMLSpanElement>;
let carInfoPrice = document.querySelector(".car-page .price-info .price");

let idParam = new URLSearchParams(window.location.search).get("id");
for (let i = 0; i < carsData.length; i++) {
  if (carsData[i].id === idParam) {
    if (carInfoImg) {
      carInfoImg.src = carsData[i].largeImg;
    }
    carInfoCategory.forEach((category) => {
      category.textContent = carsData[i].category;
    })
    carInfoName.forEach((name) => {
      name.textContent = carsData[i].carName;
    })
    carInfoCapacity.forEach((passengers) => {
      passengers.textContent = carsData[i].passengers;
    })
    carInfoSteeringWheel.forEach((wheel) => {
      wheel.textContent = carsData[i].steeringWheel;
    })
    carInfoGas.forEach((gas) => {
      gas.textContent = carsData[i].gas;
    })
    
    if (carInfoPrice) {
      carInfoPrice.children[0].textContent = `$${carsData[i].price}/`;
    }

    if (carsData[i].discount) {
      let discount = document.createElement("span");
      discount.className = "discount fs-12 fw-bold fs-14";
      discount.textContent = `$${carsData[i].discount}`;
      carInfoPrice?.appendChild(discount);
    }

    infoSection.dataset.car = carsData[i].carName;
  }
}

const carPage = document.querySelector(".car-page .list");
const billPageLink = document.querySelector(".car-page .price-info a") as HTMLAnchorElement;
if (billPageLink) {
  billPageLink.href = `bill.html?id=${idParam}`;
}

const viewOne = document.querySelectorAll(".view-1") as NodeListOf<HTMLImageElement>;
const viewTwo = document.querySelector(".view-2") as HTMLImageElement;

function changeView(): void {
  if (innerWidth <= 650) {
    viewOne.forEach((view) => {
      view.src = "imgs/view-1-mobile.png";
    })
    viewTwo.src = "imgs/view-2-mobile.png";
  } else {
    viewOne.forEach((view) => {
      view.src = "imgs/view-1.png";
    })
    viewTwo.src = "imgs/view-2.png";
  }
}

addEventListener("resize", changeView);
addEventListener("load", changeView);

addEventListener("load", () => {
  checkNoFavourites();
  if (window.localStorage.getItem("cars")) {
    let carsData = JSON.parse(window.localStorage.getItem("cars") || "");
    for (let i = 0; i < 6; i++) {
      let card = document.createElement("div");
      card.className = "card car rad-10 bg-white p-20";
      carPage?.appendChild(card);

      for (const key in carsData[i]) {
        if (!carsData[i].hasOwnProperty(key)) continue;
        let value = carsData[i][key];
        if (key === "largeImg" || key === "mobileImg") {
          value = value || carsData[i]["img"];
        }
        if (value != null) {
          card.setAttribute(`data-${key.toLowerCase()}`, value.toString());
        }
      }

      let top = document.createElement("div");
      top.className = "top";
      card.appendChild(top);

      let title = document.createElement("div");
      title.className = "title between-flex";
      top.appendChild(title);

      let carName = document.createElement("h3");
      carName.className = "m-0";
      carName.textContent = carsData[i].carName;
      title.appendChild(carName);

      let removeIcon = document.createElement("i");
      removeIcon.className = "fa-solid fa-trash fs-20 remove";
      title.appendChild(removeIcon);

      removeIcon.addEventListener("click", () => {
        carsData[i].favourite = false;
        window.localStorage.setItem("cars", JSON.stringify(carsData));
        for (let i = 0; i < carsData.length; i++) {
          if (carsData[i].favourite) {
            removeIcon.parentElement?.parentElement?.parentElement?.remove();
            return;
          }
        }
        checkNoFavourites();
        removeIcon.parentElement?.parentElement?.parentElement?.remove();
      });

      let category = document.createElement("span");
      category.className = "category d-block mt-10 fs-14 fw-bold";
      category.textContent = carsData[i].category;
      top.appendChild(category);

      let carImage = document.createElement("div");
      carImage.className = "car-image txt-c mt-50 mb-60";
      card.appendChild(carImage);

      let img = document.createElement("img");
      img.src = carsData[i].largeImg;
      img.alt = carsData[i].carName;
      img.dataset.mobileimg = carsData[i].mobileImg;
      img.dataset.largeimg = carsData[i].largeImg;
      carImage.appendChild(img);

      let bottom = document.createElement("div");
      bottom.className = "bottom";
      card.appendChild(bottom);

      let info = document.createElement("div");
      info.className = "info between-flex fs-17";
      bottom.appendChild(info);

      let gasInfo = document.createElement("div");
      gasInfo.className = "gasoline-info";
      info.appendChild(gasInfo);

      let gasIcon = document.createElement("i");
      gasIcon.className = "fa-solid fa-gas-pump";
      gasInfo.appendChild(gasIcon);

      let litres = document.createElement("span");
      litres.textContent = `${carsData[i].gas}L`;
      gasInfo.appendChild(litres);

      let steeringWheelInfo = document.createElement("div");
      steeringWheelInfo.className = "Steering-wheel-info";
      info.appendChild(steeringWheelInfo);

      let steeringWheelIcon = document.createElement("i");
      steeringWheelIcon.className = "fa-solid fa-car";
      steeringWheelInfo.appendChild(steeringWheelIcon);

      let type = document.createElement("span");
      type.textContent = carsData[i].steeringWheel;
      steeringWheelInfo.appendChild(type);

      let passengersInfo = document.createElement("div");
      passengersInfo.className = "passengers-info";
      info.appendChild(passengersInfo);

      let passengersIcon = document.createElement("i");
      passengersIcon.className = "fa-solid fa-users";
      passengersInfo.appendChild(passengersIcon);

      let passengersNumber = document.createElement("span");
      passengersNumber.textContent = `${carsData[i].passengers} People`;
      passengersInfo.appendChild(passengersNumber);

      let priceHolder = document.createElement("div");
      priceHolder.className = "price-info between-flex mt-25";
      bottom.appendChild(priceHolder);

      let price = document.createElement("span");
      price.className = "fs-18 fw-bold p-relative d-block mb-3 price";
      price.textContent = `$${carsData[i].price}/`;

      if (carsData[i].discount) {
        let afterDiscount = document.createElement("div");
        afterDiscount.className = "after-discount";
        priceHolder.appendChild(afterDiscount);

        afterDiscount.appendChild(price);

        let discount = document.createElement("span");
        discount.className = "discount fs-12 fw-bold";
        discount.textContent = `$${carsData[i].discount}`;
        afterDiscount.appendChild(discount);
      } else {
        priceHolder.appendChild(price);
      }

      let rental = document.createElement("a");
      rental.className = "rad-3 d-block w-fit";
      rental.href = `car.html?id=${carsData[i].id}`;
      rental.textContent = "Rental Now";
      priceHolder.appendChild(rental);
    }
  }
});

const billIdParam = new URLSearchParams(window.location.search).get("id");

const billCarImg = document.querySelector(".summary .info .image img") as HTMLImageElement;
const billCarName = document.querySelector(".summary .info div .name") as HTMLImageElement;
const price = document.querySelectorAll(".summary .car-price") as NodeListOf<HTMLSpanElement>;

addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < carsData.length; i++) {
    if (carsData[i].id === billIdParam) {
      if (billCarImg) billCarImg.src = carsData[i].mobileImg;
      billCarName.textContent = carsData[i].carName;
      price.forEach((carPrice) => {
        carPrice.textContent = `$${carsData[i].price}`;
      });
    }
  }
});

const paymentMethods = document.querySelectorAll<HTMLInputElement>(".billing-info .payment-method .method input[type='radio']");

paymentMethods.forEach((method) => {
  method.addEventListener("change", () => {
    paymentMethods.forEach((otherMethod) => {
      const otherFields = otherMethod.parentElement?.parentElement?.nextElementSibling as HTMLElement;
      if (otherFields) otherFields.style.display = "none";
    });
    const selectedField = method.parentElement?.parentElement?.nextElementSibling as HTMLElement;
    if (selectedField) selectedField.style.display = "grid";
  });
});
