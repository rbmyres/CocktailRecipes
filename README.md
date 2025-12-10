# CocktailRecipes

A full-stack social platform for sharing and discovering cocktail recipes. Users can create, share, and explore cocktail recipes with a modern, responsive interface.

## Live Demo

**[View Live Application](https://mixer.rbmyres.com/)**

## Tech Stack

**Frontend:** React, Sass, Vite 
**Backend:** Node.js, Express.js, MySQL  
**Cloud Storage:** Cloudflare R2 
**Authentication:** JWT  
**Deployment:** AWS Lightsail VPS

## Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Recipe Management**: Create, edit, and delete cocktail recipes with images
- **Social Features**: Follow users, like recipes, and discover new content
- **Advanced Search**: Filter by spirit type, recipe name, or username
- **Image Upload**: Profile pictures and recipe images with cropping functionality
- **Privacy Controls**: Public/private recipe options
- **Admin Dashboard**: Content moderation and user management
- **Responsive Design**: Fully optimized for all screen sizes

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CocktailRecipes.git
   cd CocktailRecipes
   ```

2. **Install dependencies**
   
   Backend:
   ```bash
   cd server
   npm install
   ```
   
   Frontend:
   ```bash
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` files in both `/server` and `/client` directories:
   
   Server `.env`:
   ```env
   PORT=8080
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_DATABASE=cocktail_db
   ACCESS_TOKEN_SECRET=your_jwt_secret
   AWS_ACCESS_KEY_ID=your_r2_key
   AWS_SECRET_ACCESS_KEY=your_r2_secret
   CORS_ORIGIN=http://localhost:5173
   ```
   
   Client `.env`:
   ```env
   VITE_API_URL=http://localhost:8080
   ```

4. **Set up the database**
   ```bash
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE cocktail_db;
   USE cocktail_db;
   SOURCE cocktailRecipes.sql;
   ```

5. **Run the application**
   
   Backend:
   ```bash
   cd server
   npm run dev
   ```
   
   Frontend:
   ```bash
   cd client
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
CocktailRecipes/
├── client/                 # React frontend
│   ├── src/
│   │   ├── Components/    # Reusable components
│   │   ├── Pages/        # Page components
│   │   ├── styles/        # SCSS stylesheets
│   │   └── utils/         # Helper functions
│   └── package.json
├── server/                 # Express backend
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   └── server.js          # Entry point
└── cocktailRecipes.sql    # Database schema
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `GET /auth/auth` - Verify authentication
- `POST /auth/logout` - User logout

### Users
- `GET /user/:user_id` - Get user information
- `GET /user/profile/:username` - Get user profile by username
- `PUT /user/submit/changes` - Update user information
- `DELETE /user/delete/:user_id` - Delete user account

### Recipes
- `GET /post/small` - Get all public recipes
- `GET /post/:recipe_id` - Get single recipe details
- `POST /post/create` - Create new recipe
- `PUT /post/edit/:recipe_id` - Update recipe
- `DELETE /post/delete/:recipe_id` - Delete recipe

### Social Features
- `POST /follow` - Follow user
- `DELETE /follow` - Unfollow user
- `POST /like/:recipe_id` - Like recipe
- `DELETE /like/:recipe_id` - Unlike recipe

## Database Schema

The application uses MySQL with the following main tables:
- `users` - User accounts and profiles
- `recipes` - Cocktail recipes metadata
- `ingredients` - Recipe ingredients
- `directions` - Recipe instructions
- `likes` - User likes on recipes
- `follow` - User follow relationships
- `reports` - Content reports for moderation

## License

This project is licensed under the MIT License.

## Author

- GitHub: [@rbmyres](https://github.com/rbmyres)
- LinkedIn: [Reese Myres](https://linkedin.com/in/reese-myres)