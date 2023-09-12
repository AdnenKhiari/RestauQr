# Comprehensive Food Ordering and Kitchen Management Platform

This detailed food ordering and kitchen management platform caters to both customers and kitchen staff. It leverages technologies such as Firebase, Firebase Authentication (FireAuth), Firebase Cloud Storage (FireStorage), Firebase Cloud Messaging (FCM), Node.js, Express.js, RabbitMQ for Stripe webhooks, and Supplier Management. The platform includes two main fronts: one for customers and another for the kitchen staff.

## Customer Frontend

### Features:

1. **QR Code Scanning**:
   - Customers scan QR codes at tables to access the menu.

2. **Real-time Ordering**:
   - Customers can view the menu, select food items, and place orders in real-time.

3. **Order Tracking**:
   - Customers receive real-time updates on the status of their orders, from preparation to delivery.

4. **Stripe Payment Integration**:
   - Seamless payment processing using Stripe for secure and convenient transactions.

5. **User Authentication**:
   - Customers can create accounts, log in, and access order history.

### Technologies:

- **Firebase**:
   - Provides real-time database capabilities for order tracking.
   - Utilizes Firebase Authentication for user management.
   - Stores menu item images and resources in Firebase Cloud Storage.
   - Utilizes Firebase Cloud Messaging (FCM) for order status notifications.

## Kitchen Staff Frontend

### Features:

1. **Food Creation**:
   - Kitchen staff can create new food items, specifying ingredients, proportions, and custom options.

2. **Menu Creation**:
   - Easily create and manage the menu with customizable categories and items.

3. **Automatic Inventory Tracking**:
   - The system automatically manages food inventory based on orders and ingredient usage.

4. **Custom Options and Price Calculations**:
   - Create and configure custom options, allowing for ingredient linking and dynamic price calculations.

5. **Nested Food Creation**:
   - Define complex food items by assembling other foods and ingredients.

6. **Ingredient Control**:
   - Define and customize individual ingredients, including units and proportions.

7. **User Management with Roles**:
   - Assign roles and permissions to kitchen staff for efficient operation.

### Technologies:

- **Firebase**:
   - Stores menu data and manages real-time synchronization with the customer frontend.
   - Firebase Authentication for secure login to the kitchen staff frontend.

- **Node.js and Express.js**:
   - Backend server using Node.js and Express.js to handle kitchen-related operations.

- **RabbitMQ for Stripe Webhooks**:
   - Integrates RabbitMQ to handle Stripe webhooks for payment processing.

## Supplier Management

### Features:

1. **Ingredient Purchases Linking**:
   - The platform links ingredient purchases to specific suppliers to analyze supplier performance.

2. **Inventory Alerts**:
   - Get notifications for low ingredient inventory levels and automatically adjust stock based on historical supplier data.

### Technologies:

- **Integration with Firebase**:
   - Supplier data and ingredient purchase history are integrated with the main Firebase database.

## Workflow

1. Customers scan QR codes to access the menu via the customer frontend.

2. Customers browse the menu, make selections, and place orders in real-time.

3. The kitchen staff view incoming orders on the kitchen staff frontend.

4. Kitchen staff prepare orders with automatic inventory tracking and custom option calculations.

5. Customers receive notifications on order progress and make payments via Stripe.

6. Kitchen staff can create new menu items, manage ingredients, customize options, and create complex nested foods via the kitchen staff frontend.

7. The system tracks ingredient purchases and supplier data, providing insights into supplier performance.

This platform offers a dynamic and efficient food ordering and kitchen management solution, complete with automatic inventory management, custom options with price calculations, and supplier management for performance analysis. It leverages Firebase for real-time communication, Stripe for secure payments, and extensive customization capabilities for menu items, options, and ingredient management. User roles ensure a smooth operational workflow, and RabbitMQ handles Stripe webhooks for payment processing, ensuring reliability and security.
