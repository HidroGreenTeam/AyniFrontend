import { Crop, CreateCropDTO, UpdateCropDTO, UpdateIrrigationTypeDTO } from '../types/crop';

const API_URL = 'http://localhost:8080/api/v1/crops';

// Función helper para obtener los headers con el token
const getAuthHeaders = () => {
    const user = localStorage.getItem('user');
    if (!user) {
        throw new Error('No hay usuario autenticado');
    }
    const { token } = JSON.parse(user);
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

// Función helper para obtener headers para form data
const getAuthHeadersForFormData = () => {
    const user = localStorage.getItem('user');
    if (!user) {
        throw new Error('No hay usuario autenticado');
    }
    const { token } = JSON.parse(user);
    return {
        'Authorization': `Bearer ${token}`
    };
};

// GET /api/v1/crops/{cropId} - Get a crop by cropId
export async function getCrop(cropId: number): Promise<Crop> {
    const response = await fetch(`${API_URL}/${cropId}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Error fetching crop');
    }
    return response.json();
}

// PUT /api/v1/crops/{cropId} - Update a crop by cropId (only the crop data) | NO IMAGE UPDATE
export async function updateCrop(cropId: number, data: UpdateCropDTO): Promise<Crop> {
    const response = await fetch(`${API_URL}/${cropId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Error updating crop');
    }
    return response.json();
}

// DELETE /api/v1/crops/{cropId} - Delete a crop by cropId
export async function deleteCrop(cropId: number): Promise<void> {
    const response = await fetch(`${API_URL}/${cropId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Error deleting crop');
    }
}

// PUT /api/v1/crops/{cropId}/cropImage - Update a crop image by cropId
export async function updateCropImage(cropId: number, file: File): Promise<Crop> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/${cropId}/cropImage`, {
        method: 'PUT',
        headers: getAuthHeadersForFormData(),
        body: formData,
    });
    if (!response.ok) {
        throw new Error('Error updating crop image');
    }
    return response.json();
}

// DELETE /api/v1/crops/{cropId}/cropImage - Delete a crop image by cropId
export async function deleteCropImage(cropId: number): Promise<Crop> {
    const response = await fetch(`${API_URL}/${cropId}/cropImage`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Error deleting crop image');
    }
    return response.json();
}

// GET /api/v1/crops - Get all crops
export async function getAllCrops(): Promise<Crop[]> {
    const response = await fetch(API_URL, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Error fetching crops');
    }
    return response.json();
}

// POST /api/v1/crops - Create a crop with an image
export async function createCropWithImage(cropData: CreateCropDTO, file: File): Promise<Crop> {
    console.log('Creating crop with data:', cropData);
    console.log('File:', file);
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Create a blob with the JSON data and proper content type
    const cropBlob = new Blob([JSON.stringify(cropData)], {
        type: 'application/json'
    });
    formData.append('crop', cropBlob);

    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeadersForFormData(),
        body: formData,
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Error creating crop: ${response.status} ${response.statusText} - ${errorText}`);
    }
    return response.json();
}

// POST /api/v1/crops - Create a crop without image (for testing)
export async function createCrop(cropData: CreateCropDTO): Promise<Crop> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(cropData),
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Error creating crop: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

// PATCH /api/v1/crops/{cropId}/irrigationType - Update the irrigation type of a crop by cropId
export async function updateCropIrrigationType(cropId: number, data: UpdateIrrigationTypeDTO): Promise<Crop> {
    const response = await fetch(`${API_URL}/${cropId}/irrigationType`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Error updating crop irrigation type');
    }
    return response.json();
}

// GET /api/v1/crops/farmer/{farmerId}/crops - Get all crops for a specific farmer
export async function getCropsByFarmerId(farmerId: number): Promise<Crop[]> {
    const response = await fetch(`${API_URL}/farmer/${farmerId}/crops`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Error fetching crops for farmer');
    }
    return response.json();
}
