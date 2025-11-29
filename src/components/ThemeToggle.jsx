import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { HiSun } from 'react-icons/hi';
import { LuMoon } from 'react-icons/lu';

const ThemeToggle = () => {
    const {theme, toggleTheme} = useTheme();
    return (
       <button
       onClick={toggleTheme}
       className='p-2 rounded-full bg-gray-200 dark:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
       aria-label='Toggle dark mode'>
        {theme === 'light'? (
            <HiSun className='size-5'/>
        ) :(
            <LuMoon className='size-5'/>
        )  }

       </button>
       
    );
};

export default ThemeToggle;