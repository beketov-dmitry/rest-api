const form = document.querySelector("form");
const success = document.querySelector("#upload");
const unzip = document.querySelector("#UnZip");
const successUnZip = document.querySelector("#successUnZip");


const state = {
}


form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const response = await fetch('/uploadFile', {
        method: 'POST',
        body: new FormData(form)
    });

    const result = await response.json();
    console.log(result);
    success.classList.remove("d-none");
    success.innerHTML += " size: " + result.size;

    state.uploadFile = result.fileName;
        // success.classList.remove("d-none", "text-success ");
        // success.classList.add("text-danger");
        // success.innerHTML = "file not fount ";
    console.log(state);
})


unzip.addEventListener("click", async () => {

    const response = await fetch("/unZip", {
        method: "POST",
        body: state.uploadFile
    })

    const data = await response.json();
    state.unarchivateFile = data.fileName;

    successUnZip.classList.remove("d-none");

    console.log(data);
})




