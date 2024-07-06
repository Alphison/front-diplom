export const useFormat = (price:number) => {
    return new Intl.NumberFormat("ru-RU").format(price)
}