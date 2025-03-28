import './Header.css'

export default function Header({ onLogout }) {
    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="header-text">
                        <h1 className="header-title">
                            Simple To Do List
                        </h1>
                        <h3 className="header-subtitle">Today is awesome day. The weather is awesome, you are awesome too!</h3>
                    </div>
                    <button className="logout-button" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    )
}