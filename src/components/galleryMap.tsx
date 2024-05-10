import * as React from "react";
import IOpening from "../types/IOpening";
import Map, {GeolocateControl, Marker, MapRef, AttributionControl} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {useEffect, useMemo, useRef, useState} from "react";
import mapboxgl from "mapbox-gl";
import MapMarker from "./mapMarker";
import {container, locateButton} from './galleryMap.module.scss'
import GalleryCard from "./galleryCard";
import {AnimatePresence} from "framer-motion";
import {Button} from "@nextui-org/react";
import LocateButton from "./locateButton";
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
    let geolocateControlRef = useRef<mapboxgl.GeolocateControl>(null);
    const [geolocateLoading, setGeolocateLoading] = useState(false)


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
        <GeolocateControl ref={geolocateControlRef} style={{scale: 2, visibility: "hidden"}} position={"bottom-right"} onGeolocate={() => {setGeolocateLoading(false)}}
        showUserHeading={true} onError={ (e) => {
            // Todo: Popup error message with solution
            setGeolocateLoading(false)
            console.log(e)
        }}/>
        <LocateButton isLoading={geolocateLoading} onClick={() =>
            {
                if (geolocateControlRef.current !== null) {
                    setGeolocateLoading(true)
                    geolocateControlRef.current.trigger() }}}/>
        <AnimatePresence>
        {openings.map((opening, index) => {
            return (<Marker key={opening.date + opening.name + opening.address} longitude={opening.long} element={undefined} latitude={opening.lat} onClick={(e) => {onMarkerClick(opening, index)}}>
                <MapMarker opening={opening} selected={selectedOpeningIndex === index} scale={markerZoom} emoji={opening.emoji} />
            </Marker>)
        })}
        </AnimatePresence>
        <AnimatePresence mode={"wait"}>
        {selectedOpeningIndex > -1 && <GalleryCard opening={openings[selectedOpeningIndex]} key={selectedOpeningIndex} closeFn={() => {setSelectedOpeningIndex(-1)}}/>}
        </AnimatePresence>
    </Map>)
}

export default GalleryMap