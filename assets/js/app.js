//LOADING
window.addEventListener("load", () => {
  let getLoading = document.getElementById("bsale_loading");
  setTimeout(() => {
    getLoading.style.opacity = 0;
    setTimeout(() => {
      getLoading.remove();
    }, 1000);
  }, 7000);
});

//DETECT SCROLL AND FIX MENU
window.addEventListener("scroll", (e) => {
  let getHeaderDocument = document.getElementById("bsale_header");
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

//SHOW ALL PRODUCTS ENABLE WHISHLIST AND CART
let getContainerProducts = document.getElementById("bsale_test_products");
productList(
  getContainerProducts,
  `http://localhost:300/api/products`,
  null,
  false
);
whishlistPanel();
cartPanel();

//SHOW ALL CATEGORYS
let getMenuPanel = document.getElementById("bsale_menu_items");
fetchData("http://localhost:300/api/category").then((data) => {
  getMenuPanel.innerHTML += `<li><a href="#All">Todos los Productos</a><li>`;
  for (const category of data) {
    let assignCategoryValue = category.name.replaceAll(" ", "_");
    getMenuPanel.innerHTML += `<li><a href="#${assignCategoryValue}">${category.name}</a><li>`;
  }
  //SHOW BY CATEGORY
  let getItemMenu = getMenuPanel.querySelectorAll("a");
  for (const item of getItemMenu) {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      let getCategoryName = e.target.hash.replace("#", "");
      if (getCategoryName != "All") {
        //SEACRCH BY CATEGORY
        fetchData(`http://localhost:300/api/category/${getCategoryName}`).then(
          (data) => {
            for (const getCategory of data) {
              productList(
                getContainerProducts,
                `http://localhost:300/api/products`,
                getCategory.id,
                false
              );
            }
          }
        );
      } else {
        productList(
          getContainerProducts,
          `http://localhost:300/api/products/`,
          null,
          false
        );
      }
    });
  }
});

//GET NAME PRODUCT
let getForm = document.forms.namedItem("bsale_search");
getForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let getNameProduct = getForm.elements.namedItem("bsale_product_name").value;
  if (getNameProduct != "") {
    let cleanName = getNameProduct.trimEnd().replaceAll(" ", "_").toUpperCase();
    productList(
      getContainerProducts,
      `http://localhost:300/api/product/${cleanName}`,
      null,
      false
    );
  } else {
    productList(
      getContainerProducts,
      `http://localhost:300/api/products/`,
      null,
      false
    );
  }
});

function whishlistPanel() {
  let getWhishListButton = document.getElementById("bsale_wishlist_button");
  getWhishListButton.addEventListener("click", () => {
    if (getStatusLocalStorage("whishlist") != null) {
      productList(
        getContainerProducts,
        `http://localhost:300/api/product/findIn/${getStatusLocalStorage(
          "whishlist"
        )}`,
        null,
        true
      );
    }
    console.log("click");
  });
}

//CART
let cartPanelControl = false;
function cartPanel() {
  let getCartButton = document.getElementById("bsale_cart_button");
  getCartButton.addEventListener("click", () => {
    let getPanelCart = document.getElementById("bsale_cart_items_list");
    if (getCartButton.classList.contains("bsale-cart-disabled")) {
      let getCartItems = JSON.parse(getStatusLocalStorage("cart"));
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
        getPanelCart.innerHTML += `
        <div class="bsale-cart-panel" >
          <div class="bsale-cart-items" >
            ${prepareAddItem.join("\n")}
          </div>
        </div>
      `;
        deleteItemsCart("cart");
        getCartButton.classList.remove("bsale-cart-disabled");
      } else {
        getPanelCart.innerHTML = getPanelCart.innerHTML += `
        <div class="bsale-cart-panel" >
          <div class="bsale-cart-items" >
            <p class="my-auto text-white h-100 d-flex align-items-center justify-content-center">NO HAY PRODUCTOS</p>
          </div>
        </div>
        `;
      }
    } else {
      getPanelCart.innerHTML = "";
      getCartButton.classList.add("bsale-cart-disabled");
    }
  });
}

//ALL FUNCTIONS

function productList(ouputContent, url, category, whishlist) {
  ouputContent.innerHTML = "loading";
  fetchData(url).then((data) => {
    ouputContent.innerHTML = "";
    for (const product of data) {
      //GET DISCOUNT VALUE IF MAYOR TO 0
      let getDiscount =
        product.discount != 0 ? `<p> ${product.discount}% </p>` : "";
      if (product.url_image != null && product.url_image != "") {
        if (category != null) {
          //SHOW ALL PRODUCTS CATEGORY true
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
                      <p class="card-text">${product.price} $</p>
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
          //SHOW ALL PRODUCTS CATEGORY TRUE
          ouputContent.innerHTML += `
             <div class="col-md-4 col-lg-3">
              <div class="card mt-4">
                <img
                  src="${product.url_image}"
                  alt="${product.name}"
                />
                <div class="card-body">
                  <h5 class="card-title">${product.name}</h5>
                  <p class="card-text">${product.price} $</p>
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
          //SHOW ALL PRODUCTS CATEGORY TRUE
          ouputContent.innerHTML += `
             <div class="col-md-4 col-lg-3">
              <div class="card mt-4">
                <img
                  src="${product.url_image}"
                  alt="${product.name}"
                />
                <div class="card-body">
                  <h5 class="card-title">${product.name}</h5>
                  <p class="card-text">${product.price} $</p>
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

async function fetchData($url) {
  let response = await fetch($url);
  let data = await response.json();
  return data;
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

function getStatusLocalStorage(name) {
  return localStorage.getItem(name);
}
