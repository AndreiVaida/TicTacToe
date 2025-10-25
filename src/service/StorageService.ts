import type { Theme } from "../model/Theme";

const LocalStorageThemeKey = "theme";

export class StorageService {
    public getTheme = (): Theme | null => {
        const savedTheme = localStorage.getItem(LocalStorageThemeKey);
        return savedTheme as Theme || null;
    };

    public saveTheme = (theme: Theme): void => {
        localStorage.setItem(LocalStorageThemeKey, theme);
    };
};