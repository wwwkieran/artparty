import * as React from 'react'
import { Link } from 'gatsby'
import {
    container,
} from './layout.module.scss'

type LayoutProps = {
    children: React.ReactNode
}

const Layout = (props: LayoutProps) => {
    return (
        <main className={container}>
            {props.children}
        </main>
    )
}

export default Layout
