export const URLS = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    GENEROS: {
          LIST: '/generos',
        CREATE: '/generos/create',
        EDIT: "/generos/:id",
        UPDATE: (id: string) => {
            return `/generos/${id}`
        }
    },
    LIBROS: {
        LIST: '/libros',
        CREATE: '/libros/create',
        DETAIL: (id: string) => `/libros/detalle/${id}`,
        EDIT: "/libros/:id",
        UPDATE: (id: string) => {
            return `/libros/${id}`
        }
    },
    CARRITO: '/my-cart',
    PAGO_CONFIRMACION: '/payment-confirmation',
    PAGO_COMPLETADO: '/payment-completed',
    COMPRAS: {
        LIST: '/my-purchases',
        DETAIL: (id: string) => `/my-purchases/${id}`,
    },
    TOP_SELLERS: '/top-sellers',

}