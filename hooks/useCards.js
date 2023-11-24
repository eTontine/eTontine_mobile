import {useEffect, useState} from "react";
import {useGetCardsQuery, useGetTontinerCardsQuery} from "../store/features/card/card.services";



export const useCards = ({tontinier='', search ='', page, user, isTontiner}) => {

    const limit = 10
    const [tontinerCards, setTontinerCards] = useState([])
    const [associateCards, setAssociateCards] = useState([])
    const [pages, setPages] = useState(0)
    const [loading, setLoading] = useState(false)

    const {isFetching: loadingCards, data: cardData} = useGetCardsQuery({tontinier,search, user, limit}, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
    })

    const {isFetching: loadingNextCards, data: cardNextData} = useGetCardsQuery({tontinier,search, page, user, limit}, {
        skip: page <= 1 || !user
    })

    const {isFetching: loadingTontinerCards, data: tontinerCardData} = useGetTontinerCardsQuery({id:user}, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
    })

    const {isFetching: loadingNextTontinerCards, data: tontinerNextCardData} = useGetTontinerCardsQuery({id:user}, {skip: !isTontiner || !user})

    useEffect(() => {
        setLoading(loadingCards || loadingNextCards
            || loadingTontinerCards || loadingNextTontinerCards)
    }, [loadingCards, loadingNextCards, loadingTontinerCards, loadingNextTontinerCards])

    useEffect(() => {
        setTontinerCards(tontinerCardData?.data)
    }, [tontinerCardData]);

    useEffect(() => {
        setAssociateCards(cardData?.data)
    }, [cardData]);

    // useEffect(() => {
    //     if (tontinerNextCardData && tontinerNextCardData.length > 0) {
    //         setTontinerCards([...tontinerCards, ...tontinerNextCardData])
    //     }
    // }, [tontinerNextCardData]);
    //
    // useEffect(() => {
    //     if (cardNextData && cardNextData.length > 0) {
    //         setAssociateCards([...associateCards, ...cardNextData])
    //     }
    // }, [cardNextData]);

    const resetCards = () => {
        setTontinerCards([]);
        setAssociateCards([]);
    }


    return { loading, pages, tontinerCards, associateCards, resetCards}
}