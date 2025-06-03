from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated

from libreria.apis import ItemsCarritoSerializer
from libreria.models import Compras

class CompraSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    items_comprados = serializers.SerializerMethodField()

    class Meta:
        model = Compras
        fields = '__all__'
    def get_items_comprados(self, obj):
        if obj.carrito_original:
            return ItemsCarritoSerializer(obj.carrito_original.items.all(), many=True, read_only=True).data
        return []

class CompraViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Compras.objects.all()
    serializer_class = CompraSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Compras.objects.filter(usuario=self.request.user).order_by('-fecha_compra')
