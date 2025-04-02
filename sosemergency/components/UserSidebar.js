export default function Sidebar({ selectedPage, onPageChange }) {
    return (
      <div style={{ width: '250px', background: '#222', color: 'white', padding: '20px', height: '100vh' }}>
        <h2>Admin Panel</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li
              style={{
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: selectedPage === 'analytics' ? '#444' : 'transparent'
              }}
              onClick={() => onPageChange('analytics')}
            >
              📊 Analytics
            </li>
            <li
              style={{
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: selectedPage === 'stations' ? '#444' : 'transparent'
              }}
              onClick={() => onPageChange('stations')}
            >
              🏢 Manage Stations
            </li>
            <li
              style={{
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: selectedPage === 'rescues' ? '#444' : 'transparent'
              }}
              onClick={() => onPageChange('rescues')}
            >
              🚑 Manage Rescues
            </li>
            <li
  style={{ backgroundColor: selectedPage === 'users' ? '#444' : 'transparent' }}
  onClick={() => onPageChange('users')}
>
  👥 Manage Users
</li>

          </ul>
        </nav>
      </div>
    );
  }
  