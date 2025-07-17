

export interface RecipeDetailProps {
    userId: string;
    recipeId: string;
    title: string;
    chefName: string;
    ingredients: string;
    instructions: string;
    imageUrl?: string;
    createdAt?: string;
}

export interface ChefProps {
    userId: string;
    name: string;
    bio: string;
    email?: string;
    recipesCount?: number;
    createdAt?: string;
    followers?: number;
    avgRating?: number;
    totalLikes?: number;
}

export interface ProfileData {
    name: string;
    email: string;
    bio: string;
}

export interface Recipe {
    recipeId: string;
    title: string;
    ingredients: string;
    instructions: string;
    createdAt: string;
    avgRating: number;
    likes: number;
    imageUrl?: string;
}

export interface RatingInfo {
    ratingId: string;
    userId: string;
    stars: number;
    comment?: string;
}
export interface User {
    userId: string;
    name: string;
    email?: string;
    role: string;
    followersCount?: number;
    recipesCount?: number;
}