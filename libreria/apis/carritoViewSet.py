from django.utils import timezone
from django.utils.crypto import get_random_string
from rest_framework import serializers, viewsets, status
from django.db import IntegrityError, transaction
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from libreria.apis import ItemsCarritoSerializer, CompraSerializer
from libreria.models import Libro, Compras
from libreria.models.carrito import Carrito
from libreria.models.itemsCarrito import ItemsCarrito


class CarritoSerializer(serializers.ModelSerializer):
    items = ItemsCarritoSerializer(many=True, read_only=True)

    class Meta:
        model = Carrito
        fields = '__all__'


class CarritoViewSet(viewsets.ModelViewSet):
    queryset = Carrito.objects.all()
    serializer_class = CarritoSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='add-book')
    def add_book_to_cart(self, request):
        libro_id = request.data.get('libro_id')
        if not libro_id:
            return Response({"error": "ID del libro es requerido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            libro = Libro.objects.get(id=libro_id)
        except Libro.DoesNotExist:
            return Response({"error": "Libro no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        if request.user.is_authenticated:
            carrito, _ = Carrito.objects.get_or_create(usuario=request.user, activo=True)
        else:
            cart_session_key = request.session.get('cart_session_key')
            if not cart_session_key:
                cart_session_key = get_random_string(length=32)
                request.session['cart_session_key'] = cart_session_key
            try:
                carrito = Carrito.objects.get(sesion_key=cart_session_key, activo=True)
            except Carrito.DoesNotExist:
                carrito = Carrito.objects.create(sesion_key=cart_session_key, activo=True)

        try:
            ItemsCarrito.objects.create(
                carrito=carrito,
                libro=libro,
                precio_unitario_al_momento=libro.precio
            )

            carrito.fecha_actualizacion = timezone.now()
            carrito.save()
            return Response({"message": "Libro agregado al carrito."}, status=status.HTTP_201_CREATED)
        except IntegrityError:

            return Response({"message": "Este libro ya está en tu carrito."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Ocurrió un error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='remove-book')
    def remove_book_from_cart(self, request):
        libro_id = request.data.get('libro_id')
        if not libro_id:
            return Response({"error": "ID del libro es requerido."}, status=status.HTTP_400_BAD_REQUEST)


        if request.user.is_authenticated:
            try:
                carrito = Carrito.objects.get(usuario=request.user, activo=True)
            except Carrito.DoesNotExist:
                return Response({"message": "Tu carrito está vacío."}, status=status.HTTP_404_NOT_FOUND)
        else:
            cart_session_key = request.session.get('cart_session_key')
            if not cart_session_key:
                return Response({"message": "Tu carrito está vacío."}, status=status.HTTP_404_NOT_FOUND)
            try:
                carrito = Carrito.objects.get(sesion_key=cart_session_key, activo=True)
            except Carrito.DoesNotExist:
                return Response({"message": "Tu carrito está vacío."}, status=status.HTTP_404_NOT_FOUND)

        try:
            item_to_delete = ItemsCarrito.objects.get(carrito=carrito, libro__id=libro_id)
            item_to_delete.delete()

            carrito.fecha_actualizacion = timezone.now()
            carrito.save()
            return Response({"message": "Libro eliminado del carrito."}, status=status.HTTP_200_OK)
        except ItemsCarrito.DoesNotExist:
            return Response({"message": "Este libro no está en tu carrito."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Ocurrió un error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='my-cart')
    def get_my_cart_details(self, request):

        if request.user.is_authenticated:
            try:
                carrito = Carrito.objects.get(usuario=request.user, activo=True)
            except Carrito.DoesNotExist:
                return Response({"message": "Tu carrito está vacío."}, status=status.HTTP_404_NOT_FOUND)
        else:
            cart_session_key = request.session.get('cart_session_key')
            if not cart_session_key:
                return Response({"message": "Tu carrito está vacío."}, status=status.HTTP_404_NOT_FOUND)
            try:
                carrito = Carrito.objects.get(sesion_key=cart_session_key, activo=True)
            except Carrito.DoesNotExist:
                return Response({"message": "Tu carrito está vacío."}, status=status.HTTP_404_NOT_FOUND)


        total_items = carrito.items.count()
        subtotal = sum(item.precio_unitario_al_momento for item in carrito.items.all())


        serializer = self.get_serializer(carrito)
        data = serializer.data


        data['calculated_total_items'] = total_items
        data['calculated_subtotal'] = subtotal

        return Response(data, status=status.HTTP_200_OK)


    @action(detail=False, methods=['post'], url_path='confirm-payment',
            permission_classes=[IsAuthenticated],
            parser_classes=[MultiPartParser, FormParser])
    def confirm_payment(self, request):
        user = request.user
        comprobante_pago = request.FILES.get('image')

        if not comprobante_pago:
            return Response({"error": "Se requiere una imagen de comprobante de pago."},
                            status=status.HTTP_400_BAD_REQUEST)


        try:

            carrito = Carrito.objects.prefetch_related('items__libro').get(usuario=user, activo=True)

            if not carrito.items.exists():
                return Response({"message": "Tu carrito está vacío, no se puede confirmar una compra sin artículos."},
                                status=status.HTTP_400_BAD_REQUEST)


        except Carrito.DoesNotExist:
            return Response({"message": "No tienes un carrito activo para confirmar."},
                            status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": f"Ocurrió un error al procesar el pago fuera de la transacción: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        with transaction.atomic():
            try:
                total_compra = sum(item.precio_unitario_al_momento for item in carrito.items.all())


                compra = Compras.objects.create(
                    usuario=user,
                    carrito_original=carrito,
                    total_compra=total_compra,
                    comprobante_pago=comprobante_pago,
                    estado='pendiente'
                )


                carrito.activo = False
                carrito.save()


                serializer = CompraSerializer(compra)

                return Response(
                    {"message": "Confirmación de pago recibida. Tu compra está en estado 'pendiente'.",
                     "compra": serializer.data},
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                transaction.set_rollback(True)
                return Response({"error": f"Ocurrió un error al procesar el pago: {str(e)}"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


