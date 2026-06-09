from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser, HotelSettings
from .serializers import CustomTokenObtainPairSerializer, RegisterSerializer, HotelSettingsSerializer, EmployeeSerializer

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class HotelSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if hasattr(request.user, 'hotel_settings'):
            serializer = HotelSettingsSerializer(request.user.hotel_settings)
            return Response(serializer.data)
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        if hasattr(request.user, 'hotel_settings'):
            serializer = HotelSettingsSerializer(request.user.hotel_settings, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = HotelSettingsSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(admin=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmployeeListCreateView(generics.ListCreateAPIView):
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'ADMIN' and hasattr(self.request.user, 'hotel_settings'):
            return CustomUser.objects.filter(hotel=self.request.user.hotel_settings, role='WAITER')
        return CustomUser.objects.none()

    def perform_create(self, serializer):
        hotel = self.request.user.hotel_settings
        prefix = ""
        if hotel.hotel_name:
            prefix = "".join([word[0] for word in hotel.hotel_name.split() if word]).lower()
        prefix += f"{hotel.id}_"
        
        base_username = prefix + serializer.validated_data.get('first_name', 'waiter').split()[0].lower()
        username = base_username
        counter = 1
        while CustomUser.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        serializer.save(hotel=hotel, username=username)

class EmployeeDeleteView(generics.DestroyAPIView):
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'ADMIN' and hasattr(self.request.user, 'hotel_settings'):
            return CustomUser.objects.filter(hotel=self.request.user.hotel_settings, role='WAITER')
        return CustomUser.objects.none()

from rest_framework_simplejwt.tokens import RefreshToken

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"detail": "Invalid token or token already blacklisted."}, status=status.HTTP_400_BAD_REQUEST)
