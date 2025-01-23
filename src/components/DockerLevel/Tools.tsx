import { FaArrowLeft, FaUndo } from 'react-icons/fa';
import { IoBookSharp } from 'react-icons/io5';

interface ToolsProps {
  onBack?: () => void;
  onReset?: () => void;
  onCheatsheet?: () => void;
}

const Tools: React.FC<ToolsProps> = ({ onBack, onReset, onCheatsheet }) => {
  return (
    <div className="bg-navy-800 p-4 border-b border-navy-600">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-white rounded-md font-medium transition-colors flex items-center space-x-2"
          >
            <FaArrowLeft className="text-blue-400" />
            <span>Back</span>
          </button>
          
          <button
            onClick={onReset}
            className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-white rounded-md font-medium transition-colors flex items-center space-x-2"
          >
            <FaUndo className="text-blue-400" />
            <span>Reset Level</span>
          </button>
        </div>

        <button
          onClick={onCheatsheet}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors flex items-center space-x-2"
        >
          <IoBookSharp className="text-white" />
          <span>Cheatsheet</span>
        </button>
      </div>
    </div>
  );
};

export default Tools;