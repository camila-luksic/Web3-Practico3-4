from django.db import models
from django.conf import settings
# Assuming your Libro model is in 'libreria.models.libro'
from libreria.models.libro import Libro


class Carrito(models.Model):

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='carritos'
    )

    sesion_key = models.CharField(max_length=255, unique=True, null=True, blank=True)

    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)


    activo = models.BooleanField(default=True)

    def __str__(self):
        if self.usuario:
            return f"Carrito de {self.usuario.username} (ID: {self.id})"
        elif self.sesion_key:
            return f"Carrito Anónimo (Sesión: {self.sesion_key[:10]}...)"
        return f"Carrito ID: {self.id}"