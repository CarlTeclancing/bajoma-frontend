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

