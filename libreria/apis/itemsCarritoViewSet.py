from rest_framework import serializers, viewsets

from libreria.apis import LibroSerializer
from libreria.models.itemsCarrito import ItemsCarrito


class ItemsCarritoSerializer(serializers.ModelSerializer):
    libro = LibroSerializer(read_only=True)
    class Meta:
        model = ItemsCarrito
        fields = '__all__'
        unique_together = ('carrito', 'libro')



class ItemsCarritoViewSet(viewsets.ModelViewSet):
    queryset = ItemsCarrito.objects.all()
    serializer_class = ItemsCarritoSerializer


