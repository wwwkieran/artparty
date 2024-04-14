import * as React from "react";
import IOpening from "../types/IOpening";
import {Button, Card, CardBody, CardHeader, Divider} from "@nextui-org/react";
import { locateButton, svgContainer } from './locateButton.module.scss'
import { motion } from "framer-motion";

type LocateButtonProps = {
    isLoading: boolean,
    onClick: () => void,
}

const locationSVG = (
    <div className={svgContainer}>
        <svg
            width="42"
            height="42"
            direction="ltr"
            version="1.1"
            id="svg1"
            xmlns="http://www.w3.org/2000/svg">
            <defs
                id="defs1"/>
            <g
                fillRule="nonzero"
                transform="matrix(1,0,0,-1,-2.7871094,46.197265)"
                id="g1">
                <path
                    fill="#000000"
                    stroke={"#ba6221"}
                    fillOpacity="1"
                    strokeWidth="1"
                    d="m 4.5546875,25.802734 18.6484375,-0.04297 c 0.150391,0 0.257812,-0.107422 0.257812,-0.257813 l 0.04297,-18.6484374 c 0,-0.7089844 0.429688,-1.2675781 1.03125,-1.2675781 0.53711,0 0.902344,0.3652344 1.138672,0.9023437 L 43.248047,43.720703 c 0.15039,0.34375 0.236328,0.666016 0.236328,0.945313 0,0.472656 -0.386719,1.03125 -1.095703,1.03125 -0.236328,0 -0.580078,-0.04297 -0.945313,-0.214844 L 4.1894531,27.972656 c -0.515625,-0.236328 -0.9023437,-0.644531 -0.9023437,-1.138672 0,-0.580078 0.4941406,-1.03125 1.2675781,-1.03125 z m 0.2792969,0.988282 c -0.1933594,0 -0.1933594,0.236328 -0.021484,0.300781 L 41.787109,44.537109 c 0.515625,0.257813 0.773438,0.06445 0.494141,-0.515625 L 24.835937,7.1113281 c -0.107421,-0.2148437 -0.34375,-0.1289062 -0.34375,0.021484 l 0.04297,18.8203129 c 0,0.537109 -0.257812,0.880859 -0.966797,0.880859 z"
                    id="path1"/>
            </g>
        </svg>
    </div>)

const LocateButton: React.FC<LocateButtonProps> = (props: LocateButtonProps) => {
    return (
        <Button className={locateButton + " bg-background/70"} onClick={props.onClick} radius={"lg"} isIconOnly={true}>
            <motion.div animate={{rotate: props.isLoading ? [0, 90, 180, 270, 360] : 0}} transition={props.isLoading ? {repeat: Infinity, repeatType: "reverse"}: {}}>
                {locationSVG}
            </motion.div>
        </Button>
    )
}

export default LocateButton