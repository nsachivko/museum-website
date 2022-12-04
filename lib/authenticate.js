import jwt_decode from 'jwt-decode'

const setToken = (token) => {
    localStorage.setItem('access_token', token)
}

const getToken = () => {
    try {
        return localStorage.getItem('access_token')
    } catch (err) {
        return null
    }
}

const removeToken = () => {
    localStorage.removeItem('access_token')
}

const readToken = () => {
    try {
        const token = getToken()
        return token ? jwt_decode(token) : null
    } catch (err) {
        return null
    }
}

const isAuthenticated = () => {
    const token = readToken()
    return token ? true : false
}

const authenticateUser = async (user, password) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ userName: user, password: password }),
        headers: {
            'content-type': 'application/json',
        },
    })

    const data = await res.json()

    if (res.status === 200) {
        setToken(data.token)
        return true
    } else {
        throw new Error(data.message)
    }
}

const registerUser = async (user, password, password2) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        body: JSON.stringify({
            userName: user,
            password: password,
            password2: password2
        }),
        headers: {
            'content-type': 'application/json',
        },
    })

    if (res.status === 200)
        return true
    else {
        const { message } = await res.json()
        throw new Error(message)
    }
}

export {
    getToken,
    removeToken,
    readToken,
    isAuthenticated,
    authenticateUser,
    registerUser
}