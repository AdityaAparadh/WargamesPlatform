import Topbar from "./Topbar";
import Console from "./Console";
import Tools from "./Tools";

// Add a prop interface so we can receive an onBack callback and pass it to Tools.
interface DockerLevelProps {
  onBack?: () => void;
}

const DockerLevel: React.FC<DockerLevelProps> = ({ onBack }) => {
  const handleEnter = (input: string) => {
    console.log("User Input:", input);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 to-navy-700 text-white flex flex-col">
      <Topbar levelName="Docker Level" onEnter={handleEnter} />
      <main className="flex-1 p-4 bg-navy-800 bg-opacity-50 rounded-tl-lg rounded-tr-lg overflow-auto">
        <Console />
        {/* Pass the onBack callback to Tools */}
        <Tools onBack={onBack} />
      </main>
    </div>
  );
};

export default DockerLevel;
