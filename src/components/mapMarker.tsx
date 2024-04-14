import * as React from "react";
// @ts-ignore
import { ReactComponent as BaseMarker } from "./markerSVG/base.svg";
import { motion } from "framer-motion";



type MapMarkerProps = {
    selected: boolean,
    scale: number,
    emoji?: string
}

const MapMarker: React.FC<MapMarkerProps> = (props: MapMarkerProps) => {
    const emoji = props.emoji ?? "🖼️"
    return (<motion.div initial={{scale: 0}} exit={{scale: 0}} animate={{scale: props.selected ? 1.5*props.scale : props.scale}} transition={{type: "spring", duration: 0.5, bounce: 0.6}}>
        {/*<BaseMarker style={{position: "absolute", top: "0px", left: "-5px", width: "20px"}}></BaseMarker>*/}
        <p style={{position: "absolute", top: "0px", left: "-8px", margin: "0px", filter: props.selected ? "brightness(65%)" : "", cursor: "pointer"}}>{emoji}</p>
    </motion.div>)
}

export default MapMarker