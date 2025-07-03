const hearts = document.querySelectorAll(".heart") as NodeListOf<HTMLElement>;
const cars = document.querySelectorAll(
  "main .car"
) as NodeListOf<HTMLDivElement>;

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
}

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

// A Function To Change The Cars Image Depending On Screen Size
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

// A Function To Check If There Is No Favourite Cars Yes
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

// Function To Style The Slider And Showing The Current Value
function slider() {
  priceSlider.style.backgroundColor = "#264BC8";
  sliderValue.textContent = `Max: $${priceSlider.value}.00`;
}

let infoSection = document.querySelector(".car-page .info") as HTMLDivElement;
let carInfoImg = document.querySelector(
  ".car-page .car-info .images .main-image img"
) as HTMLImageElement;
let carInfoCategory = document.querySelectorAll(
  ".car-page .category"
) as NodeListOf<HTMLSpanElement>;
let carInfoName = document.querySelectorAll(
  ".car-page .car-name"
) as NodeListOf<HTMLSpanElement>;
let carInfoCapacity = document.querySelectorAll(
  ".car-page .capacity"
) as NodeListOf<HTMLSpanElement>;
let carInfoSteeringWheel = document.querySelectorAll(
  ".car-page .steering-wheel"
) as NodeListOf<HTMLSpanElement>;
let carInfoGas = document.querySelectorAll(
  ".car-page .gas"
) as NodeListOf<HTMLSpanElement>;
let carInfoPrice = document.querySelector(".car-page .price-info .price");

let idParam = new URLSearchParams(window.location.search).get("id");
for (let i = 0; i < carsData.length; i++) {
  if (carsData[i].id === idParam) {
    if (carInfoImg) {
      carInfoImg.src = carsData[i].largeImg;
    }
    carInfoCategory.forEach((category) => {
      category.textContent = carsData[i].category;
    });
    carInfoName.forEach((name) => {
      name.textContent = carsData[i].carName;
    });
    carInfoCapacity.forEach((passengers) => {
      passengers.textContent = carsData[i].passengers;
    });
    carInfoSteeringWheel.forEach((wheel) => {
      wheel.textContent = carsData[i].steeringWheel;
    });
    carInfoGas.forEach((gas) => {
      gas.textContent = carsData[i].gas;
    });

    if (carInfoPrice) {
      carInfoPrice.children[0].textContent = `$${carsData[i].price}/`;
    }

    if (carsData[i].discount) {
      let discount = document.createElement("span");
      discount.className = "discount fs-12 fw-bold fs-14";
      discount.textContent = `$${carsData[i].discount}`;
      carInfoPrice?.appendChild(discount);
    }

    if (infoSection) {
      infoSection.dataset.car = carsData[i].carName;
    }
  }
}

const carPage = document.querySelector(".car-page .list");
const billPageLink = document.querySelector(
  ".car-page .price-info a"
) as HTMLAnchorElement;
if (billPageLink) {
  billPageLink.href = `bill.html?id=${idParam}`;
}

const viewOne = document.querySelectorAll(
  ".view-1"
) as NodeListOf<HTMLImageElement>;
const viewTwo = document.querySelector(".view-2") as HTMLImageElement;

// A Function To Change The View Images Depending On Screen Size
function changeView(): void {
  if (innerWidth <= 650) {
    viewOne.forEach((view) => {
      view.src = "imgs/view-1-mobile.png";
    });
    viewTwo.src = "imgs/view-2-mobile.png";
  } else {
    viewOne.forEach((view) => {
      view.src = "imgs/view-1.png";
    });
    viewTwo.src = "imgs/view-2.png";
  }
}

if (viewOne && viewTwo) {
  addEventListener("resize", changeView);
  addEventListener("DOMContentLoaded", changeView);
}

const commentOne = document.querySelectorAll(
  ".comments .comment .comment-info p"
)[0] as HTMLParagraphElement;
const commentTwo = document.querySelectorAll(
  ".comments .comment .comment-info p"
)[1] as HTMLParagraphElement;

// A Function To Change The Length Of A Given Text To A Specific Number
function changeTextLength(text: string, chars: number): string {
  if (text.length <= chars)
    throw Error("The Text Length Is Smaller Than The Given Chars");

  let newText: string = "";
  for (let i = 0; i < chars; i++) {
    newText += text[i];
  }

  newText += "...";
  return newText;
}

