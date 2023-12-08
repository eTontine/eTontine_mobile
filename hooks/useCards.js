import {useEffect, useState} from "react";
import {
    useGetCardsQuery,
    useGetNextCardsQuery,
    useGetNextTontinerCardsQuery,
    useGetTontinerCardsQuery
} from "../store/features/card/card.services";



export const useCards = ({tontinier='', search ='', page, user, isTontiner, start_date, end_date}) => {

    const limit = 10
    const [tontinerCards, setTontinerCards] = useState([])
    const [associateCards, setAssociateCards] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const [loading, setLoading] = useState(false)

    console.log("associatePage", page)

    const {isFetching: loadingCards, data: cardData} = useGetCardsQuery({tontinier,search, user, limit}, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        skip: !tontinier && !user
    })

    const {isFetching: loadingNextCards, data: cardNextData} = useGetNextCardsQuery({tontinier,search, page, user, limit}, {
        skip: page <= 1 || !tontinier && !user
    })

    const {isFetching: loadingTontinerCards, data: tontinerCardData} = useGetTontinerCardsQuery({id:tontinier, search, limit, start_date, end_date}, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        skip: !isTontiner || !tontinier
    })

    useEffect(() => {
        setLoading(loadingCards || loadingNextCards
            || loadingTontinerCards)
    }, [loadingCards, loadingNextCards, loadingTontinerCards])

    useEffect(() => {
        setTontinerCards(tontinerCardData?.data)
    }, [tontinerCardData]);

    useEffect(() => {
        setAssociateCards(cardData?.data)
        console.log(associateCards)
        setTotalPage(cardData?.total_pages)
    }, [cardData]);

    useEffect(() => {
        if (cardNextData && cardNextData?.data?.length > 0) {
            console.log("add")
            setAssociateCards([...associateCards, ...cardNextData.data])
        }
    }, [cardNextData]);

    const resetCards = () => {
        setTontinerCards([]);
        setAssociateCards([]);
    }


    return { loading, totalPage, tontinerCards, associateCards, resetCards}
}