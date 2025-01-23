import Topbar from "./Topbar";
import Console from "./Console";
import Tools from "./Tools";

const DockerLevel: React.FC = () => {
  const handleEnter = (input: string) => {
    console.log("User Input:", input);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 to-navy-700 text-white flex flex-col">
      <Topbar levelName="Docker Level" onEnter={handleEnter} />
      <main className="flex-1 p-4 bg-navy-800 bg-opacity-50 rounded-tl-lg rounded-tr-lg overflow-auto">
        <Console />
        <Tools />
      </main>
    </div>
  );
};

export default DockerLevel;