if (commentOne && commentTwo) {
  const originalTextOne = commentOne.textContent;
  const originalTextTwo = commentTwo.textContent;
  addEventListener("DOMContentLoaded", () => {
    if (innerWidth <= 768) {
      let shortTextOne = changeTextLength(commentOne.textContent || "", 80);
      let shortTextTwo = changeTextLength(commentTwo.textContent || "", 80);

      commentOne.textContent = shortTextOne;
      commentTwo.textContent = shortTextTwo;
    } else {
      let largeTextOne = originalTextOne;
      let largeTextTwo = originalTextTwo;

      commentOne.textContent = largeTextOne;
      commentTwo.textContent = largeTextTwo;
    }
  });

  addEventListener("resize", () => {
    if (innerWidth <= 768) {
      let shortTextOne = changeTextLength(commentOne.textContent || "", 80);
      let shortTextTwo = changeTextLength(commentTwo.textContent || "", 80);

      commentOne.textContent = shortTextOne;
      commentTwo.textContent = shortTextTwo;
    } else {
      let largeTextOne = originalTextOne;
      let largeTextTwo = originalTextTwo;

      commentOne.textContent = largeTextOne;
      commentTwo.textContent = largeTextTwo;
    }
  });
}

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

const billCarImg = document.querySelector(
  ".summary .info .image img"
) as HTMLImageElement;
const billCarName = document.querySelector(
  ".summary .info div .name"
) as HTMLImageElement;
const price = document.querySelectorAll(
  ".summary .car-price"
) as NodeListOf<HTMLSpanElement>;

if (billCarImg && billCarName && price) {
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
}

const paymentMethodsFields = document.querySelectorAll(
  ".billing-info .payment-method .method input[type='radio']"
) as NodeListOf<HTMLInputElement>;
const paymentMethods = document.querySelectorAll(
  ".billing-info .payment-method .method"
) as NodeListOf<HTMLDivElement>;
const radioBtns = [] as Array<HTMLInputElement>;
paymentMethods.forEach((method) => {
  radioBtns.push(method.querySelector(".choice") as HTMLInputElement);
});

// A Function To Initialize The Payment Methods Data Fields
function initDataFields(method: HTMLDivElement): void {
  // The Holder Container Initialization
  let dataContainer = document.createElement("div");
  dataContainer.className = "d-grid mt-30 payment-field";
  method.appendChild(dataContainer);

  // Number Field Initialization
  let numberField = document.createElement("div");
  numberField.className = "info-input";
  dataContainer.appendChild(numberField);

  let numberLabel = document.createElement("label");
  numberLabel.setAttribute("for", "card-number");
  numberLabel.className = "d-block mb-15 fw-semi-bold";
  numberLabel.textContent = "Card Number";
  numberField.appendChild(numberLabel);

  let numberInput = document.createElement("input");
  numberInput.type = "text";
  numberInput.placeholder = "Card number";
  numberInput.className =
    "card-number-field pl-28 pr-28 pt-20 pb-20 w-full rad-10";
  numberInput.id = "card-number";
  numberField.appendChild(numberInput);

  let numberErrorMsg = document.createElement("p");
  numberErrorMsg.className = "error card-number fs-14 d-none";
  numberField.appendChild(numberErrorMsg);

  // Expiration Date Field Initialization
  let dateField = document.createElement("div");
  dateField.className = "info-input";
  dataContainer.appendChild(dateField);

  let dateLabel = document.createElement("label");
  dateLabel.setAttribute("for", "expiration-date");
  dateLabel.className = "d-block mb-15 fw-semi-bold";
  dateLabel.textContent = "Expiration Date";
  dateField.appendChild(dateLabel);

  let dateInput = document.createElement("input");
  dateInput.type = "text";
  dateInput.placeholder = "DD/MM/YY";
  dateInput.className = "exp-date pl-28 pr-28 pt-20 pb-20 w-full rad-10";
  dateInput.id = "expiration-date";
  dateField.appendChild(dateInput);

  let dateErrorMsg = document.createElement("p");
  dateErrorMsg.className = "error date fs-14 d-none";
  dateField.appendChild(dateErrorMsg);

  // Card Holder Field Initialization
  let holderField = document.createElement("div");
  holderField.className = "info-input";
  dataContainer.appendChild(holderField);

  let holderLabel = document.createElement("label");
  holderLabel.setAttribute("for", "card-holder");
  holderLabel.className = "d-block mb-15 fw-semi-bold";
  holderField.textContent = "Card Holder";
  holderField.appendChild(holderLabel);

  let holderInput = document.createElement("input");
  holderInput.type = "text";
  holderInput.placeholder = "Card Holder";
  holderInput.className = "text-field pl-28 pr-28 pt-20 pb-20 w-full rad-10";
  holderInput.id = "card-holder";
  holderField.appendChild(holderInput);

  let holderErrorMsg = document.createElement("p");
  holderErrorMsg.className = "error text fs-14 d-none";
  holderField.appendChild(holderErrorMsg);

  // CVC Field Initialization
  let cvcField = document.createElement("div");
  cvcField.className = "info-input";
  dataContainer.appendChild(cvcField);

  let cvcLabel = document.createElement("label");
  cvcLabel.setAttribute("for", "cvc");
  cvcLabel.className = "d-block mb-15 fw-semi-bold";
  cvcLabel.textContent = "CVC";
  cvcField.appendChild(cvcLabel);

  let cvcInput = document.createElement("input");
  cvcInput.type = "text";
  cvcInput.placeholder = "CVC";
  cvcInput.className = "cvc-field pl-28 pr-28 pt-20 pb-20 w-full rad-10";
  cvcInput.id = "cvc";
  cvcField.appendChild(cvcInput);

  let cvcErrorMsg = document.createElement("p");
  cvcErrorMsg.className = "error cvc fs-14 d-none";
  cvcField.appendChild(cvcErrorMsg);
}

radioBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    paymentMethods.forEach((otherMethods) => {
      let oldContainer = otherMethods.querySelector(
        ".payment-field"
      ) as HTMLDivElement;
      if (oldContainer) oldContainer.remove();
    });
    let parent = btn.closest(".method") as HTMLDivElement;
    if (parent) initDataFields(parent);
  });
});

const textFields = document.querySelectorAll(
  ".billing-info form .text-field"
) as NodeListOf<HTMLInputElement>;
const phoneField = document.querySelector(
  ".billing-info form .phone-field"
) as HTMLInputElement;

const cardNumberField = document.querySelector(
  ".billing-info form .card-number-field"
) as HTMLInputElement;

cardNumberField.addEventListener("input", () => {
  const maxLength = 16;

  // Remove Any Non Digit Character
  cardNumberField.value = cardNumberField.value.replace(/\D/g, "");

  // If The Value Length Is Greater Than The Max Length
  // Slice The Value
  if (cardNumberField.value.length > maxLength) {
    cardNumberField.value = cardNumberField.value.slice(0, maxLength);
  }

  // Add 2 Spaces After Every 4 Numbers Written
  let formattedValue = cardNumberField.value.replace(/(.{4})/g, "$1  ").trim();
  cardNumberField.value = formattedValue;
});

const expDateField = document.querySelector(
  ".billing-info form .exp-date"
) as HTMLInputElement;

expDateField.addEventListener("input", () => {
  const maxLength = 10;

  // Remove Any Non Digit Character Except slash ( / )
  expDateField.value = expDateField.value.replace(/[a-zA-Z]/g, "");

  // If The Value Length Is Greater Than The Max Length
  // Slice The Value
  if (expDateField.value.length > maxLength) {
    expDateField.value = expDateField.value.slice(0, maxLength);
  }
});

const cvcField = document.querySelector(
  ".billing-info form .cvc-field"
) as HTMLInputElement;

cvcField.addEventListener("input", () => {
  const maxLength = 3;

  // Remove Any Non Digit Character
  cvcField.value = cvcField.value.replace(/\D/, "");

  // If The Value Length Is Greater Than The Max Length
  // Slice The Value
  if (cvcField.value.length > maxLength) {
    cvcField.value = cvcField.value.slice(0, maxLength);
  }
});

const conditionBtns = document.querySelectorAll(".billing-info form .condition-btn") as NodeListOf<HTMLDivElement>;

const confirmBtn = document.querySelector(
  ".confirmation .submit-btn"
) as HTMLAnchorElement;

// A Function To Remove A Specific Letter From A Given Text
function removeChar(text: string, letter: string): string {
  let result: string = "";
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== letter) {
      result += text[i];
    }
  }
  return result;
}

