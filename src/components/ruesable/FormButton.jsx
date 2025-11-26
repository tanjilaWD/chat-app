import React from 'react';
import { FaSpinner } from "react-icons/fa";

const FormButton = ({ loading, text, loadingText }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-pink-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex justify-center items-center"
  >
    {loading ? (
      <span className="flex items-center gap-2">
        <FaSpinner className="animate-spin" />
        {loadingText}
      </span>
    ) : (
      text
    )}
  </button>
);

export default FormButton;
