const form = document.querySelector("form");
const success = document.querySelector("#upload");
const unzip = document.querySelector("#UnZip");
const successUnZip = document.querySelector("#successUnZip");
const downloadButton = document.querySelector("#downloadResult");
const result = document.querySelector(".result-item");

const state = {
    isZipped: false,
    currentFile: null
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

    state.currentFile = result.fileName;
    if(result.fileName.split('.') === "zip"){
        state.isZipped = true;
    }
        // success.classList.remove("d-none", "text-success ");
        // success.classList.add("text-danger");
        // success.innerHTML = "file not fount ";
    console.log(state);
})


unzip.addEventListener("click", async () => {

    if(state.isZipped) {
        const response = await fetch("/unZip", {
            method: "POST",
            body: state.currentFile
        })

        const data = await response.json();
        state.currentFile = data.fileName;
        state.isZipped = false;
        successUnZip.classList.remove("d-none");
    } else {
        successUnZip.classList.remove("d-none", "text-success");
        successUnZip.classList.add("text-danger");
        successUnZip.innerHTML = "not archivate"
    }
})

downloadButton.addEventListener("click", async () => {
    const response = await fetch("/downloadFile/" + state.unarchivateFile);
    const data = await response.json();
    result.innerHTML = data;
    console.log(data)
})




