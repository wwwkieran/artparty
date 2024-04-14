import * as React from "react";
import IOpening from "../types/IOpening";
import Map, {GeolocateControl, Marker, MapRef} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {useEffect, useMemo, useRef, useState} from "react";
import mapboxgl from "mapbox-gl";
import MapMarker from "./mapMarker";
import {container} from './galleryMap.module.scss'
import GalleryCard from "./galleryCard";
import {AnimatePresence} from "framer-motion";
type GalleryMapProps = {
    openings: IOpening[]
}

const GalleryMap: React.FC<GalleryMapProps> = (props: GalleryMapProps) => {
    const mapRef = useRef<MapRef>(null);
    const [selectedOpeningIndex, setSelectedOpeningIndex] = useState(-1)
    const onMarkerClick = (opening: IOpening, index: number) => {
        // ref.current?.getElement().getElementsByTagName("svg")[0].getElementsByTagName("path")[0].setAttribute("fill", "#dc2626");
        setSelectedOpeningIndex(index)
        mapRef.current?.easeTo({center: [opening.long, opening.lat]})
    }
    const [openings, setOpenings] = useState(props.openings)
    useEffect(() => {
        console.log(props.openings)
        setSelectedOpeningIndex(-1)
        setOpenings(props.openings)
    }, [props.openings]);
    const [markerZoom, setMarkerZoom] = useState(1)

    return (<Map
        ref={mapRef}
        mapboxAccessToken={process.env.GATSBY_MAPBOX_TOKEN}
        initialViewState={{
            longitude: -73.98,
            latitude: 40.725,
            zoom: 11.6
        }}
        style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0,  borderRadius: '15px'}}
        mapStyle="mapbox://styles/wwwkieran/cluuckpl700a601qr1xx0hpkf"
        minZoom={11}
        onZoom={(e) => {
            setMarkerZoom(e.viewState.zoom/11.6)
        }}
    >
        <GeolocateControl position={"bottom-right"}/>
        <AnimatePresence>
        {openings.map((opening, index) => {
            return (<Marker key={opening.date + opening.name + opening.address} longitude={opening.long} element={undefined} latitude={opening.lat} onClick={(e) => {onMarkerClick(opening, index)}}>
                <MapMarker selected={selectedOpeningIndex === index} scale={markerZoom} />
            </Marker>)
        })}
        </AnimatePresence>
        <AnimatePresence mode={"wait"}>
        {selectedOpeningIndex > -1 && <GalleryCard opening={openings[selectedOpeningIndex]} key={selectedOpeningIndex} closeFn={() => {setSelectedOpeningIndex(-1)}}/>}
        </AnimatePresence>
    </Map>)
}

export default GalleryMap