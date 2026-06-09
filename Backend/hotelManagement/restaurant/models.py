from django.db import models
from accounts.models import HotelSettings, CustomUser

class MenuItem(models.Model):
    hotel = models.ForeignKey(HotelSettings, on_delete=models.CASCADE, related_name='menu_items')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} - {self.hotel.hotel_name}"

class Table(models.Model):
    hotel = models.ForeignKey(HotelSettings, on_delete=models.CASCADE, related_name='tables')
    table_number = models.IntegerField()
    capacity = models.IntegerField(default=4)
    is_occupied = models.BooleanField(default=False)

    def __str__(self):
        return f"Table {self.table_number} - {self.hotel.hotel_name}"

class Order(models.Model):
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('PAID', 'Paid'),
    )
    hotel = models.ForeignKey(HotelSettings, on_delete=models.CASCADE, related_name='orders')
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='orders')
    waiter = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='handled_orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} for Table {self.table.table_number}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price_at_time = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name} (Order {self.order.id})"

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=HotelSettings)
def create_tables(sender, instance, created, **kwargs):
    if created:
        for i in range(1, instance.total_tables + 1):
            Table.objects.create(hotel=instance, table_number=i)
    else:
        # If admin increases tables, add new ones
        existing_count = Table.objects.filter(hotel=instance).count()
        if instance.total_tables > existing_count:
            for i in range(existing_count + 1, instance.total_tables + 1):
                Table.objects.create(hotel=instance, table_number=i)

