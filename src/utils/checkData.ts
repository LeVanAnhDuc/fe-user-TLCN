// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const objectsAreEqual = (obj1: { [key: string]: any }, obj2: { [key: string]: any }): boolean => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        if (obj1[key].trim() !== obj2[key].trim()) {
            return false;
        }
    }

    return true;
};
