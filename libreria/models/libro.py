from django.db import models

from libreria.models.genero import Genero


class Libro(models.Model):
    nombre = models.CharField(max_length=100)
    autor = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=100)
    precio = models.IntegerField()
    isbn = models.CharField(max_length=20)
    portada = models.ImageField(upload_to='books_pictures/')

    generos = models.ManyToManyField(Genero, related_name='libros')

    def __str__(self):
        return self.nombre