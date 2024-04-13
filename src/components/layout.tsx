import * as React from 'react'
import { Link } from 'gatsby'
import {
    container,
} from './layout.module.scss'

const Layout = ({  children }) => {
    return (
        <div className={container}>
            <main>
                {children}
            </main>
        </div>
    )
}

export default Layout
