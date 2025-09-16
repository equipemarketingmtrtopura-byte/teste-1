from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class UserProfile(models.Model):
    PROFILE_CHOICES = [
        ('COMUM', 'Comum (Requisitante)'),
        ('MANUTENCAO', 'Manutenção (Recebe Chamado)'),
        ('GESTOR', 'Gestor (Analisa Dados)'),
        ('TI', 'T.I (Admin)'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_type = models.CharField(max_length=20, choices=PROFILE_CHOICES, default='COMUM')
    setor = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.get_profile_type_display()}"


class MaintenanceRequest(models.Model):
    STATUS_CHOICES = [
        ('ABERTA', 'Aberta'),
        ('VISUALIZADA', 'Visualizada'),
        ('ACEITA', 'Aceita'),
        ('CANCELADA', 'Cancelada'),
        ('EM_ATENDIMENTO', 'Em atendimento'),
        ('PARADA', 'Parada'),
        ('CONCLUIDA', 'Concluída'),
    ]
    
    MAINTENANCE_TYPE_CHOICES = [
        ('ELETRICA', 'Elétrica'),
        ('MECANICA', 'Mecânica'),
        ('OUTROS', 'Outros'),
    ]
    
    OPERATIONAL_STATUS_CHOICES = [
        ('FUNCIONANDO', 'Funcionando'),
        ('ALERTA', 'Alerta'),
        ('INOPERANTE', 'Inoperante'),
    ]
    
    EQUIPMENT_CHOICES = [
        ('PRENSA', 'Prensa'),
        ('ROSQUEADEIRA', 'Rosqueadeira'),
        ('RECORTADOR', 'Recortador'),
        ('FRESA', 'Fresa'),
        ('OUTROS', 'Outros'),
    ]
    
    # Campos automáticos
    numero_requisicao = models.AutoField(primary_key=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    
    # Campos do formulário
    solicitante = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requisicoes_solicitadas')
    prazo_limite = models.DateField()
    setor_solicitante = models.CharField(max_length=100)
    tipo_manutencao = models.CharField(max_length=20, choices=MAINTENANCE_TYPE_CHOICES)
    status_operacional = models.CharField(max_length=20, choices=OPERATIONAL_STATUS_CHOICES)
    equipamentos_impactados = models.JSONField(default=list)  # Lista de equipamentos
    outros_equipamentos = models.TextField(blank=True)
    titulo_curto = models.CharField(max_length=200)
    descricao_problema = models.TextField()
    prioridade = models.IntegerField(default=1)
    
    # Status e fluxo
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ABERTA')
    motivo_cancelamento = models.TextField(blank=True)
    motivo_parada = models.TextField(blank=True)
    
    # Execução da manutenção
    responsavel_manutencao = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='requisicoes_atendidas'
    )
    data_prevista_termino = models.DateField(null=True, blank=True)
    hora_inicio = models.DateTimeField(null=True, blank=True)
    hora_termino = models.DateTimeField(null=True, blank=True)
    descricao_manutencao = models.TextField(blank=True)
    materiais_utilizados = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-data_criacao']
    
    def __str__(self):
        return f"Req #{self.numero_requisicao} - {self.titulo_curto}"
    
    def save(self, *args, **kwargs):
        # Atualizar hora de início quando status muda para EM_ATENDIMENTO
        if self.status == 'EM_ATENDIMENTO' and not self.hora_inicio:
            self.hora_inicio = timezone.now()
        
        # Atualizar hora de término quando status muda para CONCLUIDA
        if self.status == 'CONCLUIDA' and not self.hora_termino:
            self.hora_termino = timezone.now()
            
        super().save(*args, **kwargs)


class RequestAttachment(models.Model):
    request = models.ForeignKey(MaintenanceRequest, on_delete=models.CASCADE, related_name='anexos')
    arquivo = models.FileField(upload_to='anexos/')
    nome_original = models.CharField(max_length=255)
    data_upload = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Anexo - {self.nome_original}"


class RequestHistory(models.Model):
    request = models.ForeignKey(MaintenanceRequest, on_delete=models.CASCADE, related_name='historico')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    acao = models.CharField(max_length=100)
    descricao = models.TextField()
    data_acao = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-data_acao']
    
    def __str__(self):
        return f"{self.request.numero_requisicao} - {self.acao} - {self.usuario.username}"


class Notification(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    mensagem = models.TextField()
    request = models.ForeignKey(MaintenanceRequest, on_delete=models.CASCADE, null=True, blank=True)
    lida = models.BooleanField(default=False)
    data_criacao = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-data_criacao']
    
    def __str__(self):
        return f"{self.titulo} - {self.usuario.username}"
