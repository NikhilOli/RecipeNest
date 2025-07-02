export interface ChefProps {
    chefId: string;
    name: string;
    avatarUrl: string;
    email: string;
    bio: string;
    createdAt: string;
    updatedAt: string;
}

export interface RecipeProps {
    id: string;
    chefId: string;
    title: string;
    ingredients: string[];
    instructions: string;
    imageUrl: string;
    createdAt: string;
}

export interface FoodLoverProps {
    foodLoverId: string;
    name: string;
    avatarUrl?: string;
    email: string;
    createdAt: string;
}

export interface RatingProps {
    ratingId: string;
    recipeId: string;
    foodLoverId: string;
    rating: number;
    comment?: string;
    createdAt: string;
    updatedAt: string;
}