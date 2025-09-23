function getRemainingTimeMinute(remaining){
    const now = Date.now(); // current millisecond
    return (remaining - now) / 1000 / 60; // remaining reset time
}

module.exports = {
    getRemainingTimeMinute,
}