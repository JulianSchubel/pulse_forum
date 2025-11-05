export const generateRandomNumber = (min: number, max: number) => {
    let multiplier = 1;
    let n = max - min;
    while(multiplier <= n) {
        multiplier *= 10;
    }
    return (min + (Math.floor(Math.random() * multiplier) % (max - min)));
}
