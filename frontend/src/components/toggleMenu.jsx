import Button from '@mui/material/Button';
const ToggleMenu = ({ mode, setMode }) => {
    return (
        <div>
            <Button onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
                Toggle Theme
            </Button>
        </div>
    );
}

export default ToggleMenu;