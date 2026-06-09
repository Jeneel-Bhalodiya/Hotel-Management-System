from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser, HotelSettings

class CustomUserSerializer(serializers.ModelSerializer):
    hotel_setup_completed = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'role', 'email', 'hotel_setup_completed')

    def get_hotel_setup_completed(self, obj):
        return hasattr(obj, 'hotel_settings')

class HotelSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelSettings
        fields = ('hotel_name', 'hotel_address', 'total_tables', 'total_employees')

class EmployeeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    name = serializers.CharField(source='first_name', required=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'name', 'password', 'salary')
        read_only_fields = ('id', 'username')

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data.get('username'),
            first_name=validated_data.get('first_name', ''),
            password=validated_data.get('password'),
            salary=validated_data.get('salary', 0),
            role='WAITER',
            hotel=validated_data.get('hotel')
        )
        return user

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'role', 'email')

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'WAITER')
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add extra responses here
        data.update({'user': CustomUserSerializer(self.user).data})
        return data
