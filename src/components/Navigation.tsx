import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>HabitTracker</h1>
        </div>
        <div className="nav-links">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Дашборд
          </Link>
          <Link 
            to="/habits" 
            className={location.pathname === '/habits' ? 'active' : ''}
          >
            Привычки
          </Link>
          <Link 
            to="/analytics" 
            className={location.pathname === '/analytics' ? 'active' : ''}
          >
            Аналитика
          </Link>
          <Link 
            to="/profile" 
            className={location.pathname === '/profile' ? 'active' : ''}
          >
            Профиль
          </Link>
          <Link 
            to="/chat" 
            className={location.pathname === '/chat' ? 'active' : ''}
          >
            чат
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;