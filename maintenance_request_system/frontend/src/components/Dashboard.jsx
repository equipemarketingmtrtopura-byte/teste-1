import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { requestsAPI } from '../services/api'

const Dashboard = ({ user }) => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Simulação de dados do dashboard
      const mockData = {
        total_requests: 25,
        open_requests: 8,
        completed_requests: 17,
        my_requests_count: 5,
        my_open_requests: 2,
        recent_requests: [
          {
            numero_requisicao: 1,
            titulo_curto: 'Reparo na prensa hidráulica',
            status: 'ABERTA',
            data_criacao: '2024-01-15T10:30:00Z',
            solicitante: { username: 'joao.silva' }
          },
          {
            numero_requisicao: 2,
            titulo_curto: 'Manutenção preventiva rosqueadeira',
            status: 'EM_ATENDIMENTO',
            data_criacao: '2024-01-14T14:20:00Z',
            solicitante: { username: 'maria.santos' }
          }
        ]
      }
      setDashboardData(mockData)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'ABERTA': 'bg-yellow-100 text-yellow-800',
      'VISUALIZADA': 'bg-blue-100 text-blue-800',
      'ACEITA': 'bg-green-100 text-green-800',
      'EM_ATENDIMENTO': 'bg-orange-100 text-orange-800',
      'PARADA': 'bg-red-100 text-red-800',
      'CONCLUIDA': 'bg-gray-100 text-gray-800',
      'CANCELADA': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/nova-requisicao"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Nova Requisição
        </Link>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user?.profile_type === 'GESTOR' || user?.profile_type === 'TI' ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total de Requisições</h3>
              <p className="text-3xl font-bold text-gray-900">{dashboardData?.total_requests || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Requisições Abertas</h3>
              <p className="text-3xl font-bold text-orange-600">{dashboardData?.open_requests || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Requisições Concluídas</h3>
              <p className="text-3xl font-bold text-green-600">{dashboardData?.completed_requests || 0}</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Minhas Requisições</h3>
              <p className="text-3xl font-bold text-gray-900">{dashboardData?.my_requests_count || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Requisições Abertas</h3>
              <p className="text-3xl font-bold text-orange-600">{dashboardData?.my_open_requests || 0}</p>
            </div>
          </>
        )}
      </div>

      {/* Requisições recentes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Requisições Recentes</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {dashboardData?.recent_requests?.length > 0 ? (
            dashboardData.recent_requests.map((request) => (
              <div key={request.numero_requisicao} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Link
                      to={`/requisicao/${request.numero_requisicao}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      #{request.numero_requisicao} - {request.titulo_curto}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      Solicitante: {request.solicitante?.username} • 
                      {new Date(request.data_criacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {request.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              Nenhuma requisição encontrada
            </div>
          )}
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/nova-requisicao"
          className="bg-blue-50 p-6 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
        >
          <h3 className="text-lg font-medium text-blue-900">Nova Requisição</h3>
          <p className="text-blue-700 mt-2">Criar uma nova requisição de manutenção</p>
        </Link>
        
        <Link
          to="/minhas-requisicoes"
          className="bg-green-50 p-6 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
        >
          <h3 className="text-lg font-medium text-green-900">Minhas Requisições</h3>
          <p className="text-green-700 mt-2">Visualizar suas requisições</p>
        </Link>
        
        {(user?.profile_type === 'MANUTENCAO' || user?.profile_type === 'GESTOR' || user?.profile_type === 'TI') && (
          <Link
            to="/requisicoes"
            className="bg-purple-50 p-6 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
          >
            <h3 className="text-lg font-medium text-purple-900">Todas as Requisições</h3>
            <p className="text-purple-700 mt-2">Gerenciar todas as requisições</p>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Dashboard

