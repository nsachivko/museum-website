import { registerUser } from "../lib/authenticate"
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Card, Form, Alert, Button } from 'react-bootstrap'

export default function Login(props) {
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [warning, setWarning] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (user.trim() === "")
                throw new Error("User is empty")

            if (password.trim() === "")
                throw new Error("Password is empty")

            if (password2.trim() === "")
                throw new Error("Second Password is empty")

            await registerUser(user, password, password2)
            router.push('/login')
        } catch (err) {
            setWarning(err.message)
        }
    }

    return (
        <>
            <Card bg="light">
                <Card.Body><h2>Register</h2>Enter your register information below:</Card.Body>
            </Card>
            <br />
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>User:</Form.Label>
                    <Form.Control type="text" value={user} id="userName" name="userName" onChange={e => setUser(e.target.value)} />
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" value={password} id="password" name="password" onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label>Repeat Password:</Form.Label>
                    <Form.Control type="password" value={password2} id="password2" name="password2" onChange={e => setPassword2(e.target.value)} />
                </Form.Group>
                <br />
                <Button variant="primary" className="pull-right" type="submit">Login</Button>
            </Form>
            {warning && (<><br /><Alert variant="danger">{warning}</Alert></>)}
        </>
    )
}