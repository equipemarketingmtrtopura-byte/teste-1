from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, MaintenanceRequest, RequestAttachment, RequestHistory, Notification


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['user', 'profile_type', 'setor']


class RequestAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestAttachment
        fields = ['id', 'arquivo', 'nome_original', 'data_upload']


class RequestHistorySerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)
    
    class Meta:
        model = RequestHistory
        fields = ['id', 'usuario', 'acao', 'descricao', 'data_acao']


class MaintenanceRequestSerializer(serializers.ModelSerializer):
    solicitante = UserSerializer(read_only=True)
    responsavel_manutencao = UserSerializer(read_only=True)
    anexos = RequestAttachmentSerializer(many=True, read_only=True)
    historico = RequestHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = MaintenanceRequest
        fields = [
            'numero_requisicao', 'data_criacao', 'data_atualizacao',
            'solicitante', 'prazo_limite', 'setor_solicitante',
            'tipo_manutencao', 'status_operacional', 'equipamentos_impactados',
            'outros_equipamentos', 'titulo_curto', 'descricao_problema',
            'prioridade', 'status', 'motivo_cancelamento', 'motivo_parada',
            'responsavel_manutencao', 'data_prevista_termino', 'hora_inicio',
            'hora_termino', 'descricao_manutencao', 'materiais_utilizados',
            'anexos', 'historico'
        ]
        read_only_fields = ['numero_requisicao', 'data_criacao', 'data_atualizacao']


class MaintenanceRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceRequest
        fields = [
            'prazo_limite', 'setor_solicitante', 'tipo_manutencao',
            'status_operacional', 'equipamentos_impactados', 'outros_equipamentos',
            'titulo_curto', 'descricao_problema', 'prioridade'
        ]


class MaintenanceRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceRequest
        fields = [
            'status', 'motivo_cancelamento', 'motivo_parada',
            'responsavel_manutencao', 'data_prevista_termino',
            'descricao_manutencao', 'materiais_utilizados'
        ]


class NotificationSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)
    request = MaintenanceRequestSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'usuario', 'titulo', 'mensagem', 'request', 'lida', 'data_criacao']

