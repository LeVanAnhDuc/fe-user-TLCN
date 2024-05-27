export const calculateWeight = (quantityItem: number) => {
    if (quantityItem < 0) return 0;
    return (625 * (2 * quantityItem + 3)) / 5;
};
