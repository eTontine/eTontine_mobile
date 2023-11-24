import { specialDates } from "../utils/date"

export const useCustomDate = () => {

   const dates = specialDates


    const CUSTOM_DATES = {
        lastMonth: {label:'lastMonth', startDate: dates["lastMonth"]?.firstDay, endDate:  dates["lastMonth"]?.lastDay},
        lastWeek: {label:'lastWeek', startDate: dates["lastWeek"]?.firstDay, endDate:  dates["lastWeek"]?.lastDay},
        yesterday: {label:'yesterday', startDate: dates["yesterday"]?.firstDay, endDate:  dates["yesterday"]?.lastDay},
        today: {label:'today', startDate: dates["today"]?.firstDay, endDate:  dates["today"]?.lastDay},
    }  

    return {CUSTOM_DATES}
}