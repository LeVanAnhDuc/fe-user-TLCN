export const convertNumberToVND = (textToConvert?: number) => {
    if (textToConvert) return textToConvert.toLocaleString('vi-VN');
    else return 0;
};
