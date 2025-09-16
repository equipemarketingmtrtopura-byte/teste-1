from rest_framework import permissions
from .models import UserProfile

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allows read-only access to any user, but only admin users for write operations.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class IsOwnerOrAssignedOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners, assigned maintenance, or admins to view/edit.
    """
    def has_object_permission(self, request, view, obj):
        # Admin users can do anything
        if request.user.is_staff:
            return True

        # Check if the user is the creator or the person responsible for maintenance
        return obj.solicitante == request.user or obj.responsavel_manutencao == request.user

class IsMaintenanceUser(permissions.BasePermission):
    """
    Allows access only to users with the 'MANUTENCAO' or 'TI' profile.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            profile = request.user.userprofile
            return profile.profile_type in ['MANUTENCAO', 'TI']
        except UserProfile.DoesNotExist:
            return False

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to Admin (TI) users.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            profile = request.user.userprofile
            return profile.profile_type == 'TI'
        except UserProfile.DoesNotExist:
            return False
