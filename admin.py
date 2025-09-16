from django.contrib import admin
from .models import UserProfile, MaintenanceRequest, RequestAttachment, RequestHistory, Notification


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'profile_type', 'setor']
    list_filter = ['profile_type']
    search_fields = ['user__username', 'user__first_name', 'user__last_name']


@admin.register(MaintenanceRequest)
class MaintenanceRequestAdmin(admin.ModelAdmin):
    list_display = ['numero_requisicao', 'titulo_curto', 'solicitante', 'status', 'tipo_manutencao', 'data_criacao']
    list_filter = ['status', 'tipo_manutencao', 'prioridade', 'data_criacao']
    search_fields = ['titulo_curto', 'descricao_problema', 'solicitante__username']
    readonly_fields = ['numero_requisicao', 'data_criacao', 'data_atualizacao']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('numero_requisicao', 'solicitante', 'titulo_curto', 'descricao_problema')
        }),
        ('Detalhes da Requisição', {
            'fields': ('prazo_limite', 'setor_solicitante', 'tipo_manutencao', 'status_operacional', 
                      'equipamentos_impactados', 'outros_equipamentos', 'prioridade')
        }),
        ('Status e Fluxo', {
            'fields': ('status', 'motivo_cancelamento', 'motivo_parada')
        }),
        ('Execução da Manutenção', {
            'fields': ('responsavel_manutencao', 'data_prevista_termino', 'hora_inicio', 
                      'hora_termino', 'descricao_manutencao', 'materiais_utilizados')
        }),
        ('Timestamps', {
            'fields': ('data_criacao', 'data_atualizacao'),
            'classes': ('collapse',)
        }),
    )


@admin.register(RequestAttachment)
class RequestAttachmentAdmin(admin.ModelAdmin):
    list_display = ['request', 'nome_original', 'data_upload']
    list_filter = ['data_upload']


@admin.register(RequestHistory)
class RequestHistoryAdmin(admin.ModelAdmin):
    list_display = ['request', 'usuario', 'acao', 'data_acao']
    list_filter = ['acao', 'data_acao']
    search_fields = ['request__titulo_curto', 'usuario__username', 'descricao']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'titulo', 'lida', 'data_criacao']
    list_filter = ['lida', 'data_criacao']
    search_fields = ['titulo', 'mensagem', 'usuario__username']
