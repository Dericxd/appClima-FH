const fs = require('fs');

const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        //TODO: leer DB si existe
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
        //asdfasd
    }
}


module.exports = Busquedas