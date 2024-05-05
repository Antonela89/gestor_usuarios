import loadConfig from './config.js';

// const await = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));
// const apiFrases = async (retryCount = 0) => {
//     try {
//         //guardo el valor de la api_key en una variable para reutilizarla
//         const api_key = await loadConfig();
//         const servidorProxy = 'http://127.0.0.1:8080/';
        
//         if (!api_key) {
//             console.error('API key no disponible');
//             return;
//         }

//         //Configuración de la solicitud con el encabezado CORS
//         const requestOptions = {
//             method: 'GET',
//             mode: 'cors', 
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin':'*',
//                 'origin': 'x-requested-with'
//             },
//         };

//         const response = await fetch(`${servidorProxy}http://quotes.rest/qod?api_key=${api_key}`, requestOptions);

//         console.log('apiFrases:', response);

//         if (response.status === 200) {
//             const frases = await response.json();
//             console.log('frases: ', frases)

//              // Iterar sobre las frases
//             for (const frase of frases) {
//             // Imprimir la frase y el autor
//             console.log(frase.quote, frase.author);
//             }
            
//         } else if (response.status === 429 && retryCount < 5) {
//             console.error('Demasiadas solicitudes. Esperando antes de intentar nuevamente.');
//             await wait(3600000); // Espera 1 hora antes de intentar nuevamente (3600000 milisegundos)
//             await apiFrases(retryCount + 1); // Vuelve a intentar la solicitud con un contador de reintentos
//         } else {
//             console.error('Error en la solicitud:', response.statusText);
//         }
//     } catch (error) {
//         console.error(error.message);
//     }
// };

// apiFrases(); 

const api_key = await loadConfig();
const servidorProxy = 'http://127.0.0.1:8080/';
const dailyRequestLimit = 5;
let requestsMade = 0;
let lastResetTimestamp = Date.now();

const apiFrases = async () => {
    // Verificar si se ha superado el límite diario
    if (requestsMade >= dailyRequestLimit) {
        console.log('Se ha alcanzado el límite diario de solicitudes. Espere hasta mañana.');
        return null;
    }

    try {
        //peticion a la api
        let fetchFrases = await fetch(`${servidorProxy}http://quotes.rest/qod?api_key=${api_key}`)
        let frases = await fetchFrases.json();

        // Actualizar el contador de solicitudes realizadas
        requestsMade++;

        // Verificar si se ha alcanzado el límite diario y reiniciar si es necesario
        if (requestsMade >= dailyRequestLimit) {
            requestsMade = 0;
            lastResetTimestamp = Date.now();
        }
        //armado de array de citas
        let apiFrases = []; 
        
        console.log(frases); 
        console.log(frases.contents.quotes[0].quote); 
        console.log(frases.contents.quotes[0].author); 

        let cita = frases.contents.quotes[0].quote;
        let autor = frases.contents.quotes[0].author;

        apiFrases.push({'cita': cita, 'autor': autor})
        
        console.log(apiFrases);

        return apiFrases;

    } catch (error) {
        console.log(error)
    }
}

apiFrases();


