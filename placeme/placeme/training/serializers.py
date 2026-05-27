from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Course, Enrollment, MockTest, TestAttempt

User = get_user_model()

class CourseSerializer(serializers.ModelSerializer):
    """Serializer for Course model"""
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'category', 'level', 'duration_hours',
            'instructor_name', 'instructor_bio', 'thumbnail_url', 'total_students',
            'rating', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_students']


class EnrollmentListSerializer(serializers.ModelSerializer):
    """Serializer for listing enrollments"""
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_category = serializers.CharField(source='course.category', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'course_title', 'course_category', 'status', 'progress_percentage', 'enrolled_at', 'completed_at']
        read_only_fields = ['id', 'enrolled_at']


class EnrollmentDetailSerializer(serializers.ModelSerializer):
    """Serializer for enrollment details"""
    course = CourseSerializer(read_only=True)
    course_id = serializers.IntegerField(write_only=True)
    student = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            'id', 'student', 'course', 'course_id', 'status', 'progress_percentage',
            'enrolled_at', 'completed_at', 'certificate_url'
        ]
        read_only_fields = ['id', 'student', 'enrolled_at', 'certificate_url']

    def create(self, validated_data):
        student = self.context['request'].user
        course_id = validated_data.pop('course_id')
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            raise serializers.ValidationError({'course_id': 'Course not found'})
        
        # Check for duplicate enrollment
        existing = Enrollment.objects.filter(student=student, course=course).exists()
        if existing:
            raise serializers.ValidationError('You are already enrolled in this course')
        
        return Enrollment.objects.create(student=student, course=course, **validated_data)


class MockTestSerializer(serializers.ModelSerializer):
    """Serializer for MockTest model"""
    course_title = serializers.CharField(source='course.title', read_only=True, required=False)

    class Meta:
        model = MockTest
        fields = [
            'id', 'course', 'course_title', 'title', 'description', 'difficulty',
            'total_questions', 'duration_minutes', 'passing_percentage', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class TestAttemptListSerializer(serializers.ModelSerializer):
    """Serializer for listing test attempts"""
    test_title = serializers.CharField(source='test.title', read_only=True)
    percentage = serializers.SerializerMethodField()

    class Meta:
        model = TestAttempt
        fields = ['id', 'test_title', 'score', 'max_score', 'percentage', 'is_passed', 'attempted_at']
        read_only_fields = fields

    def get_percentage(self, obj):
        if obj.max_score > 0:
            return round((obj.score / obj.max_score) * 100, 2)
        return 0


class TestAttemptDetailSerializer(serializers.ModelSerializer):
    """Serializer for test attempt details"""
    test = MockTestSerializer(read_only=True)
    test_id = serializers.IntegerField(write_only=True)
    student = serializers.StringRelatedField(read_only=True)
    percentage = serializers.SerializerMethodField()

    class Meta:
        model = TestAttempt
        fields = [
            'id', 'student', 'test', 'test_id', 'score', 'max_score',
            'percentage', 'time_taken_minutes', 'is_passed', 'attempted_at'
        ]
        read_only_fields = ['id', 'student', 'attempted_at']

    def get_percentage(self, obj):
        if obj.max_score > 0:
            return round((obj.score / obj.max_score) * 100, 2)
        return 0

    def create(self, validated_data):
        student = self.context['request'].user
        test_id = validated_data.pop('test_id')
        try:
            test = MockTest.objects.get(id=test_id)
        except MockTest.DoesNotExist:
            raise serializers.ValidationError({'test_id': 'Test not found'})
        
        return TestAttempt.objects.create(student=student, test=test, **validated_data)
