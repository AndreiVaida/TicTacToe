import { useState } from 'react';
import type { Difficulty } from '../../model/GameModels';

export type DropdownProps = {
    options: Difficulty[];
    defaultValue: Difficulty;
    onChange: (value: Difficulty) => void;
}

export const Dropdown = ({ options, defaultValue, onChange}: DropdownProps) => {
    const [selected, setSelected] = useState(defaultValue);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDifficulty = e.target.value as Difficulty;
        setSelected(newDifficulty);
        onChange(newDifficulty);
    };

    return (
        <select value={selected} onChange={handleChange}>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};