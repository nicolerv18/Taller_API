//Se crea la constante el url para la conexion con el servidor
async function request(url, method="GET", body= null) {
    let options= {
        method : method,
        headers: {
            "content-type" : "application/json"
        }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    let response = await fetch(url, options);
    let data =  await response.json();

    return data;

}

function closeModal() {
    document.getElementById("modal").style.display="none";
}

