import { createContext, useContext } from 'react';

// Context to allow children to close the dropdown
export const DropdownCloseContext = createContext<(() => void) | null>(null);

export const useDropdownClose = () => useContext(DropdownCloseContext);

// Context to control dropdown direction (for mobile menu)
export const DropdownDirectionContext = createContext<'up' | 'down'>('up');

export const DropdownDirectionProvider = DropdownDirectionContext.Provider;

type DropdownOpenListener = (id: string) => void;

const dropdownOpenListeners = new Set<DropdownOpenListener>();

export const subscribeToDropdownOpen = (listener: DropdownOpenListener) => {
  dropdownOpenListeners.add(listener);
  return () => {
    dropdownOpenListeners.delete(listener);
  };
};

export const notifyDropdownOpened = (id: string) => {
  dropdownOpenListeners.forEach((listener) => listener(id));
};
