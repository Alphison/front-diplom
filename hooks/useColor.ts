export function getColorByPercentage(percentage: number) {
  let red = 155;
  let green = 0;
  
  if (percentage > 50) {
    green = Math.round(5.1 * percentage);
  } else {
    red = Math.round(510 - 5.1 * percentage);
  }

  return `rgb(${red}, ${green}, 0)`;
}