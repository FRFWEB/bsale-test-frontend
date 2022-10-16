function getApiUrl() {
  return window.location.origin + "/api";
}

function getUrl() {
  return window.location.origin;
}

function getUrlDomainOrigin() {
  return window.location;
}

async function fetchData($url) {
  let response = await fetch($url);
  let data = await response.json();
  return data;
}

//EVALUATE STATUS OF LOCALSOTRAGE FOR CART AND WHISLIST
function getStatusLocalStorage(name) {
  return localStorage.getItem(name);
}

function loadingContent(loadingId) {
  window.addEventListener("load", () => {
    let getLoading = document.querySelector(loadingId);
    setTimeout(() => {
      getLoading.style.opacity = 0;
      setTimeout(() => {
        getLoading.remove();
      }, 1000);
    }, 4000);
  });
}

function enableMenuScrollFixed(menuId) {
  //DETECT SCROLL AND FIX MENU
  window.addEventListener("scroll", (e) => {
    let getHeaderDocument = document.querySelector(menuId);
    if (document.documentElement.scrollTop > 50) {
      if (!getHeaderDocument.classList.contains("bsale-menu-flixed")) {
        getHeaderDocument.classList.add("bsale-menu-flixed");
      }
    }
    if (document.documentElement.scrollTop < 50) {
      if (getHeaderDocument.classList.contains("bsale-menu-flixed")) {
        getHeaderDocument.classList.remove("bsale-menu-flixed");
      }
    }
  });
}

function whishlistPanel(apiUrl, localstorageName, output) {
  if (getStatusLocalStorage(localstorageName) != null) {
    output.innerHTML = '<div class="bsale-loading-products">LOADING</div>';
    productList(
      output,
      `${apiUrl}/product/findIn/${getStatusLocalStorage(localstorageName)}`,
      null,
      true
    );
  }
}

function loadAllCategories(menuListID, apiUrl, urlDomain) {
  let getMenuPanel = document.querySelector(menuListID);
  fetchData(`${apiUrl}/category`).then((data) => {
    getMenuPanel.innerHTML += `<li><a href="${urlDomain}">Todos los Productos</a><li>`;
    for (const category of data) {
      let assignCategoryValue = category.name.replaceAll(" ", "_");
      getMenuPanel.innerHTML += `<li><a href="${urlDomain}/category/${assignCategoryValue}">${category.name}</a><li>`;
    }
  });
}

function cartPanel(cartId, cartShowListId, localStorageName) {
  let getCartButton = document.querySelector(cartId);
  getCartButton.addEventListener("click", () => {
    let getPanelCart = document.querySelector(cartShowListId);
    if (getCartButton.classList.contains("bsale-cart-disabled")) {
      let getCartItems = JSON.parse(getStatusLocalStorage(localStorageName));
      if (getCartItems != null) {
        getPanelCart.innerHTML = "";
        let prepareAddItem = [];
        for (let [index, item] of getCartItems.entries()) {
          prepareAddItem.push(
            `
              <div class="bsale-cart-item d-flex"> 
                <p class="my-auto">${item.product}</p>
                  <button class="btn btn-sm my-auto d-inline-block text-white btn-danger" id="bsale_cart_item_delete" value="${index}">x</button>
              </div>
                      `
          );
        }
        //SHOW ALL PRODUCT IN THE CART
        getPanelCart.innerHTML += `
          <div class="bsale-cart-panel" >
            <div class="bsale-cart-items" >
              ${prepareAddItem.join("\n")}
            </div>
          </div>
        `;
        //DELETE ITEM CART
        deleteItemsCart(localStorageName);
        getCartButton.classList.remove("bsale-cart-disabled");
      } else {
        getPanelCart.innerHTML = getPanelCart.innerHTML += `
          <div class="bsale-cart-panel" >
            <div class="bsale-cart-items" >
              <p class="my-auto text-white h-100 d-flex align-items-center justify-content-center">NO HAY PRODUCTOS</p>
            </div>
          </div>
          `;
        getCartButton.classList.remove("bsale-cart-disabled");
      }
    } else {
      getPanelCart.innerHTML = "";
      getCartButton.classList.add("bsale-cart-disabled");
    }
  });
}

