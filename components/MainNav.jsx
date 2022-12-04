import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import Dropdown from 'react-bootstrap/Dropdown'
import { useAtom } from 'jotai'
import { searchHistoryAtom } from "../store"
import { inputHistoryAtom } from "../store"
import { addToHistory, getHistory } from "../lib/userData"
import { removeToken, readToken } from "../lib/authenticate"

const MainNav = (props) => {
    const router = useRouter()
    const [inputHistory, setInputHistory] = useAtom(inputHistoryAtom)
    const [searchData, setSearchData] = useState(inputHistory)
    const [placeholder, setPlaceholder] = useState("Search")
    const [isMobile, setIsMobile] = useState()
    const [buttonErrorCSS, setButtonErrorCSS] = useState("light")
    const currentRoute = router.pathname
    const [isExpanded, setIsExpanded] = useState(false)
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)
    const token = readToken()

    const submitForm = async (e) => {
        e.preventDefault()
        if (!!searchData && searchData.trim() !== "" && searchData.length !== []) {
            setIsExpanded(!isExpanded)
            setPlaceholder("Search")
            setButtonErrorCSS("secondary")
            await addToHistory(`title=true&q=${searchData}`)
            const history = await getHistory()
            setSearchHistory(history)
            router.push("/artwork?title=true&q=" + searchData)
        } else {
            setPlaceholder("Should not be empty")
            setButtonErrorCSS("danger")
        }
    }

    const logout = () => {
        setIsExpanded(false)
        removeToken()
        router.push("/login")
    }

    useEffect(() => {
        setSearchData(inputHistory)
    }, [inputHistory])


    useEffect(() => {
        setIsMobile(window.innerWidth <= 768)
    }, [])

    return (
        <Navbar bg={"primary"} expand="lg" expanded={isMobile ? isExpanded : ""} className="fixed-top border-0">
            <Container className="bg-primary">
                <Navbar.Brand className="text-light">Nikita Sachivko</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-light" onClick={() => { setIsExpanded(!isExpanded) }} />
                <Navbar.Collapse id="basic-navbar-nav" className="bg-primary" >

                    <Nav className="me-auto bg-primary text-light">
                        <Link href="/" passHref >
                            <Nav.Link className={currentRoute === "/" ? "text-success" : "text-light"}
                                onClick={() => { setIsExpanded(!isExpanded) }}>Home</Nav.Link>
                        </Link>
                        {!!token && (
                            <Link href="/search" passHref>
                                <Nav.Link className={currentRoute === "/search" ? "text-success" : "text-light"}
                                    onClick={() => { setIsExpanded(!isExpanded) }}>Advanced Search</Nav.Link>
                            </Link>
                        )}
                        {!token && (
                            <>
                                <Link href="/register" passHref>
                                    <Nav.Link className={currentRoute === "/register" ? "text-success" : "text-light"}
                                        onClick={() => { setIsExpanded(!isExpanded) }}>Register</Nav.Link>
                                </Link>
                                <Link href="/login" passHref>
                                    <Nav.Link className={currentRoute === "/login" ? "text-success" : "text-light"}
                                        onClick={() => { setIsExpanded(!isExpanded) }}>Login</Nav.Link>
                                </Link>
                            </>
                        )
                        }
                    </Nav>

                    {!!token && (
                        <Form className="d-flex me-5" onSubmit={submitForm}>
                            <input value={searchData} onChange={(e) => setSearchData(e.target.value)}
                                className={`form-control me-${isMobile ? "3" : "2"}`} type="text" placeholder={placeholder}
                            ></input>
                            <button
                                className={`btn btn-${buttonErrorCSS} my-2 my-sm-0`} type="submit" >Search</button>
                        </Form>
                    )}

                    {!!token && (
                        <Dropdown className={`bg-primary ${isMobile ? "mt-3" : ""}`}>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                {!!token ? token.userName : "User Name"}
                            </Dropdown.Toggle>


                            <Dropdown.Menu>

                                <Dropdown.Item onClick={() => { setIsExpanded(!isExpanded) }}><Link href="/favourites" passHref >
                                    <Nav.Link>Favourites</Nav.Link>
                                </Link></Dropdown.Item>
                                <Dropdown.Item onClick={() => { setIsExpanded(!isExpanded) }}><Link href="/history" passHref >
                                    <Nav.Link>Search History</Nav.Link>
                                </Link></Dropdown.Item>

                                <Dropdown.Item onClick={() => { logout() }}><Link href="/history" passHref >
                                    <Nav.Link>Log out</Nav.Link>
                                </Link></Dropdown.Item>

                            </Dropdown.Menu>
                        </Dropdown>
                    )
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar >
    )
}

export default MainNav