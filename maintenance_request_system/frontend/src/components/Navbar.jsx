import { Link } from 'react-router-dom'

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold">
              Sistema de Manutenção
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link 
                to="/dashboard" 
                className="hover:bg-blue-700 px-3 py-2 rounded"
              >
                Dashboard
              </Link>
              
              <Link 
                to="/nova-requisicao" 
                className="hover:bg-blue-700 px-3 py-2 rounded"
              >
                Nova Requisição
              </Link>
              
              <Link 
                to="/minhas-requisicoes" 
                className="hover:bg-blue-700 px-3 py-2 rounded"
              >
                Minhas Requisições
              </Link>
              
              {(user?.profile_type === 'MANUTENCAO' || user?.profile_type === 'GESTOR' || user?.profile_type === 'TI') && (
                <Link 
                  to="/requisicoes" 
                  className="hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Todas as Requisições
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              Olá, {user?.username}
            </span>
            <span className="text-xs bg-blue-500 px-2 py-1 rounded">
              {user?.profile_type}
            </span>
            <button 
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

