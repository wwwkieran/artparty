import * as React from "react";
import IOpening from "../types/IOpening";
import Map, {GeolocateControl, Marker} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {useMemo} from "react";
import mapboxgl from "mapbox-gl";

type GalleryMapProps = {
    openings: IOpening[]
}

const GalleryMap: React.FC<GalleryMapProps> = (props: GalleryMapProps) => {
    const popup = (name: string, address: string, desc: string) => {
        return new mapboxgl.Popup().setHTML('<b>' + name + '</b> \n <p>' + address + '<br>' + desc + '</p>');
    }

    return (<Map
        mapboxAccessToken={process.env.GATSBY_MAPBOX_TOKEN}
        initialViewState={{
            longitude: -73.98,
            latitude: 40.725,
            zoom: 11.6
        }}
        style={{width: '100%', height: '70vh', borderRadius: '15px'}}
        mapStyle="mapbox://styles/mapbox/dark-v11"

    >
        <GeolocateControl/>
        {props.openings.map(opening => (<Marker longitude={opening.long} latitude={opening.lat} popup={popup(opening.name, opening.address, opening.description)}/>))}
    </Map>)
}

export default GalleryMap