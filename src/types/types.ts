export interface ProductInterface{
    id:string,
    title:string,
    description:string,
    category:number,
    price:number,
    img:string,
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    phone: string;
    userType: string;
    password: string;
}

export interface ForgotPasswordData {
    email: string;
}

// Types for farm data
export interface FarmOwner {
    id?: number | string;
    name?: string;
    email?: string;
    phone?: string;
}

export interface Farm {
    id: number;
    name: string;
    location: string;
    size: number | string; // backend may return string from inputs; normalize on save if needed
    user?: FarmOwner | null;
    description?: string;
    createdAt?: string;
}

export interface FarmCreateInput {
    name: string;
    location: string;
    size: number | string;
}

