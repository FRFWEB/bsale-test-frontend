window.addEventListener("load", () => {
  let getLoading = document.getElementById("bsale_loading");
  getLoading.style.opacity = 0;
  setTimeout(() => {
    getLoading.remove();
  }, 300);

  window.addEventListener("scroll", (e) => {
    let getHeaderDocument = document.getElementById("bsale_header");
    if (document.documentElement.scrollTop > 100) {
      if (!getHeaderDocument.classList.contains("bsale-menu-flixed")) {
        getHeaderDocument.classList.add("bsale-menu-flixed");
      }
    }
    if (document.documentElement.scrollTop < 100) {
      if (getHeaderDocument.classList.contains("bsale-menu-flixed")) {
        getHeaderDocument.classList.remove("bsale-menu-flixed");
      }
    }
  });

  //SHOW ALL PRODUCTS
  let getContainerProducts = document.getElementById("bsale_test_products");
  productList(getContainerProducts, `http://localhost:300/api/products`, null);

  //SHOW ALL CATEGORYS
  let getMenuPanel = document.getElementById("bsale_menu_items");
  fetchData("http://localhost:300/api/category").then((data) => {
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

        //SEACRCH BY CATEGORY
        fetchData(`http://localhost:300/api/category/${getCategoryName}`).then(
          (data) => {
            for (const getCategory of data) {
              productList(
                getContainerProducts,
                `http://localhost:300/api/products`,
                getCategory.id
              );
            }
          }
        );
      });
    }
  });

  //GET NAME PRODUCT
  let getForm = document.forms.namedItem("bsale_search");
  getForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(getForm.elements);
    let getNameProduct = getForm.elements.namedItem("bsale_product_name").value;
    let cleanName = getNameProduct.trimEnd().replaceAll(" ", "_").toUpperCase();
    productList(
      getContainerProducts,
      `http://localhost:300/api/product/${cleanName}`,
      null
    );
  });

  function productList(ouputContent, url, category) {
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
                 <div class="col-md-2">
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
                      <button class="btn btn-outline-secondary btn-lg" value="${product.id}">
                        <i class="fa fa-cart-plus" aria-hidden="true"></i>
                      </button>
                      <button class="btn btn-outline-secondary btn-lg" value="${product.id}">
                        <i class="fa fa-gratipay" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                </div>`;
            }
          } else {
            //SHOW ALL PRODUCTS CATEGORY TRUE
            ouputContent.innerHTML += `
             <div class="col-md-2">
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
                  <button class="btn btn-outline-secondary btn-lg" value="${product.id}">
                    <i class="fa fa-cart-plus" aria-hidden="true"></i>
                  </button>
                  <button class="btn btn-outline-secondary btn-lg" value="${product.id}">
                    <i class="fa fa-gratipay" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>`;
          }
        }
      }
    });
  }
  async function fetchData($url) {
    let response = await fetch($url);
    let data = await response.json();
    return data;
  }
});
