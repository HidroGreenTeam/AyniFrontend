export interface Farmer {
    id: number;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    imageUrl: string;
}

export interface CreateFarmerDTO {
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export interface UpdateFarmerDTO {
    username: string;
    phoneNumber: string;
} 