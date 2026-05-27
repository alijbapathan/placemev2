from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Company, Drive, Application

User = get_user_model()

class CompanySerializer(serializers.ModelSerializer):
    """Serializer for Company model"""
    class Meta:
        model = Company
        fields = ['id', 'name', 'logo_url', 'website', 'description', 'location', 'industry', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class DriveSerializer(serializers.ModelSerializer):
    """Serializer for Drive model"""
    company = CompanySerializer(read_only=True)
    company_id = serializers.IntegerField(write_only=True, required=False)
    days_left = serializers.SerializerMethodField()
    total_applications = serializers.SerializerMethodField()

    class Meta:
        model = Drive
        fields = [
            'id', 'company', 'company_id', 'position', 'package', 'ctc', 
            'eligibility', 'required_skills', 'job_description', 'deadline', 
            'drive_date', 'location', 'is_active', 'days_left', 'total_applications',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'days_left', 'total_applications']

    def get_days_left(self, obj):
        return obj.days_left

    def get_total_applications(self, obj):
        return obj.applications.count()

    def create(self, validated_data):
        company_id = validated_data.pop('company_id', None)
        if company_id:
            try:
                company = Company.objects.get(id=company_id)
                validated_data['company'] = company
            except Company.DoesNotExist:
                raise serializers.ValidationError({'company_id': 'Company not found'})
        return super().create(validated_data)


class ApplicationListSerializer(serializers.ModelSerializer):
    """Serializer for listing applications"""
    drive = DriveSerializer(read_only=True)
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = ['id', 'drive', 'student_name', 'status', 'applied_at', 'updated_at']
        read_only_fields = ['id', 'applied_at', 'updated_at']

    def get_student_name(self, obj):
        return obj.student.get_full_name() or obj.student.username


class ApplicationDetailSerializer(serializers.ModelSerializer):
    """Serializer for application details"""
    drive = DriveSerializer(read_only=True)
    drive_id = serializers.IntegerField(write_only=True)
    student = serializers.StringRelatedField(read_only=True)
    company_name = serializers.SerializerMethodField()
    position = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            'id', 'student', 'drive', 'drive_id', 'company_name', 'position',
            'status', 'resume_url', 'interview_date', 'notes', 'applied_at', 'updated_at'
        ]
        read_only_fields = ['id', 'student', 'applied_at', 'updated_at']

    def get_company_name(self, obj):
        return obj.drive.company.name

    def get_position(self, obj):
        return obj.drive.position

    def create(self, validated_data):
        student = self.context['request'].user
        drive_id = validated_data.pop('drive_id')
        try:
            drive = Drive.objects.get(id=drive_id)
        except Drive.DoesNotExist:
            raise serializers.ValidationError({'drive_id': 'Drive not found'})
        
        # Check for duplicate application
        existing = Application.objects.filter(student=student, drive=drive).exists()
        if existing:
            raise serializers.ValidationError('You have already applied to this drive')
        
        return Application.objects.create(student=student, drive=drive, **validated_data)
