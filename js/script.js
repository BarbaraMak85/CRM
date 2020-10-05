let allCategories = document.querySelectorAll("[data-view]");
for (let category of allCategories) {
    category.addEventListener("click", showCategory);
}
console.log(allCategories);

function showCategory() {
    const panelSections = document.querySelectorAll(".section_panel");
    let box = document.getElementById("box");
    box.style.display = "none";

    for (let section of panelSections) {
        section.style.display = "none";
    }

    btnBack.style.display = "block";

    document.querySelector(`#${this.dataset.view}`).style.display = "block";
}

const customerChoice = document.querySelector('select[name="customer_type"]');
customerChoice.addEventListener("change", choiceCustomers);

function choiceCustomers() {
    const inputs = document.querySelectorAll("[data-customer-type]");
    for (let input of inputs) {
        input.style.display = "none";
    }

    const showedInputs = document.querySelectorAll(
        `[data-customer-type="${this.value}"]`
    );

    for (let showInput of showedInputs) {
        showInput.style.display = "inline-block";
    }

    console.log(this.value);
}

const addButton = document.querySelector("#button-add-customer");
addButton.addEventListener("click", addCustomers);

function addCustomers(e) {
    e.preventDefault();
    const inputs = document.querySelectorAll("#create_customer input");
    let selectValue = customerChoice.value;
    let check = true;
    const errors = document.querySelector("#customer_errors");
    errors.innerHTML = "";

    for (let input of inputs) {
        if (input.name == "customer_name" && selectValue == "human") {
            const lengthInput = checkLenght(input.value, 3);
            const checkInput = checkLetter(input.value);
            if (lengthInput == false || checkInput == false) {
                check = false;
                const error = document.createElement("p");
                error.innerHTML = "Imię podać minimuum 3 znaki!";
                errors.appendChild(error);
            }
        } else if (input.name == "customer_lastname" && selectValue == "human") {
            const lengthInput = checkLenght(input.value, 3);
            const checkInput = checkLetter(input.value);
            if (lengthInput == false || checkInput == false) {
                check = false;
                const error = document.createElement("p");
                error.innerHTML = "Nazwisko podać minimuum 3 znaki!";
                errors.appendChild(error);
            }
        } else if (input.name == "customer_company" && selectValue == "company") {
            const lengthInput = checkLenght(input.value, 3);
            if (lengthInput == false) {
                check = false;
                const error = document.createElement("p");
                error.innerHTML = "Nazwa firmy musi mieć minimuum 3 znaki!";
                errors.appendChild(error);
            }
        } else if (input.name == "customers_adres") {
            const lengthInput = checkLenght(input.value, 3);
            if (lengthInput == false) {
                check = false;
                const error = document.createElement("p");
                error.innerHTML = "Adres musi mieć minimuum 3 znaki!";
                errors.appendChild(error);
            }
            console.log(check);
        } else if (input.name == "customer_nip" && selectValue == "company") {
            const lengthInput = checkLenght(input.value, 10);
            if (lengthInput == false) {
                const error = document.createElement("p");
                error.innerHTML = "Podany numer NIP jest nieprawidłowy!";
                errors.appendChild(error);
            }
            const checkNip = checkNumber(input.value);
            if (lengthInput == false || checkNip == false) {
                check = false;
            }
        }
    }

    let checkCustomers = localStorage.getItem("customer");
    checkCustomers = JSON.parse(checkCustomers);
    if (!checkCustomers) {
        checkCustomers = [];
    }

    const doubleElement = checkCustomers.filter(function(item, index, array) {
        return (
            (item.name == document.querySelector('[name="customer_name"]').value &&
                item.surname ==
                document.querySelector('[name="customer_lastname"]').value &&
                item.customerType == "human") ||
            (item.nip == document.querySelector('[name="customer_nip"]').value &&
                item.customerType == "company")
        );
    });

    if (doubleElement.length > 0) {
        return false;
    }

    if (check == false) {
        return false;
    }

    let customer = {
        name: document.querySelector('[name="customer_name"]').value,
        surname: document.querySelector('[name="customer_lastname"]').value,
        company: document.querySelector('[name="customer_company"]').value,
        adres: document.querySelector('[name="customers_adres"]').value,
        nip: document.querySelector('[name="customer_nip"]').value,
        info: document.querySelector('[name="adition_info"]').value,
        customerType: document.querySelector('[name="customer_type"]').value,
    };
    let customerAdd = localStorage.getItem("customer");

    if (customerAdd == null || customerAdd == "[]") {
        customer.id = 1;
        customerAdd = [customer];
        customerAdd = JSON.stringify(customerAdd);
        localStorage.setItem("customer", customerAdd);
        console.log(localStorage.getItem("customer"));
    } else {
        customerAdd = JSON.parse(customerAdd);
        customer.id = parseInt(customerAdd[customerAdd.length - 1].id) + 1;
        customerAdd.push(customer);
        customerAdd = JSON.stringify(customerAdd);
        localStorage.setItem("customer", customerAdd);
    }

    for (let input of inputs) {
        input.value = "";
    }

    document.querySelector('[name="adition_info"]').value = "";

    displayCustomers();
}

