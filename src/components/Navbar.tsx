import React from 'react'
import styles from './components.module.css'
// import "primereact/resources/primereact.min.css";
// import "primereact/resources/themes/lara-light-blue/theme.css";

export function Navbar() {
    return (
        <nav className={styles.navbar}>
            <ul style={{ display: 'flex', gap: '64px' }}>
                <li>
                    <a href="/" className={styles.navbarLinks}>
                        Main page
                    </a>
                </li>
                <li>
                    <a href="/fakultas" className={styles.navbarLinks}>
                        Fakultas
                    </a>
                </li>
                <li>
                    <a href="/jurusan" className={styles.navbarLinks}>
                        Jurusan
                    </a>
                </li>
                <li>
                    <a href="/matkul" className={styles.navbarLinks}>
                        Matkul
                    </a>
                </li>
                <li>
                    <a href="/bestMatkulFinder" className={styles.navbarLinks}>
                        Best Matkul Finder
                    </a>
                </li>
            </ul>
        </nav>
    )
}
