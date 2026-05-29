from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Company, Drive, Application
from .serializers import (
    CompanySerializer, DriveSerializer,
    ApplicationListSerializer, ApplicationDetailSerializer
)


class CompanyViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Company model (Read-only)"""
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'location', 'industry']
    
    def list(self, request, *args, **kwargs):
        """List all companies"""
        return super().list(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        """Get company details"""
        return super().retrieve(request, *args, **kwargs)


class DriveViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Drive model (Read-only with custom filters)"""
    queryset = Drive.objects.select_related('company').all()
    serializer_class = DriveSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'company']
    search_fields = ['position', 'company__name']
    ordering_fields = ['deadline', 'created_at']
    ordering = ['-created_at']

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def check_application_status(self, request, pk=None):
        """Check if student has already applied"""
        drive = self.get_object()
        student = request.user
        application = Application.objects.filter(drive=drive, student=student).first()
        
        if application:
            return Response({
                'applied': True,
                'status': application.status,
                'application_id': application.id
            })
        return Response({'applied': False})


class ApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet for Application model (Full CRUD)"""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'drive']
    ordering_fields = ['applied_at']
    ordering = ['-applied_at']

    def get_queryset(self):
        """Get applications for current student"""
        return Application.objects.filter(student=self.request.user).select_related('drive', 'drive__company')

    def get_serializer_class(self):
        """Use different serializers for list and detail"""
        if self.action == 'retrieve':
            return ApplicationDetailSerializer
        return ApplicationListSerializer

    def create(self, request, *args, **kwargs):
        """Create application (apply to drive)"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        """Auto-assign student to current user"""
        serializer.save(student=self.request.user)

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def update_status(self, request, pk=None):
        """Update application status"""
        application = self.get_object()
        new_status = request.data.get('status')
        
        valid_statuses = ['applied', 'rejected', 'shortlisted', 'selected']
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.status = new_status
        application.save()
        serializer = self.get_serializer(application)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def upload_resume(self, request, pk=None):
        """Upload/update resume for application"""
        application = self.get_object()
        resume_url = request.data.get('resume_url')
        
        if not resume_url:
            return Response(
                {'error': 'resume_url is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.resume_url = resume_url
        application.save()
        serializer = self.get_serializer(application)
        return Response(serializer.data)