function productList(ouputContent, url, category, whishlist) {
  fetchData(url).then((data) => {
    ouputContent.innerHTML = "";
    if (data.hasOwnProperty("message")) {
      ouputContent.innerHTML = `<div class="bsale-error fs-2">${data.message.replaceAll(
        "_",
        " "
      )}</div>`;
      return;
    }
    for (const product of data) {
      //GET DISCOUNT VALUE IF MAYOR TO 0
      let getDiscount =
        product.discount != 0 ? `<p> ${product.discount}% </p>` : "";
      if (product.url_image != null && product.url_image != "") {
        if (category != null) {
          //SHOW ALL CATEGORY PRODUCTS
          if (product.category == category) {
            ouputContent.innerHTML += `
                   <div class="col-md-4 col-lg-3">
                    <div class="card mt-4">
                      <img
                        src="${product.url_image}"
                        alt="${product.name}"
                      />
                      <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text fs-5 fw-bold">${product.price} $</p>
                      </div>
                      <div class="card-discount">
                        ${getDiscount}
                      </div>
                      <div class="card-body ms-auto">
                        <button class="btn btn-outline-secondary btn-lg" value="${product.name}_${product.id}" id="bsale_add_item_whislist">
                          <i class="fa fa-gratipay" aria-hidden="true"></i>
                        </button>
                        <button class="btn btn-outline-secondary btn-lg" value="${product.name}_${product.id}" id="bsale_add_item_cart">
                          <i class="fa fa-cart-plus" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  </div>`;
          }
        } else if (whishlist == true) {
          //SHOW ALL WHISHLIST PRODUCTS
          ouputContent.innerHTML += `
               <div class="col-md-4 col-lg-3">
                <div class="card mt-4">
                  <img
                    src="${product.url_image}"
                    alt="${product.name}"
                  />
                  <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text fs-5 fw-bold">${product.price} $</p>
                  </div>
                  <div class="card-discount">
                    ${getDiscount}
                  </div>
                  <div class="card-body ms-auto">
                    <button class="btn btn-outline-secondary btn-lg" value="${product.name}_${product.id}" id="bsale_add_item_cart">
                        <i class="fa fa-cart-plus" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>`;
        } else {
          //SHOW ALL PRODUCTS
          ouputContent.innerHTML += `
               <div class="col-md-4 col-lg-3">
                <div class="card mt-4">
                  <img
                    src="${product.url_image}"
                    alt="${product.name}"
                  />
                  <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text fs-5 fw-bold">${product.price} $</p>
                  </div>
                  <div class="card-discount">
                    ${getDiscount}
                  </div>
                  <div class="card-body ms-auto">
                    <button class="btn btn-outline-secondary btn-lg" value="${product.name}_${product.id}" id="bsale_add_item_whislist">
                        <i class="fa fa-gratipay" aria-hidden="true"></i>
                    </button>
                    <button class="btn btn-outline-secondary btn-lg" value="${product.name}_${product.id}" id="bsale_add_item_cart">
                        <i class="fa fa-cart-plus" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>`;
        }
      }
    }
    //EMABLE BUTTON CARS
    let getButtonAddITemCart = document.querySelectorAll(
      "#bsale_add_item_cart"
    );
    addItemToLocalStorage(getButtonAddITemCart, "cart");
    //EMABLE BUTTON WHISHLIST
    let getButtonAddITemWhislist = document.querySelectorAll(
      "#bsale_add_item_whislist"
    );
    addItemToLocalStorage(getButtonAddITemWhislist, "whishlist");
  });

  function addItemToLocalStorage(getButton, nameStorage) {
    getButton.forEach((button) => {
      button.addEventListener("click", () => {
        let preapreObj = {
          product: button.value.split("_")[0],
          productId: button.value.split("_")[1],
        };
        if (getStatusLocalStorage(nameStorage) != null) {
          let getListItems = JSON.parse(getStatusLocalStorage(nameStorage));
          getListItems.push(preapreObj);
          localStorage.setItem(nameStorage, JSON.stringify(getListItems));
        } else {
          localStorage.setItem(nameStorage, JSON.stringify([preapreObj]));
        }
      });
    });
  }
}

function deleteItemsCart(nameStorage) {
  let getButtonItemDelete = document.querySelectorAll(
    "#bsale_cart_item_delete"
  );
  getButtonItemDelete.forEach((buttonItemDelete) => {
    buttonItemDelete.addEventListener("click", () => {
      let getItems = JSON.parse(getStatusLocalStorage(nameStorage));
      delete getItems[buttonItemDelete.value];
      localStorage.setItem(
        nameStorage,
        JSON.stringify(getItems.filter((valueItems) => valueItems != null))
      );
    });
  });
}
export {
  getApiUrl,
  getUrl,
  fetchData,
  getStatusLocalStorage,
  loadingContent,
  enableMenuScrollFixed,
  whishlistPanel,
  productList,
  cartPanel,
  loadAllCategories,
  getUrlDomainOrigin,
};
