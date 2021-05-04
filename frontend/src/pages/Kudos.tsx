import Navbar from '../components/Navbar'
import Link from 'next/link'
import classes from '../styles/Kudos.module.scss';

export default function Kudos() {
    return (

        <div>
            <Navbar />
            <Link href="/ChooseTheme">
                <a className={classes.addButton}>+</a>
            </Link>
        </div>
    )
}
