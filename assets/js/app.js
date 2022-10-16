//IMPORT UTILS
import {
  getApiUrl,
  getUrl,
  productList,
  loadingContent,
  enableMenuScrollFixed,
  loadAllCategories,
  whishlistPanel,
  cartPanel,
  getUrlDomainOrigin,
  fetchData,
} from "./utils/functions.js";

//GLOBAL VARIABLES
let urlAPI = getApiUrl();
let url = getUrl();
let urlPath = getUrlDomainOrigin().pathname;

//ENABLE LOADING
loadingContent("#bsale_loading");

//ENABLE MENU SCROLL FIXED
enableMenuScrollFixed("#bsale_header");

//ENABLE CART PANEL
cartPanel("#bsale_cart_button", "#bsale_cart_items_list", "cart");

//LOAD ALL CATEGORYS
loadAllCategories("#bsale_menu_items", urlAPI, url);

//GET CONTAINER PRODUCTS
let getContainerProducts = document.getElementById("bsale_test_products");
getContainerProducts.innerHTML =
  '<div class="bsale-loading-products">LOADING</div>';

//EVALUATE LINK OF SITE
if (urlPath == "/") {
  //ENABLE INDEX SECTION
  productList(getContainerProducts, `${urlAPI}/products`, null, false);
} else if (urlPath.split("/")[1] == "search") {
  //ENABLE SEARCH SECTION
  let getNameProduct = getUrlDomainOrigin().search.split("=")[1];
  getContainerProducts.innerHTML =
    '<div class="bsale-loading-products">LOADING</div>';
  if (getNameProduct != "") {
    let cleanName = getNameProduct.trimEnd().replaceAll(" ", "_").toUpperCase();
    productList(
      getContainerProducts,
      `${urlAPI}/product/${cleanName}`,
      null,
      false
    );
  }
} else if (urlPath.split("/")[1] == "category") {
  //ENABLE CATEGORY SECTION
  let getCategoryName = urlPath.split("/")[2];
  fetchData(`${urlAPI}/category/${getCategoryName}`).then((data) => {
    for (const getCategory of data) {
      productList(
        getContainerProducts,
        `${urlAPI}/products`,
        getCategory.id,
        false
      );
    }
  });
} else if (urlPath.split("/")[1] == "whishlist") {
  //ENABLE WHISLIST SECTION
  whishlistPanel(urlAPI, "whishlist", getContainerProducts);
}
