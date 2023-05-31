require('dotenv').config();


const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {

    const busquedas = new Busquedas();
    let opt = '';

    do {

        opt = await inquirerMenu();
        
        switch (opt) {

            case 1:
                // Mostrar msj
                const termino = await leerInput('Ciudad: ');
                
                // Buscar los lugares
                const lugares = await busquedas.ciudad( termino );
                
                // Seleccionar el lugar
                const id = await listarLugares(lugares);
                const lugarSel = lugares.find( l => l.id === id);
                
                // Clima
                const clima = await busquedas.climaLugar(lugarSel.lat,lugarSel.lng);

                // Mostrar resultados
                console.clear(),
                console.log('\ninformacion de la ciudad\n'.blue);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Minima:', clima.min);
                console.log('Maxima:', clima.max);
                console.log('Visibilidad:', clima.visib);
                console.log('Grado:', clima.grad);
                console.log('rafaga:', clima.rafa);
                console.log('Velocidad:', clima.wind);
                console.log('Nubes:', clima.nub);
                console.log('Como está el clima:', clima.desc.green);

            break;
        
            default:
            break;
        }

        
        if(opt !== 0) await pausa();

    } while (opt !== 0);

}

main();