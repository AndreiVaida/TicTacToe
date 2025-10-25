import { useEffect, useMemo, useState } from "react";
import { Toggle } from "./Toggle";
import { StorageService } from "../../service/StorageService";
import { Theme } from "../../model/Theme";

export const ThemeToggle = () => {
    const [theme, setTheme] = useState(Theme.Light);
    const storageService = useMemo(() => new StorageService(), []);

    useEffect(() => {
        const storedTheme = storageService.getTheme();
        if (storedTheme) {
            setTheme(storedTheme);
            setThemeIntoHtml(storedTheme);
        }
    }, [storageService]);

    const onThemeChange = () => {
        const newTheme = theme === Theme.Light ? Theme.Dark : Theme.Light;
        setTheme(newTheme);
        setThemeIntoHtml(newTheme);
        storageService.saveTheme(newTheme);
    };

    const isLightTheme = theme === Theme.Light;

    const text = `${isLightTheme ? "☀️" : "🌙"}`;

    return (
        <Toggle
            ischecked={isLightTheme}
            onToggle={onThemeChange}
            text={text}
        />
    );
};

const setThemeIntoHtml = (theme: Theme) => document.documentElement.setAttribute("data-theme", theme);