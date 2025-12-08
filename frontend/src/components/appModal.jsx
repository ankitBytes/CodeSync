const AppModal = ({ open, onClose, title, children, actions }) => {
    return (
        <div className={`app-modal ${open ? 'open' : ''}`}>
        <div className="modal-content">
            <header className="modal-header">
            <h2>{title}</h2>
            <button className="close-button" onClick={onClose}>×</button>
            </header>
            <div className="modal-body">
            {children}
            </div>
            {actions && (
            <footer className="modal-footer">
                {actions.map((action, index) => (
                <button key={index} onClick={action.onClick}>
                    {action.label}
                </button>
                ))}
            </footer>
            )}
        </div>
        </div>
    );
}

export default AppModal;