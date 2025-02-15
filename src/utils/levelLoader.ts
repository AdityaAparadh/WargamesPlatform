import runCommand from "./runCommand";
import levels from "../../levels/DockerLevels.json";
import type { Page } from "../hooks/usePage";

export let currentLevel = 0;
export let currentRunScript = "";

/**
 * Load a docker level by running preload script
 * @param level Level number
 * @param setPage Page setter function 
 */
export async function loadLevel(level: number, setPage: (p: Page) => void): Promise<void> {
  currentLevel = level;

  // if (level % 2 === 0) {
  //   setPage('KubernetesLevel');
  //   return;
  // }


  const lvlData = levels.find((l: any) => l.level === level);
  if (!lvlData) {
    console.error("Level data not found for level", level);
    return;
  }
  setPage('LoadingPage');
  currentRunScript = lvlData.runScriptPath;
  try {
    const PATH = `$WARGAMES_PATH/` + lvlData.preloadScriptPath;
    console.log("PRELOAD PATH: " + PATH);
    // await runCommand( `$WARGAMES_PATH/` + lvlData.preloadScriptPath);
    await runCommand(PATH);
  } catch (e) {
    console.error("Preload failed", e);
  }
  setPage('DockerLevel');
}
/**
 * Cleanup a docker level by running cleanup script
 * @param level Level number
 * @param setPage Page setter function 
 * @returns 
 */
export async function cleanupLevel(level: number, setPage: (p: Page) => void): Promise<void> {
  const lvlData = levels.find((l: any) => l.level === level);
  if (!lvlData) return;
  setPage('LoadingPage');
  try {
    console.log(lvlData.cleanupScriptPath);
    await runCommand( `$WARGAMES_PATH/` + lvlData.cleanupScriptPath);
  } catch (e) {
    console.error("Cleanup failed", e);
  }
  setPage('MainPage');
}
/**
 * Restart a level by running cleanup and then preload 
 * @param level Level number
 * @param setPage Page setter function 
 * @returns 
 */
export async function restartLevel(level: number, setPage: (p: Page) => void): Promise<void> {
  const lvlData = levels.find((l: any) => l.level === level);
  if (!lvlData) return;
  setPage('LoadingPage');
  try {

    console.log(lvlData.cleanupScriptPath);
    await runCommand(`$WARGAMES_PATH/` + lvlData.cleanupScriptPath);
    await runCommand( `$WARGAMES_PATH/` + lvlData.preloadScriptPath);
  } catch (e) {
    console.error("Restart failed", e);
  }
  currentRunScript = lvlData.runScriptPath;
  setPage('DockerLevel');
}