function displayCustomers() {
    let orderCustomerList = document.querySelector("#order_customers_list");
    let listCustomers = document.querySelector("#customersList");
    let lists = localStorage.getItem("customer");
    if (lists === null) {
        return true;
    }

    listCustomers.innerHTML = "";
    orderCustomerList.innerHTML = "";

    lists = JSON.parse(lists);
    for (let i = 0; i < lists.length; i++) {
        li = document.createElement("li");
        li.classList.add("customer_list");
        li.dataset.customer_id = lists[i].id;

        const option = document.createElement("option");
        option.value = i;

        if (lists[i].customerType == "human") {
            li.innerHTML = `Imię i nazwisko: ${lists[i].name} ${lists[i].surname} adres: ${lists[i].adres} dane dodatkowe: ${lists[i].info}`;
            option.innerHTML = `Imię i nazwisko: ${lists[i].name} ${lists[i].surname}`;
        } else {
            li.innerHTML = `Nazwa firmy: ${lists[i].company} adres:${lists[i].adres} NIP: ${lists[i].nip} dane dodaktkowe: ${lists[i].info}`;
            option.innerHTML = `Nazwa firmy: ${lists[i].company}`;
        }

        orderCustomerList.appendChild(option);

        const buttonsWrapper = document.createElement("div");

        const elementDelete = document.createElement("button");
        elementDelete.innerHTML = "usuń";
        elementDelete.addEventListener("click", deleteButton);
        buttonsWrapper.appendChild(elementDelete);

        elementDelete.dataset.delete_id = i;

        const buttonEdit = document.createElement("button");
        buttonEdit.innerHTML = "edytuj";
        buttonEdit.addEventListener("click", editElement);
        buttonsWrapper.appendChild(buttonEdit);

        li.appendChild(buttonsWrapper);

        buttonEdit.dataset.edit_id = i;
        listCustomers.appendChild(li);
    }
}

function deleteButton() {
    let customerRemove = localStorage.getItem("customer");
    customerRemove = JSON.parse(customerRemove);
    const customerElement = this.dataset.delete_id;
    customerRemove = customerRemove.filter(function(item, index, array) {
        return customerElement != index;
    });
    customerRemove = JSON.stringify(customerRemove);
    localStorage.setItem("customer", customerRemove);

    this.parentNode.parentNode.remove();
}

