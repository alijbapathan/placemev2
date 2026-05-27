from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, DriveViewSet, ApplicationViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'drives', DriveViewSet, basename='drive')
router.register(r'applications', ApplicationViewSet, basename='application')

urlpatterns = [
    path('', include(router.urls)),
]
