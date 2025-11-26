import React from 'react';

const InputField = ({id, label, type, value, onChange, placeholder}) => (
    <div className='mb-4'>
        <label htmlFor={id} className='block text-gray-700 mb-2'>
            {label}
        </label>
        <input 
        type={type}
        name={id}
        id={id}
        value={value}
        onChange={onChange}
        className='w-full p-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent' 
        placeholder={placeholder}
        />

    </div>
)

export default InputField;