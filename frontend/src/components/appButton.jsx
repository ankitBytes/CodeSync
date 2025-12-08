const AppButton = ({ variant, onClick, icon, disabled, loading }) => {
    return (
        <button
            className={`app-button ${variant}`}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading ? <span className="loader"></span> : icon}
        </button>
    );
};

export default AppButton;