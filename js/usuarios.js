import apiUsuarios from './apiUsuarios.js';

const buscador = document.querySelector('.headerUser_input');
const listUser = document.querySelector('.listUsers');
const cardUser = document.querySelector('.CardUser');
const loader = document.querySelector('.loader');

const cargarUsuarios = async (number) => {
    let users = [];
    try {
        for(let i = 0; i < number; i++) {
            const user = await apiUsuarios();
            if (user) {
                users.push(user);
            }
        }
    } catch (error) {
        console.log(error.message)
    }
    return users;
}

const buscadorPorNombre = (users, listUser) => {
    buscador.addEventListener('input', (e)=> {
        const find = e.target.value.toLowerCase()
        
        const filteredUsers = users.filter(user => {
            const nombre = user.name.first.toLowerCase();
            const apellido = user.name.last.toLowerCase();
            return nombre.includes(find) || apellido.includes(find);
        });
        
        listUser.innerHTML = '';

        filteredUsers.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('listUsers_card');
            userElement.innerHTML = `
                <img class="cardUser_img" src="${user.picture.thumbnail}"/>
                <h3 class="cardUser_nombre">${user.name.first} ${user.name.last}</h3>`;
            userElement.addEventListener('click', () => updateCardUser(user));
            listUser.appendChild(userElement);
            });
        });
};

// Función para actualizar CardUser con los datos del usuario seleccionado de la lista
const updateCardUser = (user) => {
    cardUser.innerHTML = `
        <div class="CardUser_card">
            <div class="card_img">
                <img class="card_img_foto" src="${user.picture.large}"/>
            </div>
            <div class="card_informacion">
                <div class="card_iconos">
                    <i class="fa-solid fa-square-phone card_iconos_icono"></i>
                    <i class="fa-solid fa-square-envelope card_iconos_icono"></i>
                    <i class="fa-solid fa-map-location-dot card_iconos_icono"></i>
                    <i class="fa-solid fa-calendar-day card_iconos_icono"></i>
                </div>
                <div class="card_datos">
                    <p class="card_datos_p">${user.name.title} ${user.name.first} ${user.name.last}</p>
                    <p class="card_datos_p">Edad: ${user.dob.age}</p>
                    <p class="card_datos_p">Genero: ${(user.gender === 'male') ? 'Masculino' : 'Femenino'} </p>
                </div>
                <button type="button" class="open-modal" data-open="modal">
                    <i class="fa-solid fa-user-plus card_iconos_icono card_iconos_icono--modal"></i>
                </button>
            </div>            
        </div>`;
    cardUser.addEventListener('click',(e) => handleCardUserClick(e, user));
};

const removeClass = (array, className) => {
    array.forEach((elemento) => {
        elemento.classList.remove(className)
    })
};

const llenarContenidoHTML = (elemento, texto) => {
    let elementoHTML = document.querySelector(elemento);
    console.log(elementoHTML)
    if (elementoHTML.tagName == 'INPUT') {
        elementoHTML.value = texto;
    } else if (elementoHTML.tagName == 'IMG') {
        elementoHTML.src = texto;
    } else {
        elementoHTML.textContent = texto;
    }
    return texto; 
}

