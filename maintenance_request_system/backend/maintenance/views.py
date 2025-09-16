from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Q
from .models import UserProfile, MaintenanceRequest, RequestAttachment, RequestHistory, Notification
from .serializers import (
    UserProfileSerializer, MaintenanceRequestSerializer, 
    MaintenanceRequestCreateSerializer, MaintenanceRequestUpdateSerializer,
    RequestAttachmentSerializer, NotificationSerializer
)
from .permissions import IsOwnerOrAssignedOrAdmin, IsMaintenanceUser, IsAdminUser

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Admins can see all profiles.
        Other users can only see their own profile.
        """
        if self.request.user.is_staff or (hasattr(self.request.user, 'userprofile') and self.request.user.userprofile.profile_type == 'TI'):
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Retorna o perfil do usuário atual"""
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Perfil não encontrado'}, status=status.HTTP_404_NOT_FOUND)


class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceRequest.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAssignedOrAdmin]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return MaintenanceRequestCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return MaintenanceRequestUpdateSerializer
        return MaintenanceRequestSerializer
    
    def get_queryset(self):
        """Filtrar requisições baseado no perfil do usuário"""
        user = self.request.user
        try:
            # Check if user has a profile, otherwise default to a safe queryset
            profile = getattr(user, 'userprofile', None)
            if not profile:
                return MaintenanceRequest.objects.filter(solicitante=user)

            if profile.profile_type == 'COMUM':
                # Usuários comuns só veem suas próprias requisições
                return MaintenanceRequest.objects.filter(solicitante=user)
            elif profile.profile_type == 'MANUTENCAO':
                # Manutenção vê requisições abertas ou atribuídas a eles
                return MaintenanceRequest.objects.filter(
                    Q(status__in=['ABERTA', 'VISUALIZADA', 'ACEITA', 'EM_ATENDIMENTO', 'PARADA']) |
                    Q(responsavel_manutencao=user)
                )
            else: # Gestores e TI veem todas
                return MaintenanceRequest.objects.all()
        except UserProfile.DoesNotExist:
            # Fallback for safety, should not happen if profiles are created with users
            return MaintenanceRequest.objects.filter(solicitante=user)
    
    def perform_create(self, serializer):
        """Criar requisição com o usuário atual como solicitante"""
        request = serializer.save(solicitante=self.request.user)
        
        # Criar histórico
        RequestHistory.objects.create(
            request=request,
            usuario=self.request.user,
            acao='CRIADA',
            descricao='Requisição criada'
        )
        
        # Notificar equipe de manutenção
        self.notify_maintenance_team(request)
    
    def perform_update(self, serializer):
        """Atualizar requisição e criar histórico"""
        old_status = self.get_object().status
        request = serializer.save()
        
        # Criar histórico se status mudou
        if old_status != request.status:
            RequestHistory.objects.create(
                request=request,
                usuario=self.request.user,
                acao='STATUS_ALTERADO',
                descricao=f'Status alterado de {old_status} para {request.status}'
            )
            
            # Notificar baseado no novo status
            self.notify_status_change(request, old_status)
    
    def notify_maintenance_team(self, request):
        """Notificar equipe de manutenção sobre nova requisição"""
        maintenance_users = User.objects.filter(
            userprofile__profile_type='MANUTENCAO'
        )
        
        for user in maintenance_users:
            Notification.objects.create(
                usuario=user,
                titulo='Nova Requisição de Manutenção',
                mensagem=f'Nova requisição #{request.numero_requisicao}: {request.titulo_curto}',
                request=request
            )
    
    def notify_status_change(self, request, old_status):
        """Notificar sobre mudanças de status"""
        if request.status == 'ACEITA':
            # Notificar solicitante
            Notification.objects.create(
                usuario=request.solicitante,
                titulo='Requisição Aceita',
                mensagem=f'Sua requisição #{request.numero_requisicao} foi aceita',
                request=request
            )
        elif request.status == 'CONCLUIDA':
            # Notificar solicitante
            Notification.objects.create(
                usuario=request.solicitante,
                titulo='Manutenção Concluída',
                mensagem=f'A manutenção da requisição #{request.numero_requisicao} foi concluída',
                request=request
            )
    
    @action(detail=True, methods=['post'], permission_classes=[IsMaintenanceUser])
    def accept(self, request, pk=None):
        """Aceitar uma requisição"""
        maintenance_request = self.get_object()
        maintenance_request.status = 'ACEITA'
        maintenance_request.responsavel_manutencao = request.user
        maintenance_request.save()
        
        return Response({'status': 'Requisição aceita'})
    
    @action(detail=True, methods=['post'], permission_classes=[IsMaintenanceUser])
    def start_maintenance(self, request, pk=None):
        """Iniciar manutenção"""
        maintenance_request = self.get_object()
        maintenance_request.status = 'EM_ATENDIMENTO'
        maintenance_request.save()
        
        return Response({'status': 'Manutenção iniciada'})
    
    @action(detail=True, methods=['post'], permission_classes=[IsMaintenanceUser])
    def complete_maintenance(self, request, pk=None):
        """Concluir manutenção"""
        maintenance_request = self.get_object()
        maintenance_request.status = 'CONCLUIDA'
        maintenance_request.descricao_manutencao = request.data.get('descricao_manutencao', '')
        maintenance_request.materiais_utilizados = request.data.get('materiais_utilizados', '')
        maintenance_request.save()
        
        return Response({'status': 'Manutenção concluída'})
    
    @action(detail=False, methods=['get'])
    def my_requests(self, request):
        """Retorna as requisições do usuário atual"""
        requests = MaintenanceRequest.objects.filter(solicitante=request.user)
        serializer = self.get_serializer(requests, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def dashboard_data(self, request):
        """Retorna dados para o dashboard"""
        # A lógica original foi movida para um endpoint mais seguro e específico para admin/TI.
        # A lógica de dashboard para usuários comuns pode ser exposta em outro endpoint se necessário.
        total_requests = MaintenanceRequest.objects.count()
        open_requests = MaintenanceRequest.objects.filter(
            status__in=['ABERTA', 'VISUALIZADA', 'ACEITA', 'EM_ATENDIMENTO']
        ).count()
        completed_requests = MaintenanceRequest.objects.filter(status='CONCLUIDA').count()

        return Response({
            'total_requests': total_requests,
            'open_requests': open_requests,
            'completed_requests': completed_requests,
            'recent_requests': MaintenanceRequestSerializer(
                MaintenanceRequest.objects.all().order_by('-data_criacao')[:5], many=True
            ).data
        })


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(usuario=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Marcar notificação como lida"""
        notification = self.get_object()
        notification.lida = True
        notification.save()
        return Response({'status': 'Notificação marcada como lida'})
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Marcar todas as notificações como lidas"""
        Notification.objects.filter(usuario=request.user, lida=False).update(lida=True)
        return Response({'status': 'Todas as notificações marcadas como lidas'})
