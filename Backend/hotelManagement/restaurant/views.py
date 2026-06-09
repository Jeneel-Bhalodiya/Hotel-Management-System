from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import MenuItem, Table, Order, OrderItem
from .serializers import MenuItemSerializer, TableSerializer, OrderSerializer

def get_user_hotel(user):
    if hasattr(user, 'hotel_settings'):
        return user.hotel_settings
    return user.hotel

class MenuItemListCreateView(generics.ListCreateAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        hotel = get_user_hotel(self.request.user)
        return MenuItem.objects.filter(hotel=hotel)

    def perform_create(self, serializer):
        hotel = get_user_hotel(self.request.user)
        serializer.save(hotel=hotel)

class MenuItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        hotel = get_user_hotel(self.request.user)
        return MenuItem.objects.filter(hotel=hotel)

class TableListView(generics.ListAPIView):
    serializer_class = TableSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        hotel = get_user_hotel(self.request.user)
        return Table.objects.filter(hotel=hotel).order_by('table_number')

class TableUpdateView(generics.UpdateAPIView):
    serializer_class = TableSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        hotel = get_user_hotel(self.request.user)
        return Table.objects.filter(hotel=hotel)

class AddToOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        table_id = request.data.get('table_id')
        menu_item_id = request.data.get('menu_item_id')
        quantity = request.data.get('quantity', 1)

        try:
            hotel = get_user_hotel(request.user)
            table = Table.objects.get(id=table_id, hotel=hotel)
            menu_item = MenuItem.objects.get(id=menu_item_id, hotel=hotel)
        except (Table.DoesNotExist, MenuItem.DoesNotExist):
            return Response({"detail": "Invalid table or menu item."}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure table is marked as occupied
        if not table.is_occupied:
            table.is_occupied = True
            table.save()

        # Find or create active order
        hotel = get_user_hotel(request.user)
        order, created = Order.objects.get_or_create(
            table=table,
            status='ACTIVE',
            hotel=hotel,
            defaults={'waiter': request.user, 'total_amount': 0}
        )

        # Add or update item
        order_item, item_created = OrderItem.objects.get_or_create(
            order=order,
            menu_item=menu_item,
            defaults={'quantity': quantity, 'price_at_time': menu_item.price}
        )
        if not item_created:
            order_item.quantity += int(quantity)
            order_item.save()

        # Update total amount
        order.total_amount += (menu_item.price * int(quantity))
        order.save()

        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)

class CompleteOrderItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, item_id):
        # Frontend completeOrder removes it. Backend could delete the OrderItem.
        try:
            hotel = get_user_hotel(request.user)
            order_item = OrderItem.objects.get(id=item_id, order__hotel=hotel, order__status='ACTIVE')
            order = order_item.order
            # Deduct price
            order.total_amount -= (order_item.price_at_time * order_item.quantity)
            order.save()
            order_item.delete()
            return Response({"detail": "Item removed from order."}, status=status.HTTP_200_OK)
        except OrderItem.DoesNotExist:
            return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)

class ActiveOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        hotel = get_user_hotel(self.request.user)
        return Order.objects.filter(hotel=hotel, status='ACTIVE').order_by('-created_at')

class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, table_id):
        try:
            hotel = get_user_hotel(request.user)
            table = Table.objects.get(id=table_id, hotel=hotel)
            order = Order.objects.filter(table=table, status='ACTIVE', hotel=hotel).first()
            if order:
                order.status = 'PAID'
                order.save()
            
            table.is_occupied = False
            table.save()
            
            return Response({"detail": "Table cleared and order paid."}, status=status.HTTP_200_OK)
        except Table.DoesNotExist:
            return Response({"detail": "Table not found."}, status=status.HTTP_404_NOT_FOUND)
