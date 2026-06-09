from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView, RegisterView, HotelSettingsView, EmployeeListCreateView, EmployeeDeleteView, LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('hotel-setup/', HotelSettingsView.as_view(), name='hotel_setup'),
    path('employees/', EmployeeListCreateView.as_view(), name='employee_list_create'),
    path('employees/<int:pk>/', EmployeeDeleteView.as_view(), name='employee_delete'),
]
