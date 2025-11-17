# ShopHub - E-commerce Management System

A modern, responsive React-based e-commerce management dashboard built with Tailwind CSS and integrated with a Spring Boot backend API.

## Features

### 🏠 Dashboard
- Overview statistics (products, customers, orders, payments)
- Recent orders tracking
- Quick action buttons
- System status monitoring

### 📦 Product Management
- Product catalog with images, descriptions, and pricing
- Category organization
- Inventory tracking
- Search and filtering capabilities

### 👥 Customer Management
- Customer database with contact information
- Address and phone number management
- Customer search and filtering

### 🛒 Order Management
- Order creation and tracking
- Status management (Pending, Processing, Shipped, Delivered, Cancelled)
- Order items with product selection
- Total calculation

### 💳 Payment Management
- Payment transaction tracking
- Multiple payment methods (Credit Card, PayPal, Bank Transfer, Cash on Delivery)
- Payment status monitoring
- Transaction ID management

### 🏢 Business Management
- Business partner accounts
- Logo and website management
- Contact information tracking

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Utilities**: clsx, tailwind-merge
- **Backend**: Spring Boot REST API

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8080`

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Top navigation bar
│   ├── Sidebar.js      # Left sidebar navigation
│   ├── ProductForm.js  # Product creation/editing form
│   ├── CategoryForm.js # Category management form
│   ├── CustomerForm.js # Customer management form
│   ├── OrderForm.js    # Order creation/editing form
│   ├── PaymentForm.js  # Payment management form
│   └── BusinessForm.js # Business management form
├── pages/              # Main page components
│   ├── Dashboard.js    # Main dashboard
│   ├── Products.js     # Products listing page
│   ├── Categories.js   # Categories management
│   ├── Customers.js    # Customers listing page
│   ├── Orders.js       # Orders management page
│   ├── Payments.js     # Payments tracking page
│   └── Businesses.js   # Business partners page
├── services/           # API service layer
│   └── api.js         # HTTP client and API endpoints
├── utils/              # Utility functions
│   └── index.js       # Helper functions and formatters
├── App.js              # Main application component
└── index.js            # Application entry point
```

## API Integration

The application integrates with the following backend endpoints:

- **Products**: `/product` (GET, POST, PUT, DELETE)
- **Categories**: `/category` (GET, POST, PUT, DELETE)
- **Customers**: `/costumer` (GET, POST, PUT, DELETE)
- **Orders**: `/order` (GET, POST, PUT, DELETE)
- **Payments**: `/payment` (GET, POST, PUT, DELETE)
- **Businesses**: `/business` (GET, POST, PUT, DELETE)

## Key Features

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interface

### Search and Filtering
- Real-time search across all entities
- Advanced filtering options
- Sortable data tables

### Form Validation
- Client-side validation
- Error handling and display
- User-friendly error messages

### Data Management
- CRUD operations for all entities
- Optimistic updates
- Loading states and error handling

## Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update color schemes in `src/index.css`
- Customize component styles using Tailwind classes

### API Configuration
- Update API base URL in `src/services/api.js`
- Modify endpoint configurations as needed
- Add new API services for additional features

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Note**: Make sure your backend API is running and accessible at `http://localhost:8080` before starting the frontend application.
