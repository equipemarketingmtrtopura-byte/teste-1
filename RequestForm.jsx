import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestsAPI } from '../services/api'

const RequestForm = ({ user }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    titulo_curto: '',
    descricao_problema: '',
    prazo_limite: '',
    setor_solicitante: '',
    tipo_manutencao: 'MECANICA',
    status_operacional: 'FUNCIONANDO',
    equipamentos_impactados: [],
    outros_equipamentos: '',
    prioridade: 1
  })

  const equipmentOptions = [
    { value: 'PRENSA', label: 'Prensa' },
    { value: 'ROSQUEADEIRA', label: 'Rosqueadeira' },
    { value: 'RECORTADOR', label: 'Recortador' },
    { value: 'FRESA', label: 'Fresa' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulação de criação de requisição
      console.log('Criando requisição:', formData)
      
      // Em produção, usar: await requestsAPI.create(formData)
      
      // Simular sucesso
      setTimeout(() => {
        navigate('/minhas-requisicoes')
      }, 1000)
      
    } catch (err) {
      setError('Erro ao criar requisição. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'equipamentos_impactados') {
      const currentEquipments = formData.equipamentos_impactados
      if (checked) {
        setFormData({
          ...formData,
          equipamentos_impactados: [...currentEquipments, value]
        })
      } else {
        setFormData({
          ...formData,
          equipamentos_impactados: currentEquipments.filter(eq => eq !== value)
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'number' ? parseInt(value) : value
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nova Requisição de Manutenção</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título Curto *
              </label>
              <input
                type="text"
                name="titulo_curto"
                value={formData.titulo_curto}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Reparo na prensa hidráulica"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Setor Solicitante *
              </label>
              <input
                type="text"
                name="setor_solicitante"
                value={formData.setor_solicitante}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Produção"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição do Problema *
            </label>
            <textarea
              name="descricao_problema"
              value={formData.descricao_problema}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva detalhadamente o problema..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prazo Limite *
              </label>
              <input
                type="date"
                name="prazo_limite"
                value={formData.prazo_limite}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Manutenção *
              </label>
              <select
                name="tipo_manutencao"
                value={formData.tipo_manutencao}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MECANICA">Mecânica</option>
                <option value="ELETRICA">Elétrica</option>
                <option value="OUTROS">Outros</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Operacional *
              </label>
              <select
                name="status_operacional"
                value={formData.status_operacional}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="FUNCIONANDO">Funcionando</option>
                <option value="ALERTA">Alerta</option>
                <option value="INOPERANTE">Inoperante</option>
              </select>
            </div>
          </div>

          {/* Equipamentos impactados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipamentos Impactados
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {equipmentOptions.map((equipment) => (
                <label key={equipment.value} className="flex items-center">
                  <input
                    type="checkbox"
                    name="equipamentos_impactados"
                    value={equipment.value}
                    checked={formData.equipamentos_impactados.includes(equipment.value)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {equipment.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Outros Equipamentos
            </label>
            <textarea
              name="outros_equipamentos"
              value={formData.outros_equipamentos}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva outros equipamentos não listados acima..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridade (1-5)
            </label>
            <select
              name="prioridade"
              value={formData.prioridade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 - Baixa</option>
              <option value={2}>2 - Normal</option>
              <option value={3}>3 - Média</option>
              <option value={4}>4 - Alta</option>
              <option value={5}>5 - Crítica</option>
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Requisição'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RequestForm

