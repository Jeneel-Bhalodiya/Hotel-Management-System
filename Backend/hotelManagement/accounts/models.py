from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('WAITER', 'Waiter'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='WAITER')
    hotel = models.ForeignKey('HotelSettings', on_delete=models.CASCADE, null=True, blank=True, related_name='employees')
    salary = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.username} - {self.role}"

class HotelSettings(models.Model):
    admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='hotel_settings')
    hotel_name = models.CharField(max_length=255)
    hotel_address = models.CharField(max_length=255)
    total_tables = models.IntegerField()
    total_employees = models.IntegerField()

    def __str__(self):
        return f"{self.hotel_name} ({self.admin.username})"
