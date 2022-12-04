import { getToken } from './authenticate'

const addToFavourites = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            _id: id
        }),
        headers: {
            'Authorization': getToken(),
        },
    })

}

const removeFromFavourites = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({
            _id: id
        }),
        headers: {
            'Authorization': getToken(),
        },
    })


}

const getFavourites = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites`, {
        method: 'GET',
        headers: {
            'Authorization': getToken(),
        },
    })

    if (res.status === 200) {
        const favourites = await res.json()
        return favourites
    }

}

const addToHistory = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            _id: id
        }),
        headers: {
            'Authorization': getToken(),
        },
    })
}

const removeFromHistory = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, {
        method: 'DELETE',
        body: JSON.stringify({
            _id: id
        }),
        headers: {
            'Authorization': getToken(),
        },
    })
}



const getHistory = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history/`, {
        method: 'GET',
        headers: {
            'Authorization': getToken(),
        },
    })


    if (res.status === 200) {
        const history = await res.json()
        return history
    }
}

export {
    addToFavourites,
    getFavourites,
    getHistory,
    removeFromFavourites,
    addToHistory,
    removeFromHistory
}