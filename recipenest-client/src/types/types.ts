

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
}

export interface ProfileData {
    name: string;
    email: string;
    bio: string;
}