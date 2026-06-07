export type ToggleProps = {
    ischecked: boolean;
    onToggle: () => void;
    text: string;
}

export const Toggle = ({ischecked, onToggle, text}: ToggleProps) => (
    <div className="toggle-wrapper">
        <label className="toggle">
            <input
                type="checkbox"
                checked={ischecked}
                onChange={onToggle} />
            <span className="slider" />
        </label>
        {text && <span className="toggle-label">{text}</span>}
    </div>
);