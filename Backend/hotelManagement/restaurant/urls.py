from django.urls import path
from .views import (
    MenuItemListCreateView, MenuItemDetailView,
    TableListView, TableUpdateView,
    AddToOrderView, CompleteOrderItemView,
    ActiveOrdersView, CheckoutView
)

urlpatterns = [
    path('menu/', MenuItemListCreateView.as_view(), name='menu_list_create'),
    path('menu/<int:pk>/', MenuItemDetailView.as_view(), name='menu_detail'),
    path('tables/', TableListView.as_view(), name='table_list'),
    path('tables/<int:pk>/', TableUpdateView.as_view(), name='table_update'),
    path('orders/', ActiveOrdersView.as_view(), name='active_orders'),
    path('add-to-order/', AddToOrderView.as_view(), name='add_to_order'),
    path('remove-order-item/<int:item_id>/', CompleteOrderItemView.as_view(), name='remove_order_item'),
    path('checkout/<int:table_id>/', CheckoutView.as_view(), name='checkout'),
]
