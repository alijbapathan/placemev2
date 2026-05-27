from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, EnrollmentViewSet, MockTestViewSet, TestAttemptViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'tests', MockTestViewSet, basename='mock-test')
router.register(r'attempts', TestAttemptViewSet, basename='test-attempt')

urlpatterns = [
    path('', include(router.urls)),
]
