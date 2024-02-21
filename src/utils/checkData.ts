export const checkUserNameAndEmail = (textToCheck: string) => {
    const regexUserName = /^(?:(?:\w{4,})|(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))$/;
    return regexUserName.test(textToCheck);
};

export const checkPassWord = (textToCheck: string) => {
    const regexPass = /^[a-zA-Z0-9]+$/;
    return regexPass.test(textToCheck);
};