let map; 
// Función manejadora de clic en CardUser
const handleCardUserClick = (e, user) => {
    const cardDatos = document.querySelector('.card_datos');
    const iconos = document.querySelectorAll('.card_iconos_icono');
    
    if (e.target.classList.contains('card_iconos_icono')) {
        if (e.target.classList.contains('fa-square-phone')) {
            removeClass(iconos,'selected');
            e.target.classList.add('selected');
            cardDatos.innerHTML = `<p class="card_datos_p">Teléfono: ${user.phone}</p>`;
        } else if (e.target.classList.contains('fa-square-envelope')) {
            removeClass(iconos,'selected');
            e.target.classList.add('selected');
            cardDatos.innerHTML = `<p class="card_datos_p">Email: ${user.email}</p>`;
        } else if (e.target.classList.contains('fa-map-location-dot')) {
            removeClass(iconos,'selected');
            e.target.classList.add('selected');
            const location = user.location;
            cardDatos.innerHTML =`
                <p class="card_datos_p">Ciudad: ${location.city}</p>
                <p class="card_datos_p">Estado: ${location.state}</p>
                <p class="card_datos_p">País: ${location.country}</p>`;
        } else if (e.target.classList.contains('fa-calendar-day')) {
            removeClass(iconos,'selected');
            e.target.classList.add('selected');
            cardDatos.innerHTML = `<p class="card_datos_p">Fecha de Nacimiento: ${new Date(user.dob.date).toLocaleDateString()}</p>`;
        } else if (e.target.classList.contains('fa-user-plus')) {
            const modalNombre = llenarContenidoHTML('.modalNombre',`${user.name.title} ${user.name.first} ${user.name.last}`)
            const imgUser = llenarContenidoHTML('#imgUser_modal', `${user.picture.medium}`);
            const username = llenarContenidoHTML('#username_modal',`${user.login.username}`);
            const phone = llenarContenidoHTML('#phone_modal', `${user.phone}`);
            const cell = llenarContenidoHTML('#cell_modal', `${user.cell}`);
            const email = llenarContenidoHTML('#email_modal', `${user.email}`)
            const postcode = llenarContenidoHTML('#postcode_modal', `${user.location.postcode}`)
            const street = llenarContenidoHTML('#street_modal', `${user.location.street.name} ${user.location.street.number}`);
            const city = llenarContenidoHTML('#city_modal',  `${user.location.city}`);
            const state = llenarContenidoHTML('#state_modal', `${user.location.state}`);
            const country = llenarContenidoHTML('#country_modal', `${user.location.country}`);
            const nacionalidad = llenarContenidoHTML('#nacionalidad_modal', `${user.nat}`);
            const age = llenarContenidoHTML('#age_modal', `${user.dob.age}`);
            const antiguedad = llenarContenidoHTML('#antiguedadMiembro_modal', `${user.registered.age}`);
            const gender = llenarContenidoHTML('#gender_modal', `${(user.gender === 'male') ? 'Masculino' : 'Femenino'}`);
            const fechaNacimiento = llenarContenidoHTML('#fechaNacimiento_modal', `${new Date(user.dob.date).toLocaleDateString()}`);
            const registro = llenarContenidoHTML('#fechaRegistro_modal', `${new Date(user.registered.date).toLocaleDateString()}`);

            // const frase = document.getElementById('frase_modal');
            // const AutorFrase = document.getElementById('autorFrase_modal');

            // frase.textContent = `frase desde api`
            // //AutorFrase.textContent = `autor frase desde api`

            // Inicializa el mapa
            if (!map) {
                map = L.map('map').setView([user.location.coordinates.latitude, user.location.coordinates.longitude], 12); // La vista inicial puede ser ajustada

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);
            }

            // Actualiza la posición del marcador en el mapa
            const marker = L.marker([user.location.coordinates.latitude, user.location.coordinates.longitude]).addTo(map);
            marker.setLatLng([user.location.coordinates.latitude, user.location.coordinates.longitude]);
            marker.bindPopup(user.name.first).openPopup();

            //frase.value = ``

            const modal = document.getElementById('modal');
            const closeButton = document.querySelector('.close-modal');
            modal.classList.add('is-visible');

            // Función para cerrar el modal
            const closeModal = () =>  {
                modal.classList.remove('is-visible');
            }

            // Función manejadora para eventos en el modal
            const handleModalEvents = (e) => {
                if (e.target === closeButton || e.target === modal) {
                    closeModal();
                }
            
                if (e.key === 'Escape') {
                    closeModal();
                }
            }

            //click en modal cierra el modal
            modal.addEventListener('click', (e) => handleModalEvents(e));
            //tecla esc cierra el modal
            document.addEventListener('keydown', (e) => handleModalEvents(e));
            closeButton.addEventListener('click', () => closeModal());
        }
    } 
};

// Agregar usuarios a listUser
const listadoUsuarios = (users, listUser) => {
    users.forEach((user, index) => {
        const userElement = document.createElement('div');
        userElement.classList.add('listUsers_card');
        userElement.innerHTML = `
            <img class="cardUser_img" src="${user.picture.thumbnail}"/>
            <h3 class="cardUser_nombre">${user.name.first} ${user.name.last}</h3>`;
        userElement.addEventListener('click', () => {
            const allUserElements = document.querySelectorAll('.listUsers_card');
            removeClass(allUserElements,'selected');
            userElement.classList.add('selected');
            updateCardUser(user);
        });
        //agregar class selected al primer elemento porque es el que se muestra por default
        if (index === 0) {
            userElement.classList.add('selected');
        }
        listUser.appendChild(userElement);
    });
    // Actualizar CardUser con los datos del primer usuario al cargar la página
    updateCardUser(users[0]);
}

// Función para cargar usuarios y actualizar CardUser
const loadAndDisplayUser = async (number) => {
    const loader = document.querySelector('.loader');
    loader.style.display = 'block';

    let users = [];
    try {
        const users = await cargarUsuarios(number);
        loader.style.display = 'none';
        //console.log('usuarios:', users);
        listadoUsuarios(users, listUser);
        buscadorPorNombre(users, listUser);

    } catch (error) {
        loader.style.display = 'none';
        console.log(error.message);
    }
}

// Llamar a la función para cargar y mostrar usuarios
loadAndDisplayUser(10);