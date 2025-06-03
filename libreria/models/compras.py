from django.contrib.auth.models import User
from django.db import models

from libreria.models import Carrito


class Compras(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='compras')
    carrito_original = models.OneToOneField(Carrito, on_delete=models.SET_NULL, null=True, blank=True, related_name='compra_asociada')
    fecha_compra = models.DateTimeField(auto_now_add=True)
    total_compra = models.DecimalField(max_digits=10, decimal_places=2)
    comprobante_pago = models.ImageField(upload_to='comprobantes_pago/', null=True, blank=True)
    estado = models.CharField(max_length=50, default='pendiente')

    def __str__(self):
        return f"Compra #{self.id} de {self.usuario.username} - Total: ${self.total_compra}"

    def get_items(self):
        if self.carrito_original:
            return self.carrito_original.items.all()
        return None
