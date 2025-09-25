export default interface RecipeModel {
    id: string;
    title?: string;
    prepTime?: string;
    cookTime?: string;
    ingredients: {
        name: string;
        quantity: number;
        unit: string | null;
    }[];
    instructions?: string[];
    notes?: string;
    tags?: string[];
    imageUrl?: string;
}