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
const currentFileElem = document.querySelector("#currentFile");

const state = {
    isValid: false,
    isZipped: false,
    currentFile: null,
    validExt: ["txt", "zip", "json", "xml"]
}


const isValidFunc = (currentFile) => {
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

    let {isValid, currentFile, isZipped} = state
    isValid = false;
    currentFile = null;
    isZipped = false;
    successUnZip.classList.add("d-none");
    successCalculate.classList.add("d-none");
    successDecrypt.classList.add("d-none");
    result.innerHTML = "";

    const data = await response.json();
    console.log(result);
    success.classList.remove("d-none");
    success.innerHTML += " size: " + data.size;

    state.currentFile = data.fileName;
    isValidFunc(state.currentFile);

    if(data.fileName.split('.')[1] === "zip"){
        state.isZipped = true;
    }
    currentFileElem.innerHTML = state.currentFile || "..."
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
        currentFileElem.innerHTML = state.currentFile || "..."
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
        currentFileElem.innerHTML = state.currentFile || "..."
    } else {
        successDecrypt.classList.remove("d-none", "text-success");
        successDecrypt.classList.add("text-danger");
        successDecrypt.innerHTML = "file is archivate"
    }
    console.log(state);
})

calculateButton.addEventListener("click", async () => {
    if(!state.isZipped) {
    const response = await fetch("/calculate", {
        method: "POST",
        body: state.currentFile
    })
    const data = await response.json();
    state.currentFile = data.fileName;
    successCalculate.classList.remove("d-none", "text-danger");
    successCalculate.classList.add("text-success");
    successCalculate.innerHTML = "OK";
    currentFileElem.innerHTML = state.currentFile || "..."
    } else {
        successCalculate.classList.remove("d-none", "text-success");
        successCalculate.classList.add("text-danger");
        successCalculate.innerHTML = "file is archivate"
    }
    console.log(state);
})



const showResults = (expressions) => {
   const ul = document.createElement("ul");
   expressions.forEach((exp) => {
       const li = document.createElement("li");
       li.innerHTML = exp;
       ul.append(li);
   })
   return ul;
}

downloadButton.addEventListener("click", async () => {
   // try {
        const response = await fetch("/downloadFile/" + state.currentFile);
        const data = await response.json();
        result.append(showResults(data.expressions));
        console.log(state);
    // }catch (e){

    // }
})




