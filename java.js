// --- LÓGICA JAVASCRIPT --- 

// Variables globales para almacenar las donaciones y comentarios
// Ahora, intentamos cargar los datos guardados en localStorage al inicio
var donations = JSON.parse(localStorage.getItem('donations')) || [];
var generalComments = JSON.parse(localStorage.getItem('generalComments')) || [];
var imagenDonacionBase64 = null; // Variable global para guardar la imagen

// Función para guardar los datos en localStorage
function saveData() {
    localStorage.setItem('donations', JSON.stringify(donations));
    localStorage.setItem('generalComments', JSON.stringify(generalComments));
}

// Función para registrar una donación LEYENDO DESDE EL FORMULARIO
function registrarDonacion() {
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var country = document.getElementById('country').value;
    var city = document.getElementById('city').value;
    var comment = document.getElementById('comment').value;

    // Validar que los campos y la imagen no estén vacíos
    if (!username || !email || !country || !city) {
        alert("Por favor, completa todos los campos de texto obligatorios.");
        return;
    }
    if (imagenDonacionBase64 == null) {
        alert("Por favor, selecciona o toma una foto del artículo.");
        return;
    }

    var newDonation = {
        username: username,
        email: email,
        imageUrl: imagenDonacionBase64, // Usamos la imagen en Base64
        country: country,
        city: city,
        comment: comment,
        donated: false
    };
    
    donations.push(newDonation);
    // ¡Guardar los datos después de cada cambio!
    saveData(); 
    alert("¡Gracias, " + username + "! Tu donación ha sido registrada con éxito.");
    
    // Limpiar el formulario
    document.getElementById('donation-form').reset();
    document.getElementById('image-preview').src = "";
    imagenDonacionBase64 = null;
    
    // Actualizar las vistas y cambiar a la pestaña de catálogo
    actualizarCatalogo();
    actualizarRegistroDonaciones();
    showSection('catalogo');
}

// Función para manejar la selección de la imagen (desde galería o cámara)
function handleFileSelect(event) {
    var file = event.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {
        // Mostrar la vista previa
        var preview = document.getElementById('image-preview');
        preview.src = e.target.result;
        
        // Guardar la imagen en formato Base64 en nuestra variable global
        imagenDonacionBase64 = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Asociar el evento 'change' a nuestros inputs de archivo
document.getElementById('gallery-input').addEventListener('change', handleFileSelect);
document.getElementById('camera-input').addEventListener('change', handleFileSelect);

// --- FUNCIONES ANTERIORES (con pequeñas adaptaciones si es necesario) ---

function showSection(sectionId) {
    var sections = document.getElementsByClassName('seccion-contenido');
    for (var i = 0; i < sections.length; i++) {
        sections[i].style.display = 'none';
    }
    document.getElementById('inicio').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
}

function mostrarInfoDonante(index) {
    var item = donations[index];
    var info = "Información del Donante:\n\nUsuario: " + item.username + "\nPaís: " + item.country + "\nCiudad: " + item.city;
    alert(info);
}

function solicitarDonacion(index) {
    if (donations[index].donated) {
        alert("Este artículo ya fue solicitado anteriormente.");
    } else {
        donations[index].donated = true;
        alert("¡Has solicitado el artículo con éxito! El donante será notificado.");
        
        // ¡Guardar los datos después de cada cambio!
        saveData();

        actualizarCatalogo();
        actualizarRegistroDonaciones(); // También actualizamos el registro general
    }
}

function actualizarCatalogo() {
    var catalogoContainer = document.getElementById('catalogo-grid');
    var htmlContent = "";
    for (var i = 0; i < donations.length; i++) {
        var item = donations[i];
        var botonHtml = item.donated 
            ? '<button class="boton-donado">Este artículo ya fue donado</button>'
            : '<button onclick="solicitarDonacion(' + i + ')">Solicitar</button>';

        htmlContent += '<div class="catalogo-item">' +
                       '  <img src="' + item.imageUrl + '" onclick="mostrarInfoDonante(' + i + ')">' +
                       '  <h3>' + item.country + '</h3>' +
                       '  <p class="donation-comment">"' + (item.comment ? item.comment : "Sin comentario") + '"</p>' +
                       botonHtml +
                       '</div>';
    }
    catalogoContainer.innerHTML = htmlContent;
}

// Función para añadir un comentario general
function addGeneralComment() {
    var commentUsername = document.getElementById('comment-username').value;
    var generalCommentText = document.getElementById('general-comment').value;

    if (!commentUsername || !generalCommentText) {
        alert("Por favor, ingresa tu nombre y tu comentario.");
        return;
    }

    var newGeneralComment = {
        username: commentUsername,
        comment: generalCommentText
    };
    generalComments.push(newGeneralComment);
    // ¡Guardar los datos después de cada cambio!
    saveData();
    alert("Tu comentario ha sido publicado.");

    // Limpiar el formulario de comentario general
    document.getElementById('general-comment-form').reset();
    actualizarRegistroDonaciones(); // Actualizar para mostrar el nuevo comentario
}

function actualizarRegistroDonaciones() {
    var registroContainer = document.getElementById('registro-info');
    var comentariosContainer = document.getElementById('comentarios-generales');
    var totalDonaciones = donations.length;
    var donacionesRealizadas = 0;
    for(var i=0; i < donations.length; i++){ if(donations[i].donated){ donacionesRealizadas++; } }
    
    var registroHtml = "<h3>Estadísticas Generales</h3>" + "<p>Total de artículos registrados: " + totalDonaciones + "</p>" + "<p>Total de artículos ya donados: " + donacionesRealizadas + "</p>" + "<br><h3>Lista de Donaciones Registradas:</h3>";
    
    for (var i = 0; i < donations.length; i++) {
        var item = donations[i];
        var estado = item.donated ? "Donado" : "Disponible";
        registroHtml += "<p><b>" + (i+1) + ". Donante:</b> " + item.username + " (" + item.country + ") - <b>Estado:</b> " + estado + "</p>";
    }
    registroContainer.innerHTML = registroHtml;

    var comentariosHtml = "";
    for (var i = 0; i < generalComments.length; i++) {
        var comment = generalComments[i];
        comentariosHtml += "<p><b>" + comment.username + " comentó:</b><i> \"" + comment.comment + "\"</i></p>";
    }
    comentariosContainer.innerHTML = comentariosHtml;
}

// Esta función se ejecuta cuando la página termina de cargar
window.onload = function() {
    // Al cargar la página, primero cargamos los datos y luego actualizamos las vistas
    // Los datos ya se cargan al inicio de la ejecución del script, pero aseguramos la actualización visual
    actualizarCatalogo();
    actualizarRegistroDonaciones();
    showSection('inicio');
};