export const formatSessionTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const day = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const hours24 = date.getHours();
    const ampm = hours24 >= 12 ? "pm" : "am";
    const displayHours =
        hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;
    return `${day} ${dayOfMonth} ${month}, ${displayHours}${ampm}`;
};