function editElement() {
    let lists = localStorage.getItem("customer");

    lists = JSON.parse(lists);

    const elementDataset = parseInt(this.dataset.edit_id);

    const items = document.querySelectorAll("[data-customer-type");
    for (item of items) {
        item.style.display = "none";
    }

    const showedInputs = document.querySelectorAll(
        `[data-customer-type="${lists[elementDataset].customerType}"]`
    );

    for (let showInput of showedInputs) {
        showInput.style.display = "inline-block";
    }

    document.querySelector('select[name="customer_type"]').value =
        lists[elementDataset].customerType;

    if (lists[elementDataset].customerType == "human") {
        document.querySelector('[name="customer_name"]').value =
            lists[elementDataset].name;
        document.querySelector('[name="customer_lastname"]').value =
            lists[elementDataset].surname;
    } else {
        document.querySelector('[name="customer_company"]').value =
            lists[elementDataset].company;
        document.querySelector('[name="customer_nip"]').value =
            lists[elementDataset].nip;
    }

    document.querySelector('[name="customers_adres"]').value =
        lists[elementDataset].adres;
    document.querySelector('[name="adition_info"]').value =
        lists[elementDataset].info;
}

displayCustomers();

const addButtonProducts = document.getElementById("button-add-products");
addButtonProducts.addEventListener("click", addProducts);

function addProducts(e) {
    const inputs = document.querySelectorAll("[data-products]");
    check = false;
    const errorProduct = document.querySelector("#product_errors");
    errorProduct.innerHTML = "";

    for (let input of inputs) {
        if (input.name == "product_name") {
            const lengthInput = checkLenght(input.value, 3);
            const checkInput = checkLetter(input.value);
            if (lengthInput == false || checkInput == false) {
                check = true;
                const error = document.createElement("p");
                error.innerHTML = " Nazwa musi zaweirać same litery";
                errorProduct.appendChild(error);
            }
        } else if (input.name == "barcode_name") {
            const lengthInput = checkLenght(input.value, 3);
            const checkInput = checkLetter(input.value);
            if (lengthInput == false || checkInput == false) {
                check = true;
                const error = document.createElement("p");
                error.innerHTML = " Barcode musi zaweirać same litery";
                errorProduct.appendChild(error);
            }
        }
    }

    if (check == true) {
        return console.log("error");
    }

    let products = {
        name: document.querySelector('[name="product_name"]').value,
        quantity: document.querySelector('[name="quantity_product"]').value,
        barcode: document.querySelector('[name="barcode_name"]').value,
    };

    let productsAdd = localStorage.getItem("products");

    if (productsAdd == null) {
        productsAdd = [products];
    } else {
        productsAdd = JSON.parse(productsAdd);
        productsAdd.push(products);
    }

    productsAdd = JSON.stringify(productsAdd);
    localStorage.setItem("products", productsAdd);

    for (let input of inputs) {
        input.value = "";
    }

    displayProducts();
}

function displayProducts() {
    const selectOrder = document.querySelector("#order_products_list");
    let listProducts = document.querySelector("#productsList");
    let lists = localStorage.getItem("products");
    if (lists == null) {
        return true;
    }

    listProducts.innerHTML = "";
    selectOrder.innerHTML = "";

    lists = JSON.parse(lists);
    for (let i = 0; i < lists.length; i++) {
        li = document.createElement("li");
        li.classList.add("product_li");
        li.innerHTML = `Nazwa towaru: ${lists[i].name} Ilość sztuk: ${lists[i].quantity} Numer barcodu: ${lists[i].barcode} `;
        listProducts.appendChild(li);

        const option = document.createElement("option");
        option.value = i;
        option.innerHTML = `Nazwa towaru: ${lists[i].name}`;
        selectOrder.appendChild(option);

        const elementDeleteProduct = document.createElement("button");
        elementDeleteProduct.classList.add("btn_delete");
        elementDeleteProduct.innerHTML = "usuń";
        elementDeleteProduct.addEventListener("click", deleteButtonProducts);
        li.appendChild(elementDeleteProduct);

        elementDeleteProduct.dataset.delete_id = i;

        const buttonEditProduct = document.createElement("button");
        buttonEditProduct.classList.add("btn_edit");
        buttonEditProduct.innerHTML = "edytuj";
        buttonEditProduct.addEventListener("click", elementEditButton);
        buttonEditProduct.dataset.edit_id = i;
        li.appendChild(buttonEditProduct);
    }
}

