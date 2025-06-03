from libreria.models import Libro

from django.db import models

from libreria.models.carrito import Carrito


class ItemsCarrito(models.Model):
    carrito = models.ForeignKey(
        Carrito,
        on_delete=models.CASCADE,
        related_name='items'
    )
    libro = models.ForeignKey(
        Libro,
        on_delete=models.CASCADE,
        related_name='items_carrito'
    )

    precio_unitario_al_momento = models.DecimalField(max_digits=10, decimal_places=2)

    fecha_agregado = models.DateTimeField(auto_now_add=True)


