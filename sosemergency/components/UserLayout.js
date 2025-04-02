import Head from 'next/head';
import Link from 'next/link';

export default function UserLayout({ children }) {
  return (
    <>
      <Head>
        <title>My Dashboard</title>
        <meta name="description" content="User dashboard" />
      </Head>
      
      <nav className="main-nav">
        <div className="nav-container">
          <Link href="/dashboard" className="logo">
            MyApp
          </Link>
          <div className="nav-links">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/dashboard/profile">Profile</Link>
            <Link href="/dashboard/settings">Settings</Link>
          </div>
        </div>
      </nav>
      
      <main>{children}</main>
      
      <style jsx>{`
        .main-nav {
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          padding: 0 2rem;
        }
        
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 60px;
        }
        
        .logo {
          font-weight: bold;
          font-size: 1.25rem;
          color: #2b6cb0;
          text-decoration: none;
        }
        
        .nav-links {
          display: flex;
          gap: 1.5rem;
        }
        
        .nav-links a {
          color: #4a5568;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        
        .nav-links a:hover {
          color: #2b6cb0;
        }
        
        main {
          min-height: calc(100vh - 60px);
          background: #f7fafc;
        }
      `}</style>
    </>
  );
}