export function hoursToSeconds(hours,minutes,seconds) {
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}
export function secondsToHours(totalSeconds) {
    totalSeconds = Number(totalSeconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = (totalSeconds % 3600) % 60;
    return {hours,minutes,seconds};
}
