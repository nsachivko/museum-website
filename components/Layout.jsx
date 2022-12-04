import MainNav from "./MainNav"
import { Container } from 'react-bootstrap'

const Layout = (props) => {
    const { children } = props

    return (
        <div className="default-mode">
            <div className="mb-5">
                <MainNav />
            </div>
            <br />
            <br />
            <br />
            <Container>
                {children}
            </Container>
            <br />
        </div>
    )
}

export default Layout