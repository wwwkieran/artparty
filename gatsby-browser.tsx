import './global.scss'
import * as React from "react";
import {NextUIProvider} from "@nextui-org/react";

export const wrapPageElement = ({  element  }) => {
    // const [loading, setLoading] = React.useState(true)
    // props provide same data to Layout as Page element will get
    // including location, data, etc - you don't need to pass it
    return (<NextUIProvider>
        {element}
    </NextUIProvider>)
}