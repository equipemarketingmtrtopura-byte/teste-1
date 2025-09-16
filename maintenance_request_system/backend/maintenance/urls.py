from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profiles', views.UserProfileViewSet, basename='userprofile')
router.register(r'requests', views.MaintenanceRequestViewSet)
router.register(r'notifications', views.NotificationViewSet, basename='notification')

urlpatterns = [
    path('api/', include(router.urls)),
]

