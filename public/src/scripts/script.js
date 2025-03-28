/* ======== HOME ========*/

// URL
if (!document.location.pathname.includes("myList.html")) {
    if (document.location.host != "theus03.github.io") {
        document.getElementById("linkHome").href = "/index.html";
    } else {
        document.getElementById("linkHome").href = "/University/";
    }
}


// SLIDER 
if (document.location.pathname.includes("index") || document.location.pathname.includes("/University/")) {
    let time = 4000,
        currentImageWeb = 0,
        images = document.querySelectorAll(".sliders img")
        max = images.length;
    
        // Função que troca a imagem
        function nextImage() {
            images[currentImageWeb].classList.remove("selected")
    
            currentImageWeb++
    
            if(currentImageWeb >= max)
                currentImageWeb = 0
    
            images[currentImageWeb].classList.add("selected")
        }
    
        // Função para executar o sliders 
        function startImage() {
            setInterval(() => {
                // Troca imagem
                nextImage();
            }, time)
        }
    
    window.addEventListener("load", startImage)
}



/* ======== MY LIST ========*/

// MODAL

const Modal = {
    openModal() {
        document.querySelector(".modal-overlay").classList.add("active");
    }, 
    
    closeModal() {
        document.querySelector(".modal-overlay").classList.remove("active");
    }
}

// LOCAL STORAGE 

const getLocalStorage = () => JSON.parse(localStorage.getItem("db_university")) ?? [];

const setLocalStorage = (dbUniversity) => localStorage.setItem("db_university", JSON.stringify(dbUniversity))

// CRUD

const deleteUniversity = (index) => {
    const dbUniversity = readUniversity()

    dbUniversity.splice(index, 1)
    setLocalStorage(dbUniversity)
}

const updateUniversity = (index, university) => {
    const dbUniversity = readUniversity()
    dbUniversity[index] = university
    setLocalStorage(dbUniversity)
}

const readUniversity = () => getLocalStorage()

const createUniversity = (university) => {
    const dbUniversity = getLocalStorage()
    dbUniversity.push(university)
    setLocalStorage(dbUniversity)
}

// VALIDATION

const isValidFields = () => { 
    return document.getElementById('form').reportValidity()
}

// INTERACTION WITH LAYOUT

const clearFields = () => {
    const fields = document.querySelectorAll('.form-field')
    fields.forEach(field => field.value = "")
    document.getElementById('name').dataset.index = 'new'
}

const saveUniversity = () => {
    try{
        if(isValidFields()) {
            const university = {
                name: document.getElementById('name').value,
                course: document.getElementById('course').value,
                price: document.getElementById('price').value,
                type: document.getElementById('type').value,
                nomenclature: document.getElementById('nomenclature').value,
                duration: document.getElementById('duration').value,
                local: document.getElementById('local').value,
                degree: document.getElementById('degree').value
            }
            const index = document.getElementById('name').dataset.index
            if(index == 'new') {
                createUniversity(university)
                alert('Inserido com sucesso! ✅')
                updateTableUniversity()
            } else {
                updateUniversity(index, university)
                alert('Atualizado com sucesso! ✅')
                document.location.href = "myList.html";
                updateTableUniversity()
            }
        }
    } catch (error) {
        alert(error.message)
    }
}




// DOM 

const createRowUniversity = (university, index) => {
    console.log(university);
    const newRow = document.createElement('tr')

    newRow.innerHTML = `
        <td>${university.name}</td>
        <td>${university.course}</td>
        <td>${university.price}</td>
        <td>${university.type}</td>
        <td>${university.nomenclature}</td>
        <td>${university.duration}</td>
        <td>${university.local}</td>
        <td>${university.degree}</td>
        <td>
            <img id="edit-${index}" src="../icons/edit.png"  alt="">
            <img id="delete-${index}" src="../icons/delete.png"  alt="" style="width:2.8rem;">
        </td>
    `

    document.querySelector('#data-table>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#data-table>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTableUniversity = () => {
    const dbUniversity = readUniversity()
    clearTable()
    dbUniversity.forEach(createRowUniversity)
}

// FORM 

const emptyTable = document.querySelectorAll('#data-table>tbody>tr td').value;


const fillFields = (university) => {
    document.getElementById('name').value = university.name
    document.getElementById('course').value = university.course
    document.getElementById('price').value = university.price
    document.getElementById('type').value = university.type
    document.getElementById('nomenclature').value = university.nomenclature
    document.getElementById('duration').value = university.duration
    document.getElementById('local').value = university.local
    document.getElementById('degree').value = university.degree
    document.getElementById('name').dataset.index = university.index    
}

const editUniversity = (index) => {
    const university = readUniversity()[index]
    university.index = index
    fillFields(university)
}

const editDelete = (event) => {
    if(event.target.src != ''){
        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            document.querySelector('.result-overlay').style.visibility = 'visible'
            document.querySelector('.result-overlay').style.display = 'flex'
            document.querySelector('.header-my-list').style.display = 'none'
            document.querySelector('.container-form').style.display = 'flex'
            document.querySelector('.back-box').style.display = 'flex'
            document.querySelector('.back-box').style.background = 'var(--blue)'
            document.querySelector('.back-list').style.background = '#fff'
            document.querySelector('#container-table').style.display = 'none'
            document.querySelector('#addUniversity').style.background = 'var(--blue)'
            editUniversity(index)
        } else {
            const university = readUniversity()[index]
            Modal.openModal()
            document.querySelector('#confirmDelete').addEventListener('click', () => {
                deleteUniversity(index)
                Modal.closeModal()
                updateTableUniversity()

            })
        }
    }
}

updateTableUniversity()

// EVENTS

document.getElementById('addUniversity')
    .addEventListener('click', saveUniversity)

document.querySelector('#data-table>tbody')
    .addEventListener('click', editDelete)
