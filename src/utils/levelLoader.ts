import axios from "axios";
import runCommand from "./runCommand";
import levels from "../../levels/DockerLevels.json";
import type { Page } from "../hooks/usePage";
import config from "../../config.json";

export let currentLevel = 0;
export let currentRunScript = "";
export let currentLevelName = ""; // Add this line to expose the level name

// Update the interface to include levelName
interface LevelData {
  preload: string[];
  run: string[];
  cleanup: string[];
  levelName: string; // Add levelName to the interface
}

async function fetchLevel(token: string): Promise<LevelData | null> {
  try {
    const res = await axios.get(
      config.BACKEND_URI + "/level/getLevel",
      { headers: { Authorization: `${token}` }}
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching level", error);
    return null;
  }
}

// Helper function to run an array of commands
async function runCommands(commands: string[]): Promise<void> {
  for (const command of commands) {
    await runCommand(command);
  }
}

/**
 * Load a docker level by running preload script
 * @param level Level number
 * @param setPage Page setter function
 */
export async function loadLevel(
  level: number,
  token: string,
  setPage: (p: Page) => void,
): Promise<void> {
  currentLevel = level;
  setPage("LoadingPage");
  
  try {
    // Get dynamic level data from backend
    const levelData = await fetchLevel(token);
    if (!levelData) {
      console.error("Failed to fetch level data");
      setPage("MainPage");
      return;
    }
    
    // Store run script for later use
    currentRunScript = levelData.run.join("\n");
    currentLevelName = levelData.levelName; // Store the level name
    
    // Run cleanup first to ensure clean environment
    await runCommands(levelData.cleanup);
    
    // Run preload commands
    await runCommands(levelData.preload);
    
    setPage("DockerLevel");
  } catch (e) {
    console.error("Preload failed", e);
    setPage("MainPage");
  }
}

/**
 * Cleanup a docker level by running cleanup script
 * @param level Level number
 * @param setPage Page setter function
 * @returns
 */
export async function cleanupLevel(
  level: number,
  token: string,
  setPage: (p: Page) => void,
): Promise<void> {
  setPage("LoadingPage");
  
  try {
    const levelData = await fetchLevel(token);
    if (!levelData) {
      console.error("Failed to fetch level data");
      setPage("MainPage");
      return;
    }
    
    await runCommands(levelData.cleanup);
    setPage("MainPage");
  } catch (e) {
    console.error("Cleanup failed", e);
    setPage("MainPage");
  }
}

/**
 * Restart a level by running cleanup and then preload
 * @param level Level number
 * @param setPage Page setter function
 * @returns
 */
export async function restartLevel(
  level: number,
  token: string,
  setPage: (p: Page) => void,
): Promise<void> {
  setPage("LoadingPage");
  
  try {
    const levelData = await fetchLevel(token);
    if (!levelData) {
      console.error("Failed to fetch level data");
      setPage("MainPage");
      return;
    }
    
    // Run cleanup commands
    await runCommands(levelData.cleanup);
    
    // Run preload commands
    await runCommands(levelData.preload);
    
    // Store run script and level name for later use
    currentRunScript = levelData.run.join("\n");
    currentLevelName = levelData.levelName; // Update the level name on restart too
    
    setPage("DockerLevel");
  } catch (e) {
    console.error("Restart failed", e);
    setPage("MainPage");
  }
}
