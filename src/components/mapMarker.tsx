import * as React from "react";
import IOpening from "../types/IOpening";
import Map, {GeolocateControl, Marker, MapRef} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {useMemo, useRef, useState} from "react";
import mapboxgl from "mapbox-gl";
// @ts-ignore
import { ReactComponent as BaseMarker } from "./markerSVG/base.svg";
import {disable} from "gatsby/dist/schema/infer/inference-metadata";


type MapMarkerProps = {
    selected: boolean,
    scale: number,
    emoji?: string
}

const MapMarker: React.FC<MapMarkerProps> = (props: MapMarkerProps) => {
    const emoji = props.emoji ?? "🖼️"
    return (<div style={{}}>
        {/*<BaseMarker style={{position: "absolute", top: "0px", left: "-5px", width: "20px"}}></BaseMarker>*/}
        <p style={{position: "absolute", top: "0px", left: "-8px", margin: "0px", filter: props.selected ? "brightness(65%)" : "",}}>{emoji}</p>
    </div>)
}

export default MapMarker