import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { requestsAPI } from '../services/api'

const RequestDetail = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [updateData, setUpdateData] = useState({
    descricao_manutencao: '',
    materiais_utilizados: ''
  })

  useEffect(() => {
    loadRequest()
  }, [id])

  const loadRequest = async () => {
    try {
      // Simulação de dados da requisição
      const mockRequest = {
        numero_requisicao: parseInt(id),
        titulo_curto: 'Reparo na prensa hidráulica',
        descricao_problema: 'A prensa hidráulica está apresentando vazamento de óleo e perda de pressão. O problema começou ontem durante o turno da manhã e está afetando a produção.',
        status: 'ABERTA',
        tipo_manutencao: 'MECANICA',
        status_operacional: 'INOPERANTE',
        prioridade: 4,
        data_criacao: '2024-01-15T10:30:00Z',
        data_atualizacao: '2024-01-15T10:30:00Z',
        prazo_limite: '2024-01-20',
        setor_solicitante: 'Produção',
        equipamentos_impactados: ['PRENSA'],
        outros_equipamentos: 'Bomba hidráulica auxiliar',
        solicitante: { 
          username: 'joao.silva',
          first_name: 'João',
          last_name: 'Silva'
        },
        responsavel_manutencao: null,
        data_prevista_termino: null,
        hora_inicio: null,
        hora_termino: null,
        descricao_manutencao: '',
        materiais_utilizados: '',
        motivo_cancelamento: '',
        motivo_parada: '',
        historico: [
          {
            id: 1,
            usuario: { username: 'joao.silva' },
            acao: 'CRIADA',
            descricao: 'Requisição criada',
            data_acao: '2024-01-15T10:30:00Z'
          }
        ]
      }
      
      setRequest(mockRequest)
    } catch (error) {
      console.error('Erro ao carregar requisição:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true)
    try {
      // Simulação de atualização de status
      console.log(`Atualizando status para: ${newStatus}`)
      
      setRequest(prev => ({
        ...prev,
        status: newStatus,
        responsavel_manutencao: newStatus === 'ACEITA' ? user : prev.responsavel_manutencao
      }))
      
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleCompleteRequest = async () => {
    setUpdating(true)
    try {
      // Simulação de conclusão da requisição
      console.log('Concluindo requisição:', updateData)
      
      setRequest(prev => ({
        ...prev,
        status: 'CONCLUIDA',
        descricao_manutencao: updateData.descricao_manutencao,
        materiais_utilizados: updateData.materiais_utilizados,
        hora_termino: new Date().toISOString()
      }))
      
      setShowUpdateForm(false)
      
    } catch (error) {
      console.error('Erro ao concluir requisição:', error)
    } finally {
      setUpdating(false)
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

  const canUpdateStatus = () => {
    return user?.profile_type === 'MANUTENCAO' || user?.profile_type === 'TI'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando requisição...</div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Requisição não encontrada</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Voltar
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Requisição #{request.numero_requisicao}
            </h1>
            <h2 className="text-xl text-gray-700 mt-2">{request.titulo_curto}</h2>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(request.status)}`}>
              {request.status.replace('_', ' ')}
            </span>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>

      {/* Informações da requisição */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Gerais</h3>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Solicitante:</span>
              <span className="ml-2">{request.solicitante.first_name} {request.solicitante.last_name} ({request.solicitante.username})</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Setor:</span>
              <span className="ml-2">{request.setor_solicitante}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Tipo de Manutenção:</span>
              <span className="ml-2">{request.tipo_manutencao}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status Operacional:</span>
              <span className="ml-2">{request.status_operacional}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Prioridade:</span>
              <span className="ml-2">{getPriorityLabel(request.prioridade)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Data de Criação:</span>
              <span className="ml-2">{new Date(request.data_criacao).toLocaleString('pt-BR')}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Prazo Limite:</span>
              <span className="ml-2">{new Date(request.prazo_limite).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipamentos</h3>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Equipamentos Impactados:</span>
              <div className="mt-1">
                {request.equipamentos_impactados.map((eq, index) => (
                  <span key={index} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2 mb-1">
                    {eq}
                  </span>
                ))}
              </div>
            </div>
            {request.outros_equipamentos && (
              <div>
                <span className="font-medium text-gray-700">Outros Equipamentos:</span>
                <p className="mt-1 text-gray-600">{request.outros_equipamentos}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Descrição do problema */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Descrição do Problema</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{request.descricao_problema}</p>
      </div>

      {/* Execução da manutenção */}
      {(request.responsavel_manutencao || request.descricao_manutencao || request.materiais_utilizados) && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Execução da Manutenção</h3>
          <div className="space-y-3">
            {request.responsavel_manutencao && (
              <div>
                <span className="font-medium text-gray-700">Responsável:</span>
                <span className="ml-2">{request.responsavel_manutencao.username}</span>
              </div>
            )}
            {request.hora_inicio && (
              <div>
                <span className="font-medium text-gray-700">Início:</span>
                <span className="ml-2">{new Date(request.hora_inicio).toLocaleString('pt-BR')}</span>
              </div>
            )}
            {request.hora_termino && (
              <div>
                <span className="font-medium text-gray-700">Término:</span>
                <span className="ml-2">{new Date(request.hora_termino).toLocaleString('pt-BR')}</span>
              </div>
            )}
            {request.descricao_manutencao && (
              <div>
                <span className="font-medium text-gray-700">Descrição da Manutenção:</span>
                <p className="mt-1 text-gray-600">{request.descricao_manutencao}</p>
              </div>
            )}
            {request.materiais_utilizados && (
              <div>
                <span className="font-medium text-gray-700">Materiais Utilizados:</span>
                <p className="mt-1 text-gray-600">{request.materiais_utilizados}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ações */}
      {canUpdateStatus() && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
          <div className="flex flex-wrap gap-3">
            {request.status === 'ABERTA' && (
              <button
                onClick={() => handleStatusUpdate('ACEITA')}
                disabled={updating}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Aceitar Requisição
              </button>
            )}
            
            {request.status === 'ACEITA' && (
              <button
                onClick={() => handleStatusUpdate('EM_ATENDIMENTO')}
                disabled={updating}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
              >
                Iniciar Manutenção
              </button>
            )}
            
            {request.status === 'EM_ATENDIMENTO' && (
              <button
                onClick={() => setShowUpdateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Concluir Manutenção
              </button>
            )}
          </div>
        </div>
      )}

      {/* Formulário de conclusão */}
      {showUpdateForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Concluir Manutenção</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição da Manutenção
              </label>
              <textarea
                value={updateData.descricao_manutencao}
                onChange={(e) => setUpdateData({...updateData, descricao_manutencao: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva o que foi feito..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materiais/Peças Utilizadas
              </label>
              <textarea
                value={updateData.materiais_utilizados}
                onChange={(e) => setUpdateData({...updateData, materiais_utilizados: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Liste os materiais utilizados..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCompleteRequest}
                disabled={updating}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {updating ? 'Concluindo...' : 'Concluir'}
              </button>
              <button
                onClick={() => setShowUpdateForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Histórico */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico</h3>
        <div className="space-y-3">
          {request.historico.map((item) => (
            <div key={item.id} className="border-l-4 border-blue-500 pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{item.acao.replace('_', ' ')}</p>
                  <p className="text-gray-600">{item.descricao}</p>
                  <p className="text-sm text-gray-500">por {item.usuario.username}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(item.data_acao).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RequestDetail

