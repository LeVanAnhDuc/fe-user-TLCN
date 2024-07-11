// libs
import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

/**
 * `useIsFirstRender` is a custom hook that keeps track of whether the component
 * is rendering for the first time. It returns `true` during the first render
 * and `false` for subsequent renders.
 *
 * @returns {boolean} - Returns `true` if it's the first render, `false` otherwise.
 */
const useIsFirstRender = () => {
    const firstRender = useRef(true);
    if (firstRender.current === true) {
        firstRender.current = false;
        return true;
    }
    return firstRender.current;
};

/**
 * `useUpdateEffect` is a custom hook that allows you to run an effect (callback)
 * starting from the second render onwards. It uses `useIsFirstRender` to ensure
 * the callback only runs when it's not the first render.
 *
 * @param {Function} callback - The callback function to be called when all dependencies are valid.
 * @param {Array} deps - An array of dependencies to be checked. The effect will run when these dependencies change.
 */

const useUpdateEffect = (callback: EffectCallback, deps?: DependencyList) => {
    const ref = useIsFirstRender();

    useEffect(() => {
        !ref && callback();
    }, deps);
};

export default useUpdateEffect;
