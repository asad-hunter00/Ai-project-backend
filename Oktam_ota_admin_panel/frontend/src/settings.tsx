import { createContext, useContext } from "react";
import { initialContent } from "./data/content";
import type { Settings } from "./types";
export const SettingsContext = createContext<Settings>(initialContent.settings);
export const useSettings = () => useContext(SettingsContext);
