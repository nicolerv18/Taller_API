const urlCarts = "http://localhost:3000/carts";

async function cartTable(data, updateF, deleteF) {
    const container = document.getElementById("data");
    container.innerHTML = "";

    const table = document.createElement("table");
    table.className = "tabla";

    table.innerHTML = `
        <thead>
            <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Eliminar</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    data.forEach(item => {
        if (!item) return;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td style="display:flex; align-items:center; gap:10px;">
                <img src="${item.thumbnail}" width="50">
                <span>${item.title}</span>
            </td>

            <td>$${item.price}</td>

            <td>
                <div class="qty-control">
                    <button class="btn-minus">-</button>
                    <span class="qty">${item.quantity}</span>
                    <button class="btn-plus">+</button>
                </div>
            </td>

            <td>$${(item.price * item.quantity).toFixed(2)}</td>

            <td>
                <button class="btn btn-danger">X</button>
            </td>
        `;

        const minusBtn = row.querySelector(".btn-minus");
        const plusBtn = row.querySelector(".btn-plus");
        const deleteBtn = row.querySelector(".btn-danger");

        plusBtn.addEventListener("click", async () => {
            let newQty = item.quantity + 1;
            await updateF(item.id, newQty);
        });

        minusBtn.addEventListener("click", async () => {
            if (item.quantity > 1) {
                let newQty = item.quantity - 1;
                await updateF(item.id, newQty);
            }
        });
        deleteBtn.addEventListener("click", () => {
            deleteF(item.id);
        });

        tbody.appendChild(row);
    });

    container.appendChild(table);
}
// CRUD
//id
async function getFindByIdCarts() {
    const idFilter = document.getElementById("idFilter").value;
    if (!idFilter) {
        return console.log("No se econtro");
    }
    let data = await request(`${urlCarts}/${idFilter}`);
    if (!data) {
        document.getElementById("data").innerHTML = "<p>No encontrado</p>";
        return;
    }
    cartTable(data.products, updateCarts, deleteCarts)

    
}
//GET
async function getAllCarts() {
    let data = await request(urlCarts);
    let allCarts= [];
    data.forEach( cart =>{
        allCarts = allCarts.concat(cart.products);

    });
    
    cartTable(allCarts, updateCarts, deleteCarts);
}

//  UPDATE
async function updateCarts(id, quantity) {
    const item = {
        quantity: quantity
    };

    await request(`${urlCarts}/${id}`, "PUT", item);
    await getAllCarts();
}

// DELETE
async function deleteCarts(id) {
    if (!confirm("¿Eliminar producto?")) return;

    await request(`${urlCarts}/${id}`, "DELETE");
    await getAllCarts();
}