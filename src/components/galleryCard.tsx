import * as React from "react";
import IOpening from "../types/IOpening";
import {Button, Card, CardBody, CardHeader, Divider} from "@nextui-org/react";
import { card, header, body, galleryName } from './galleryCard.module.scss'
import { motion } from "framer-motion";

type GalleryCardProps = {
    opening: IOpening
    closeFn: () => void
}

const GalleryCard: React.FC<GalleryCardProps> = (props: GalleryCardProps) => {
    return (<motion.div initial={{opacity: 0, left: "40%"}} animate={{opacity: 100, left: "50%"}} exit={{opacity: 0,}}>
        <Card className={card + " bg-background/10"} isBlurred={true}>
        <CardHeader className={header}>
            <h2 className={ galleryName }>{props.opening.name}</h2>
            <Button size={"sm"} radius={"full"} variant={"bordered"} onPress={props.closeFn}> Close </Button>
        </CardHeader>
        <Divider/>
        <CardBody className={body}>
            <p>{props.opening.address}</p>
            <p>{props.opening.description}</p>

        </CardBody>
        </Card></motion.div>)
}

export default GalleryCard