// Form Validation
if (confirmBtn) {
  confirmBtn.addEventListener("click", (e) => {
    let valid = true;

    const textFields = document.querySelectorAll(
      ".billing-info form .text-field"
    ) as NodeListOf<HTMLInputElement>;
    
    const cardNumberField = document.querySelector(
      ".billing-info form .card-number-field"
    ) as HTMLInputElement;

    const expDateField = document.querySelector(
      ".billing-info form .exp-date"
    ) as HTMLInputElement;

    const cvcField = document.querySelector(
      ".billing-info form .cvc-field"
    ) as HTMLInputElement;

    // Text Fields Validation
    textFields.forEach((field) => {
      let error = field.nextElementSibling as HTMLParagraphElement;
      if (field.value.trim() === "" || field.value.length < 3) {
        if (field.value.trim() === "") {
          error.textContent = `This field can't be empty`;
        } else {
          error.textContent = `The value is too short`;
        }
        error.style.display = "block";
        field.classList.add("error");
        valid = false;
      } else {
        error.style.display = "none";
        field.style.color = "#90A3BF";
        field.classList.remove("error");
      }
    });

    // Phone Number Field Validation
    let phoneRe = /\+\d{1,3}\s\d{10}/;
    let phoneError = phoneField.nextElementSibling as HTMLParagraphElement;
    if (phoneField.value.trim() === "" || !phoneRe.test(phoneField.value)) {
      if (phoneField.value.trim() === "") {
        phoneError.textContent = "This field can't be empty";
      } else {
        phoneError.textContent = "Invalid phone number format";
      }
      phoneError.style.display = "block";
      phoneField.classList.add("error");
      valid = false;
    } else {
      phoneError.style.display = "none";
      phoneField.style.color = "#90A3BF";
      phoneField.classList.remove("error");
    }

    // Card Number Field Validation
    let numberError = cardNumberField.nextElementSibling as HTMLParagraphElement;
    let cardNumber = removeChar(cardNumberField.value, " ");
    if (cardNumberField.value.trim() === "" || cardNumber.length < 16) {
      if (cardNumberField.value.trim() === "") {
        numberError.textContent = "This field can't be empty";
      } else {
        numberError.textContent = "Please insert the full number";
      }

      numberError.style.display = "block";
      cardNumberField.classList.add("error");
      valid = false;
    } else {
      numberError.style.display = "none";
      cardNumberField.style.color = "#90A3BF";
      cardNumberField.classList.remove("error");
    }

    // Expiration Date Field Validation
    let dateError = expDateField.nextElementSibling as HTMLParagraphElement;
    let dateRe = /\d{1,2}\/\d{1,2}\/\d{2}/gi;
    if (expDateField.value.trim() === "" || !dateRe.test(expDateField.value)) {
      if (expDateField.value.trim() === "") {
        dateError.textContent = "This field can't be empty";
      } else {
        dateError.textContent = "Invalid expiration date format";
      }

      dateError.style.display = "block";
      expDateField.classList.add("error");
      valid = false;
    } else {
      dateError.style.display = "none";
      expDateField.style.color = "#90A3BF";
      expDateField.classList.remove("error");
    }

    // CVC Field Validation
    let cvcError = cvcField.nextElementSibling as HTMLParagraphElement;
    if (cvcField.value.trim() === "" || cvcField.value.length < 3) {
      if (cvcField.value.trim() === "") {
        cvcError.textContent = "This field can't be empty";
      } else {
        cvcError.textContent = "Please insert the full number";
      }

      cvcError.style.display = "block";
      cvcField.classList.add("error");
      valid = false;
    } else {
      cvcError.style.display = "none";
      cvcField.style.color = "#90A3BF";
      cvcField.classList.remove("error");
    }

    // Condition Buttons Confirmation
    conditionBtns.forEach((btnContainer) => {
      const btn = btnContainer.querySelector("input") as HTMLInputElement;
      let btnError = btnContainer.nextElementSibling as HTMLParagraphElement;
      if (!btn.checked) {

        btnError.style.display = "block";
        btn.classList.add("error");
        valid = false;

      } else {

        btnError.style.display = "none";
        btn.classList.remove("error");

      }
    });

    // Check If It's Valid
    if (!valid) {
      e.preventDefault();
    }
  });
}
