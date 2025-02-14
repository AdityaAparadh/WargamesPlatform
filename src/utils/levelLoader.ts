import runCommand from "./runCommand";
import levels from "../../levels/DockerLevels.json";
import type { Page } from "../hooks/usePage";

export let currentLevel = 0;
export let currentRunScript = "";

export async function loadLevel(level: number, setPage: (p: Page) => void): Promise<void> {
  currentLevel = level;

  if (level % 2 === 0) {
    setPage('KubernetesLevel');
    return;
  }
  const lvlData = levels.find((l: any) => l.level === level);
  if (!lvlData) {
    console.error("Level data not found for level", level);
    return;
  }
  setPage('LoadingPage');
  currentRunScript = lvlData.runScriptPath;
  try {
    await runCommand(lvlData.preloadScriptPath);
  } catch (e) {
    console.error("Preload failed", e);
  }
  setPage('DockerLevel');
}

export async function cleanupLevel(level: number, setPage: (p: Page) => void): Promise<void> {
  const lvlData = levels.find((l: any) => l.level === level);
  if (!lvlData) return;
  setPage('LoadingPage');
  try {
    await runCommand(lvlData.cleanupScriptPath);
  } catch (e) {
    console.error("Cleanup failed", e);
  }
  setPage('MainPage');
}

export async function restartLevel(level: number, setPage: (p: Page) => void): Promise<void> {
  const lvlData = levels.find((l: any) => l.level === level);
  if (!lvlData) return;
  setPage('LoadingPage');
  try {
    await runCommand(lvlData.cleanupScriptPath);
    await runCommand(lvlData.preloadScriptPath);
  } catch (e) {
    console.error("Restart failed", e);
  }
  currentRunScript = lvlData.runScriptPath;
  setPage('DockerLevel');
}
