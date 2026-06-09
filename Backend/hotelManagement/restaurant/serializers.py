from rest_framework import serializers
from .models import MenuItem, Table, Order, OrderItem

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ('id', 'name', 'description', 'price', 'category')

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ('id', 'table_number', 'capacity', 'is_occupied')

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source='menu_item.name', read_only=True)
    menu_item_id = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.all(), source='menu_item'
    )
    
    class Meta:
        model = OrderItem
        fields = ('id', 'menu_item_id', 'menu_item_name', 'quantity', 'price_at_time')
        read_only_fields = ('price_at_time',)

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    waiter_name = serializers.CharField(source='waiter.username', read_only=True)
    table_number = serializers.IntegerField(source='table.table_number', read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'table', 'table_number', 'waiter', 'waiter_name', 'status', 'total_amount', 'created_at', 'items')
        read_only_fields = ('waiter', 'total_amount', 'created_at', 'status')
