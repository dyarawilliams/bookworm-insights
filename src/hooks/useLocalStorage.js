import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
    // State to store our value
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage
    const setValue = (value) => {
        try {
            // Allow value to be a function to match useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    };

    // If localStorage key changes, update the stored value
    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            setStoredValue(item ? JSON.parse(item) : initialValue);
        } catch (error) {
            console.error('Error reading updated localStorage:', error);
        }
    }, [key]); // Removed initialValue from dependency array

    return [storedValue, setValue];
}

export default useLocalStorage;