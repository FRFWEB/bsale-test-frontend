# BSALE-FRONTEND

Tecnologías de uso **HTML**, **CSS**, **JAVSCIRPT**, **BOOTSTRAP 5**

el proyecto solo consta de 2 archivos .html

1. index.html
2. 404.html

Este FrontEnd, fue diseñado con la intención de simular una SPA, pero no es SPA, sigue en concepto de tener una hoja principal capaz de manejar diferentes rutas, por lo cual esta preparada para [bsale-backend](https://github.com/FRFWEB/bsale-test-backend)

En la carpeta **utils** el archivo **function.js** esta toda la lógica y el archivo **app.js** realiza el manejo de las rutas asi mismo que esta encargado de que mostrar o no mostrar al usuario

Las funciones disponibles para su uso son las siguientes

- **getApiUrl()** - Obtiene la URL de API-REST
- **getUrl()** - Obtiene la URL Actual del sitio

- **getUrlDomainOrigin()** - Obtiene el nombre de dominio

- **fetchData($url)** - Realizar peticiones fetch, recibe como parametro la url

- **getStatusLocalStorage(name)** - Evalua el localstorage. recibe como parametro el nombre del localstorage

- **loadingContent(loadingId)** - Evalua la carga del sitio, recibe como parametro el contenedor de la animacion cual es este caso es **"bsale_loading"**
- **enableMenuScrollFixed(menuId)** - Convierte en menu en un menu pegadizo al momento de hacer scroll, recibe como parametro el id del menu, en este caso es **"bsale_header"**
- **whishlistPanel(apiUrl, localstorageName, output)** - encarga de habilitar el panel para la lista de favoritos, recibe como parametro la **url de la api**, **el localstorage de la lista cual por defecto es "whish"** y **el output que por defecto es el contenedor de productos "bsale_test_products"**
- **loadAllCategories(menuListID, apiUrl, urlDomain)** - se encarga de cargar todas las categorias y colocarlo en el menu, sus parametros son el el id de la lista cual por defecto es **"bsale_menu_items"**, **la url de la api** y **la url del dominio** para crear los hrefs correspondientes
- **cartPanel(cartId, cartShowListId, localStorageName)** - se encarga de habilitar el panel o micro ventana del carro de compras, sus parametros son el id del boton del carro que por defecto es "bsale_cart_button", el id para mostrar la micro ventana con los productos agregador que por defecto es **"bsale_cart_items_list"** y el localstorage que por defecto es **"cart"**
- **productList(ouputContent, url, category, whishlist)** - este se encarga de mostrar todos los productos existentes, este puede variar de acuerdo a los parametros, recibe como parametro el output del contendio que por defecto es **bsale_test_products**, la url de api y se establece a quien va dirigiado, si va la lista va dirigiado a la lista de favoritos **coloque whislist en true y category en null** en caso contrario cual seria mostrar los productos por categoria seria **category true y whislist en null** pero si no desea usar ninguno de los dos solo **coloca ambos en null** y genera todos los productos

- **addItemToLocalStorage(getButton, nameStorage)** - este funciona para lista de favoritos (whislist) y para el carrito de compras (cart), de acuerdo a la opcion seleccionada este guarda la informacion en cart o whislish, como parametro recibe el button id o selector y la nombre del localstorage

- **deleteItemsCart(nameStorage)** - elimina el producto agregado al carrito, recibe como parametro el nombre de localstorage cual por defecto es **"cart"**
