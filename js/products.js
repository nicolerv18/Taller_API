const  urlCars= "http://localhost:3000/products";
//Formulario
function formularioEdit(item = null){
    const modal = document.getElementById("modal");
    modal.innerHTML ="";

    modal.innerHTML = `
        <div class="modal">
        <div class="modal-content">
        <h3>Formulario de edición</h3>
        <input type="hidden" id="idCar" value="${item ? item.id: ""}">
        <label>Título del producto:</label>
        <input type="text" id="carTitle" value="${item ? item.title: "" }">
        <br>
        <label>Precio del producto:</label>
        <input type="number" id="carPrice" value="${item ? item.price: ""}">
        <br>
        <label>URL de la imagen:</label>
        <input type="text" id="carImage" value="${ item ? item.thumbnail: ""}">
        <br>
        <button type="button" class="btn btn-success" onclick="${item ? 'updateCars()' : 'getAddCars()'}">
            ${item ? "Actualizar" : "Crear"}
        </button>
        <button class="btn btn-danger" onclick="closeModal()">Cancelar</button>
        </div>
        </div>
        `;

}

async function cardLoad(data, editF, deleteF) {
const cars =document.getElementById("data");
cars.innerHTML = "";
    data.forEach(item => {
        if (!item) return;
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
        <img src="${item.thumbnail}" alt="${item.title}" width="150">
        <h3>${item.title}</h3>
        <p>$${item.price}</p>
        <button class="btn btn-success">Editar</button>
        <button class="btn btn-success">Eliminar</button>
    `;
        
        const editBtn = card.querySelector(".btn:nth-of-type(1)");
        const deleteBtn = card.querySelector(".btn:nth-of-type(2)");
        
        if (editF) editBtn.addEventListener("click", () => editF(item));
        if (deleteF) deleteBtn.addEventListener("click", () => deleteF(item.id));
        
        cars.appendChild(card);
    });

}
//CRUD Cars
//Create
async function getFindByIdCars() {
    const idFilter = document.getElementById("idFilter").value;
    if (!idFilter) {
        return console.log("No se econtro");
    }
    let data = await request(`${urlCars}/${idFilter}`);
    if (!data) {
        document.getElementById("data").innerHTML = "<p>No encontrado</p>";
        return;
    }
    cardLoad([data],formularioEdit, deleteCars)

    
}
async  function getAddCars(){
    const item = {
        title: document.getElementById("carTitle").value,
        price: document.getElementById("carPrice").value,
        thumbnail: document.getElementById("carImage").value
    };
    await getAllCars();
    closeModal();

    let data = await request(urlCars, "POST", item);
    console.log(data);

}
//Read
async function getAllCars(){
    let data = await request(urlCars);
    console.log(data);
    console.log("se ejecuto god");
    cardLoad(data, formularioEdit, deleteCars);

    
}

//Update
async function updateCars() {
    const id = document.getElementById("idCar").value;
    const item = {
        title: document.getElementById("carTitle").value,
        price: document.getElementById("carPrice").value,
        thumbnail: document.getElementById("carImage").value
    };
    let data = await request(`${urlCars}/${id}`, "PUT", item);
    console.log(data);
    await getAllCars();
    closeModal();
}

//Delete
async function deleteCars(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        return;
    }
    let data = await  request(`${urlCars}/${id}`, "DELETE" );
    console.log(data);
    await getAllCars();
}
