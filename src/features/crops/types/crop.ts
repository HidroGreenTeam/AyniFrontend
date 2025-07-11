export interface Crop {
    id: number;
    cropName: string;
    area: number;
    plantingDate: string;
    farmerId: number;
    imageUrl: string;
    location: string;
}

export interface CreateCropDTO {
    cropName: string;
    area: number;
    plantingDate: string;
    location: string;
}

export interface UpdateCropDTO {
    cropName: string;
    area: number;
    plantingDate: string;
    location: string;
}
