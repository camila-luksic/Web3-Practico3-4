from django.urls import path, include
from rest_framework import routers



from libreria.apis import GeneroViewSet, LibroViewSet, UserViewSet, CarritoViewSet, CompraViewSet

router = routers.DefaultRouter()
router.register('generos', GeneroViewSet)
router.register('libros', LibroViewSet)
router.register("auth", UserViewSet, basename='auth')
router.register('carritos', CarritoViewSet, basename='carrito')
router.register('compras', CompraViewSet, basename='compra')

urlpatterns = [
    path('', include(router.urls)),
]