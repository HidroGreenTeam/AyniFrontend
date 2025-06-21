export interface Crop {
    id: number;
    cropName: string;
    irrigationType: string;
    area: number;
    plantingDate: string;
    farmerId: number;
    imageUrl: string;
}

export interface CreateCropDTO {
    cropName: string;
    irrigationType: 'Manual' | 'Automatic';
    area: number;
    plantingDate: string;
    farmerId: number;
}

export interface UpdateCropDTO {
    cropName: string;
    irrigationType: 'Manual' | 'Automatic';
    area: number;
    plantingDate: string;
    farmerId: number;
}

export interface UpdateIrrigationTypeDTO {
    irrigationType: 'Manual' | 'Automatic';
}

export type IrrigationType = 'Manual' | 'Automatic';
