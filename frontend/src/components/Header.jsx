import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/home" className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
              <span className="text-indigo-600">Modern</span>Blog
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/home" 
              className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              activeClassName="text-indigo-600"
            >
              Home
            </Link>
            <Link 
              to="/profile" 
              className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              activeClassName="text-indigo-600"
            >
              Profile
            </Link>
          </nav>
          
          <div className="flex items-center">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;