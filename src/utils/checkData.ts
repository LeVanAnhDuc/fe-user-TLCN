export const objectsAreEqual = (obj1: object, obj2: object): boolean => {
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true;
    } else {
        return false;
    }
};
