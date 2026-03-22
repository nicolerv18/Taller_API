const  urlUser= "http://localhost:3000/users"
//Formulario
function formularioEdit(user = null){
    const modal = document.getElementById("modal");
    modal.innerHTML ="";

    modal.innerHTML = `
        <div class="modal">
        <div class="modal-content">
        <h3>Formulario</h3>
        <input type="hidden" id="iduser" value="${user ? user.id: ""}">
        <label>Nombre </label>
        <input type="text" id="username" value="${user ? user.firstName: "" }">
        <br>
        <label>Apellido</label>
        <input type="text" id="userLastname" value="${user ? user.lastName: ""}">
        <br>
        <label>email:</label>
        <input type="text" id="email" value="${ user ? user.email: ""}">
        <br>
        <button type="button" class="btn btn-success" onclick="${user ? 'updateUser()' : 'getAddUser()'}">
            ${user ? "Actualizar" : "Crear"}
        </button>
        <button class="btn btn-danger" onclick="closeModal()">Cancelar</button>
        </div>
        </div>
        `;

}
async function createTable(data, editF, deleteF) {
    const container = document.getElementById("table");
    container.innerHTML = "";

    const table = document.createElement("table");
    table.className = "tabla";

    table.innerHTML = `
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Actualizar</th>
                <th>Eliminar</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    data.forEach(user => {
        if (!user) return;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td><button class="btn btn-success">Editar</button></td>
            <td><button class="btn btn-danger">Eliminar</button></td>
        `;

        const editBtn = row.querySelector(".btn-success");
        const deleteBtn = row.querySelector(".btn-danger");

        if (editF) editBtn.addEventListener("click", () => editF(user));
        if (deleteF) deleteBtn.addEventListener("click", () => deleteF(user.id));

        tbody.appendChild(row);
    });

    container.appendChild(table);
}
//CRUD User
//Create
async function getFindByIdUser() {
    const idFilter = document.getElementById("idFilter").value;
    if (!idFilter) {
        return console.log("No se econtro");
    }
    let data = await request(`${urlUser}/${idFilter}`);
    if (!data) {
        document.getElementById("data").innerHTML = "<p>No encontrado</p>";
        return;
    }
    createTable([data],formularioEdit, deleteUser);

    
}
async  function getAddUser(){
    const user = {
        firstName: document.getElementById("username").value,
        lastName: document.getElementById("userLastname").value,
        email: document.getElementById("email").value
    };
    await getAllUser();
    closeModal();

    let data = await request(urlUser, "POST", user);
    console.log(data);

}
//Read
async function getAllUser(){
    let data = await request(urlUser);
    console.log(data);
    console.log("se ejecuto god");
    createTable(data, formularioEdit, deleteUser);

    
}

//Update
async function updateUser() {
    const id = document.getElementById("iduser").value;
    const user = {
        firstName: document.getElementById("username").value,
        lastName: document.getElementById("userLastname").value,
        email: document.getElementById("email").value
    };
    let data = await request(`${urlUser}/${id}`, "PUT", user);
    console.log(data);
    await getAllUser();
    closeModal();
}

//Delete
async function deleteUser(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
        return;
    }
    let data = await  request(`${urlUser}/${id}`, "DELETE" );
    console.log(data);
    await getAllUser();
}
