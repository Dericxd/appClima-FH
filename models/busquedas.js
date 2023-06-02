const fs = require('fs');

const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        //TODO: leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado() {
        // ?capitalizar
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras.map( p => p[0].toUpperCase() + p.substring(1) );
            return palabras.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language':'es'
        }
    }

    get paramsOpenWwather(){
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async ciudad( lugar = '' ) {

        try {
            // peticion http
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const resp = await intance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name_es,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {
            return [];
        }        
    }

    async climaLugar(lat,lon) {
        try {
            // * instance axios.create
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
                params: {...this.paramsOpenWwather,lat,lon}
            });
            
            // ? resp.data
            const resp = await instance.get();
            const { weather, main, visibility, wind, clouds } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
                visib: visibility,
                wind: wind.speed,
                grad: wind.deg,
                rafa: wind.gust != (undefined || null) ? wind.gust: 'no posee'.red,
                nub: clouds.all
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial ( lugar = '') {

        // TODO: prevenir duplicados
        if (this.historial.includes( lugar.toLocaleLowerCase() ) ) {
            return;
        }

        this.historial = this.historial.splice(0,5);

        this.historial.unshift( lugar.toLocaleLowerCase() );
        
        // ? guarda en la DB
        this.guardarDB();
    }

    guardarDB() {

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync( this.dbPath, JSON.stringify(payload) );
    }

    leerDB() {
        // * debe de existir...
        if ( !fs.existsSync( this.dbPath)) return;

        // ? const info... readfileSync path... {endcoding: 'utf-8}
        const info = fs.readFileSync( this.dbPath, {encoding:'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;

        //return data;
    }
}


module.exports = Busquedas