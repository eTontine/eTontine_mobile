export function specialDates() {
    // Obtenir la date actuelle
    const currentDate = new Date();

    // Obtenir la date d'hier
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    const firstDayYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), 1);
    const lastDayYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth() + 1, 0);

    // Obtenir la date du mois passé
    const lastMonth = new Date(currentDate);
    lastMonth.setMonth(currentDate.getMonth() - 1);
    const firstDayLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const lastDayLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);

    // Obtenir la date de la semaine passée
    const lastWeek = new Date(currentDate);
    lastWeek.setDate(currentDate.getDate() - 7);
    const firstDayLastWeek = new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate() - lastWeek.getDay());
    const lastDayLastWeek = new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate() - lastWeek.getDay() + 6);

    // Obtenir la date de demain
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    const firstDayTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1);
    const lastDayTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth() + 1, 0);

    // Obtenir la date de la semaine prochaine
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);
    const firstDayNextWeek = new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() - nextWeek.getDay());
    const lastDayNextWeek = new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() - nextWeek.getDay() + 6);

    // Obtenir la date du mois prochain
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);
    const firstDayNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
    const lastDayNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);

    return {
        lastMonth: { firstDay: firstDayLastMonth, lastDay: lastDayLastMonth },
        lastWeek: { firstDay: firstDayLastWeek, lastDay: lastDayLastWeek },
        yesterday: { firstDay: firstDayYesterday, lastDay: lastDayYesterday },
        today: { firstDay: new Date(), lastDay: new Date() },
        tomorrow: { firstDay: firstDayTomorrow, lastDay: lastDayTomorrow },
        nextWeek: { firstDay: firstDayNextWeek, lastDay: lastDayNextWeek },
        nextMonth: { firstDay: firstDayNextMonth, lastDay: lastDayNextMonth },
    };
}

export function dateFormater(date, separator) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }


    return day + separator + month + separator + year;
}

export const formatDate = (date) => {
    return dateFormater(date, "-")
}

export const formatDateYYYYMMDD = (date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }


    return year + '-' + month + '-' + day;
}

export const formatDateToString = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return  new Date(date).toLocaleDateString(undefined, options);
}

export const getDate = (dateString) => {
    return new Date(dateString)
}