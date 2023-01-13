const form = document.querySelector("form");
const success = document.querySelector("#upload");
const unzip = document.querySelector("#UnZip");
const successUnZip = document.querySelector("#successUnZip");
const downloadButton = document.querySelector("#downloadResult");
const result = document.querySelector(".result-item");
const decryptButton = document.querySelector("#Decrypt");
const successDecrypt = document.querySelector("#successDecrypt");
const calculateButton = document.querySelector("#Calculate");
const successCalculate =  document.querySelector("#successCalculate");


const state = {
    isValid: false,
    isZipped: false,
    currentFile: null,
    validExt: ["txt", "zip", "json", "xml"]
}

const isValid = (currentFile) => {
    const extension = currentFile.split(".")[1];
    if(state.validExt.includes(extension)){
        state.isValid = true;
    }
    return true;
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
    isValid(state.currentFile);

    if(result.fileName.split('.')[1] === "zip"){
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
        successUnZip.classList.remove("d-none");

        if(state.currentFile.split('.')[1] !== "zip"){
            state.isZipped = false;
        }
    } else {
        successUnZip.classList.remove("d-none", "text-success");
        successUnZip.classList.add("text-danger");
        successUnZip.innerHTML = "not archivate"
    }
    console.log(state);
})

decryptButton.addEventListener("click", async () => {
    if(!state.isZipped) {
        const response = await fetch("/decrypt", {
            method: "POST",
            body: state.currentFile
        })
        const data = await response.json();
        state.currentFile = data.fileName;
        successDecrypt.classList.remove("d-none", "text-danger");
        successDecrypt.classList.add("text-success");
        successDecrypt.innerHTML = "OK";
    } else {
        successDecrypt.classList.remove("d-none", "text-success");
        successDecrypt.classList.add("text-danger");
        successDecrypt.innerHTML = "file is archivate"
    }
    console.log(state);
})

calculateButton.addEventListener("click", async () => {
    const response = await fetch("/calculate", {
        method: "POST",
        body: state.currentFile
    })
    const data = await response.json();
    state.currentFile = data.fileName;
    successCalculate.classList.remove("d-none", "text-danger");
    successCalculate.classList.add("text-success");
    successCalculate.innerHTML = "OK";
})



const showResults = (expressions) => {
   return expressions.join("\n");
}

downloadButton.addEventListener("click", async () => {
   // try {
        const response = await fetch("/downloadFile/" + state.currentFile);
        const data = await response.json();
        result.innerHTML = showResults(data.expressions);
        console.log(state);
    // }catch (e){

    // }
})




