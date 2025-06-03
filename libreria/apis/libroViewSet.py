from django.db.models import  Count
from django.db.models.functions import Coalesce
from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from libreria.apis.generoViewSet import GeneroSerializer
from libreria.models import Libro, Genero


class LibroSerializer(serializers.ModelSerializer):
    generos = GeneroSerializer(many=True, read_only=True)
    generos_id = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Genero.objects.all(), source='generos', write_only=True
    )
    total_vendidos = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Libro
        fields = '__all__'

        def update(self, instance, validated_data):
            print("--- UPDATE SERIALIZER ---")
            print(f"Instancia: {instance}")
            print(f"Validated Data: {validated_data}")

            generos_data = validated_data.pop('generos', None)


            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            print(f"Géneros Data: {generos_data}")
            if generos_data is not None:
                instance.generos.set(generos_data)
                print("Géneros actualizados via .set()")
            else:
                print("Géneros Data es None, no se actualiza la relación.")

            return instance


class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer

    def create(self, request, *args, **kwargs):
        generos_data = request.data.getlist('generos')
        libro = Libro.objects.create(
            nombre=request.data.get('nombre'),
            autor=request.data.get('autor'),
            precio=request.data.get('precio'),
            descripcion=request.data.get('descripcion'),
            isbn=request.data.get('isbn'),
            portada=request.data.get('portada'),
        )
        if generos_data:
            libro.generos.set(generos_data)
        serializer = self.get_serializer(libro)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        print("--- UPDATE VIEWSET ---")
        print(f"Request Data (Update): {request.data}")
        print(f"Request POST (Update): {request.POST}")
        print(f"Request FILES (Update): {request.FILES}")

        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):

            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='top-10-bestsellers')
    def get_top_10_bestsellers(self, request):

        top_books = Libro.objects.annotate(

            total_vendidos=Coalesce(Count('items_carrito'), 0)
        ).filter(
            items_carrito__carrito__compra_asociada__isnull=False
        ).order_by('-total_vendidos')[:10]

        serializer = self.get_serializer(top_books, many=True)
        return Response(serializer.data)

