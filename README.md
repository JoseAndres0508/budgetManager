# Control de economía personal

Aplicación web simple para llevar el control de tus finanzas personales: ingresos, gastos, mensualidades recurrentes y pagos pendientes.

## Características

- Registro de movimientos (ingresos y gastos) con descripción, monto y fecha
- Resumen automático de ingresos, gastos y saldo total
- Gestión de mensualidades fijas (alquiler, suscripciones, etc.) con día de pago
- Pagos pendientes con marca de vencido y opción de pasarlos a movimientos al pagarlos
- Datos guardados en el navegador (localStorage), sin necesidad de backend ni base de datos

## Estructura del proyecto

```
control-economia/
├── index.html   Estructura de la página
├── style.css    Estilos
└── app.js       Lógica de la aplicación
```

## Uso

No requiere instalación ni dependencias. Para usarla:

1. Clona el repositorio
2. Abre `index.html` en tu navegador

O publícala en cualquier hosting estático (GitHub Pages, Netlify, Vercel).

## Notas

Los datos se guardan localmente en el navegador mediante `localStorage`. Esto significa que:

- La información persiste entre visitas en el mismo navegador y dispositivo
- No se sincroniza entre dispositivos distintos
- Se pierde si limpias el caché o los datos del sitio en el navegador

## Tecnologías

HTML, CSS y JavaScript sin frameworks ni dependencias externas.