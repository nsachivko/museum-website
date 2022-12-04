import { searchHistoryAtom, favouritesAtom } from '../store'
import { getFavourites, getHistory } from "../lib/userData"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { isAuthenticated } from '../lib/authenticate'
import { useRouter } from 'next/router'

export default function RouteGuard(props) {
    const PUBLIC_PATHS = ['/login', '/', '/_error', "/register"]
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom)
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)

    function authCheck(url) {
        // redirect to login page if accessing a private page and not logged in
        const path = url.split('?')[0]
        if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
            setAuthorized(false)
            router.push('/login')
        } else {
            setAuthorized(true)
        }
    }


    const updateAtoms = async () => {
        setFavouritesList(await getFavourites() || [])
        setSearchHistory(await getHistory() || [])
    }

    useEffect(() => {


        // on initial load - run auth check
        authCheck(router.pathname)

        // on route change complete - run auth check
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeComplete', authCheck)
        }
    }, [])



    useEffect(() => {
        updateAtoms()
    }, [])

    return <>{authorized && props.children}</>
}