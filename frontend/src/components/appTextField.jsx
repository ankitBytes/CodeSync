const AppTextField = ({ label, value, onChange, type, multiline, error }) => {
    return (
        <div className="app-text-field">
        <label className="app-text-field__label">{label}</label>
        {multiline ? (
            <textarea
            className={`app-text-field__input ${error ? 'error' : ''}`}
            value={value}
            onChange={onChange}
            />
        ) : (
            <input
            type={type || 'text'}
            className={`app-text-field__input ${error ? 'error' : ''}`}
            value={value}
            onChange={onChange}
            />
        )}
        {error && <span className="app-text-field__error">{error}</span>}
        </div>
    );
}

export default AppTextField;