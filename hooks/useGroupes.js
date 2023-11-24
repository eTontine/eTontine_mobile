import {useEffect, useState} from "react";
import {useGetGroupesQuery, useGetTontinerGroupesQuery} from "../store/features/group/group.services";



export const useGroupes = ({tontinier='', search ='', page = 1, user, isTontiner}) => {

    const limit = 10
    const [tontinerGroupes, setTontinerGroupes] = useState([])
    const [associateGroupes, setAssociateGroupes] = useState([])
    const [pages, setPages] = useState(0)
    const [loading, setLoading] = useState(false)

    const {isFetching: loadingGroupes, data: groupData} = useGetGroupesQuery({tontinier,search, page, user, limit}, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
    })

    const {isFetching: loadingNextGroupes, data: groupNextData} = useGetGroupesQuery({tontinier,search, page, user, limit}, {
        skip: page <= 1 || !user
    })

    const {isFetching: loadingTontinerGroupes, data: tontinerGroupData} = useGetTontinerGroupesQuery({id:user}, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
    })

    const {isFetching: loadingNextTontinerGroupes, data: tontinerNextGroupData} = useGetTontinerGroupesQuery({id:user}, {skip: !isTontiner || !user})

    useEffect(() => {
        setLoading(loadingGroupes || loadingTontinerGroupes
            || loadingNextTontinerGroupes || loadingNextGroupes
        )
    }, [loadingGroupes, loadingNextGroupes, loadingTontinerGroupes, loadingNextTontinerGroupes])


    useEffect(() => {
        setTontinerGroupes(tontinerGroupData?.data)
    }, [tontinerGroupData]);

    useEffect(() => {
        setAssociateGroupes(groupData?.data)
    }, [groupData]);



    const resetGroupes = () =>{
       setAssociateGroupes([]);
       setTontinerGroupes([]);
    }

    return { loading, pages, tontinerGroupes, associateGroupes, resetGroupes}
}