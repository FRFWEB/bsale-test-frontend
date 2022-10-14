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
  getContainerProducts.innerHTML = "";
  fetchData("http://localhost:300/api/products").then((data) => {
    for (const product of data) {
      //GET DISCOUNT VALUE IF MAYOR TO 0
      let getDiscount =
        product.discount != 0 ? `<p> ${product.discount}% </p>` : "";
      if (product.url_image != null && product.url_image != "") {
        //SHOW ALL PRODUCTS
        getContainerProducts.innerHTML += `
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
  });

  //SHOW ALL CATEGORYS
  let getMenuPanel = document.getElementById("bsale_menu_items");
  fetchData("http://localhost:300/api/category").then((data) => {
    for (const category of data) {
      getMenuPanel.innerHTML += `<li><a href="#${category.name.replaceAll(
        " ",
        "_"
      )}">${category.name}</a><li>`;
    }
    //SHOW BY CATEGORY
    let getItemMenu = getMenuPanel.querySelectorAll("a");
    for (const item of getItemMenu) {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        let getCategoryName = e.target.hash.replace("#", "");
        console.log(getCategoryName);
      });
    }
  });

  async function fetchData($url) {
    let response = await fetch($url);
    let data = await response.json();
    return data;
  }
});
