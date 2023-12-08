import {useEffect, useState} from "react";
import {
    useGetGroupesQuery,
    useGetNextGroupesQuery,
    useGetTontinerGroupesQuery
} from "../store/features/group/group.services";



export const useGroupes = ({tontinier='', search ='', tontinerGroupPage, associateGroupPage, user, isTontiner, start_date, end_date}) => {
    const limit = 10
    const [tontinerGroupes, setTontinerGroupes] = useState([])
    const [associateGroupes, setAssociateGroupes] = useState([])
    const [tontinerGroupPages, setTontinerGroupPages] = useState(0)
    const [associateGroupPages, setAssociateGroupPages] = useState(0)
    const [loading, setLoading] = useState(false)


    const {isFetching: loadingGroupes, data: groupData} = useGetGroupesQuery({tontinier,search, user, limit, start_date, end_date}, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        skip: !tontinier && !user || isTontiner
    })

    const {isFetching: loadingNextGroupes, data: groupNextData} = useGetNextGroupesQuery({tontinier,search, page: associateGroupPage, user, limit, start_date, end_date}, {
        skip: associateGroupPage <= 1 || !tontinier && !user || isTontiner
    })

    const {isFetching: loadingTontinerGroupes, data: tontinerGroupData} = useGetTontinerGroupesQuery({id:tontinier, search, limit, start_date, end_date}, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        skip: !isTontiner || !tontinier
    })

    const {isFetching: loadingNextTontinerGroupes, data: tontinerNextGroupData} = useGetTontinerGroupesQuery({id:tontinier, page: tontinerGroupPage, search, limit, start_date, end_date}, {
        skip: !isTontiner || !user || tontinerGroupPage <= 1
    })

    useEffect(() => {
        setLoading(loadingGroupes || loadingTontinerGroupes
            || loadingNextTontinerGroupes || loadingNextGroupes
        )
    }, [loadingGroupes, loadingNextGroupes, loadingTontinerGroupes, loadingNextTontinerGroupes])


    useEffect(() => {
        setTontinerGroupes(tontinerGroupData?.data)
        setTontinerGroupPages(setTontinerGroupes?.total_pages)
    }, [tontinerGroupData]);

    useEffect(() => {
        setAssociateGroupes(groupData?.data)
        setAssociateGroupPages(groupData?.total_pages)
    }, [groupData]);


    useEffect(() => {
        if (tontinerNextGroupData && tontinerNextGroupData?.data?.length > 0) {
            setTontinerGroupes([...tontinerGroupes, ...tontinerNextGroupData.data])
        }
    }, [tontinerNextGroupData]);

    useEffect(() => {
        if (groupNextData && groupNextData?.data?.length > 0) {
            setAssociateGroupes([...associateGroupes, ...groupNextData.data])
        }
    }, [groupNextData]);


    const resetGroupes = () =>{
       setAssociateGroupes([]);
       setTontinerGroupes([]);
    }

    return { loading, tontinerGroupPages, associateGroupPages, tontinerGroupes, associateGroupes, resetGroupes}
}