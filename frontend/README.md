# React Console UI

Standalone interactive frontend for the Spring Boot supermarket API.

## Stack

- React
- Vite
- Axios

## Run

1. Start the Spring Boot backend on `http://localhost:8080`
2. From the `frontend` folder run:

```bash
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173`.

## Built-in credential presets

- `admin / admin123`
- `customer_manager / cust123`
- `inventory_manager / inv123`
- `order_manager / order123`
- `billing_manager / bill123`
- `shipping_manager / ship123`

## Notes

- Reads are open.
- Create and update use HTTP Basic auth through Axios.
- Delete is currently open because the backend leaves delete routes public.