function deleteButtonProducts() {
    let productRemove = localStorage.getItem("products");
    productRemove = JSON.parse(productRemove);
    const productElement = this.dataset.delete_id;

    productRemove = productRemove.filter(function(item, index, array) {
        console.log(productElement);
        console.log(index);
        return productElement != index;
    });
    productRemove = JSON.stringify(productRemove);
    localStorage.setItem("products", productRemove);

    this.parentNode.remove();

    let buttonDelete = document.querySelectorAll("[data-delete_id]");
    for (let i = 0; i < buttonDelete.length; i++) {
        buttonDelete[i].dataset.delete_id = i;
    }
}

function elementEditButton() {
    let productEdit = localStorage.getItem("products");
    productEdit = JSON.parse(productEdit);
    let id = this.dataset.edit_id;
    let product = productEdit[id];
    console.log(product);
    document.querySelector('[name="product_name"]').value = product.name;
    document.querySelector('[name="quantity_product"]').value = product.quantity;
    document.querySelector('[name="barcode_name"]').value = product.barcode;
}

displayProducts();

const quantityButton = document.getElementById("quantity_number");
quantityButton.addEventListener("click", quantityAdd);

function quantityAdd() {
    const selectOrder = document.querySelector("#order_products_list").value;
    console.log(selectOrder);
    let lists = localStorage.getItem("products");
    lists = JSON.parse(lists);
    const valueSelectOrder = lists.filter(function(item, index, array) {
        return index == selectOrder;
    });

    let orderCustomerList = document.querySelector("#order_customers_list").value;
    let listsCustomers = localStorage.getItem("customer");

    listsCustomers = JSON.parse(listsCustomers);

    listsCustomers = listsCustomers.filter(function(item, index, array) {
        return index == orderCustomerList;
    });

    console.log(listsCustomers);

    let indexQuantity = valueSelectOrder[0].quantity;
    const quantityOrder = document.getElementById("number_order").value;

    if (quantityOrder > indexQuantity) {
        return alert("ilość zamówionych towarów przekaracza stan magazyu");
    }
    let customerOrderList = {
        product_name: valueSelectOrder[0].name,
        quantity: quantityOrder,
    };

    let orders = localStorage.getItem("orders");

    if (orders == null) {
        orders = [];
    } else {
        orders = JSON.parse(orders);
    }

    orders.push(customerOrderList);
    orders = JSON.stringify(orders);
    localStorage.setItem("orders", orders);

    let quantity = document.getElementById("number_order");
    quantity.value = "";

    displayOrders();
}

function displayOrders() {
    let orders = localStorage.getItem("orders");
    if (orders == null) {
        return orders;
    }

    orders = JSON.parse(orders);

    let ordersList = document.getElementById("ordersList");

    for (let i = 0; i < orders.length; i++) {
        let liList = document.createElement("li");
        li.classList.add("orderList");
        ordersList.appendChild(liList);
        liList.innerHTML = `Nazwa produktu: ${orders[i].product_name} ilość produktu : ${orders[i].quantity}`;
    }
}

const btnBack = document.getElementById("btnBack");
btnBack.addEventListener("click", backButton);

function backButton() {
    const panelSections = document.querySelectorAll(".section_panel");
    for (let i = 0; i < panelSections.length; i++) {
        panelSections[i].style.display = "none";
    }
    btnBack.style.display = "none";
    const boxes = document.getElementById("box");
    boxes.style.display = "grid";
}

function checkLenght(text, minLenght) {
    if (text.length >= minLenght) {
        return true;
    }
    return false;
}

function checkLetter(text) {
    if (/^[a-zA-Z]+$/.test(text)) {
        return true;
    }
    return false;
}

function checkNumber(number) {
    number = parseInt(number);
    if (Number.isInteger(number)) {
        return true;
    }
    return false;
}