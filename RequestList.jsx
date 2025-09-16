import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { requestsAPI } from '../services/api'

const RequestList = ({ user }) => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      // Simulação de dados de requisições
      const mockRequests = [
        {
          numero_requisicao: 1,
          titulo_curto: 'Reparo na prensa hidráulica',
          status: 'ABERTA',
          tipo_manutencao: 'MECANICA',
          prioridade: 3,
          data_criacao: '2024-01-15T10:30:00Z',
          prazo_limite: '2024-01-20',
          solicitante: { username: 'joao.silva' },
          setor_solicitante: 'Produção'
        },
        {
          numero_requisicao: 2,
          titulo_curto: 'Manutenção preventiva rosqueadeira',
          status: 'EM_ATENDIMENTO',
          tipo_manutencao: 'MECANICA',
          prioridade: 2,
          data_criacao: '2024-01-14T14:20:00Z',
          prazo_limite: '2024-01-25',
          solicitante: { username: 'maria.santos' },
          setor_solicitante: 'Produção',
          responsavel_manutencao: { username: 'carlos.tech' }
        },
        {
          numero_requisicao: 3,
          titulo_curto: 'Problema elétrico no painel',
          status: 'CONCLUIDA',
          tipo_manutencao: 'ELETRICA',
          prioridade: 4,
          data_criacao: '2024-01-10T09:15:00Z',
          prazo_limite: '2024-01-15',
          solicitante: { username: 'ana.costa' },
          setor_solicitante: 'Manutenção',
          responsavel_manutencao: { username: 'pedro.eletricista' }
        }
      ]
      
      // Filtrar baseado no perfil do usuário
      let filteredRequests = mockRequests
      if (user?.profile_type === 'COMUM') {
        filteredRequests = mockRequests.filter(req => req.solicitante.username === user.username)
      }
      
      setRequests(filteredRequests)
    } catch (error) {
      console.error('Erro ao carregar requisições:', error)
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

  const getPriorityColor = (priority) => {
    const colors = {
      1: 'text-green-600',
      2: 'text-blue-600',
      3: 'text-yellow-600',
      4: 'text-orange-600',
      5: 'text-red-600'
    }
    return colors[priority] || 'text-gray-600'
  }

  const getPriorityLabel = (priority) => {
    const labels = {
      1: 'Baixa',
      2: 'Normal',
      3: 'Média',
      4: 'Alta',
      5: 'Crítica'
    }
    return labels[priority] || 'Normal'
  }

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true
    return request.status === filter
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando requisições...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.profile_type === 'COMUM' ? 'Minhas Requisições' : 'Requisições de Manutenção'}
        </h1>
        <Link
          to="/nova-requisicao"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Nova Requisição
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('ABERTA')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'ABERTA' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Abertas
          </button>
          <button
            onClick={() => setFilter('EM_ATENDIMENTO')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'EM_ATENDIMENTO' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Em Atendimento
          </button>
          <button
            onClick={() => setFilter('CONCLUIDA')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'CONCLUIDA' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Concluídas
          </button>
        </div>
      </div>

      {/* Lista de requisições */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredRequests.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <div key={request.numero_requisicao} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/requisicao/${request.numero_requisicao}`}
                        className="text-lg font-medium text-blue-600 hover:text-blue-800"
                      >
                        #{request.numero_requisicao} - {request.titulo_curto}
                      </Link>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Solicitante: {request.solicitante.username}</span>
                      <span>Setor: {request.setor_solicitante}</span>
                      <span>Tipo: {request.tipo_manutencao}</span>
                      <span className={getPriorityColor(request.prioridade)}>
                        Prioridade: {getPriorityLabel(request.prioridade)}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Criado: {new Date(request.data_criacao).toLocaleDateString('pt-BR')}</span>
                      <span>Prazo: {new Date(request.prazo_limite).toLocaleDateString('pt-BR')}</span>
                      {request.responsavel_manutencao && (
                        <span>Responsável: {request.responsavel_manutencao.username}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/requisicao/${request.numero_requisicao}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            Nenhuma requisição encontrada
          </div>
        )}
      </div>
    </div>
  )
}

export default RequestList

