import { Farmer, CreateFarmerDTO, UpdateFarmerDTO } from '../types/farmer';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/farmers`;

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

export async function getFarmer(farmerId: number): Promise<Farmer> {
    const response = await fetch(`${API_URL}/${farmerId}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Error fetching farmer');
    }
    return response.json();
}

export async function updateFarmer(farmerId: number, data: UpdateFarmerDTO): Promise<Farmer> {
    const response = await fetch(`${API_URL}/${farmerId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Error updating farmer');
    }
    return response.json();
}

export async function deleteFarmer(farmerId: number): Promise<void> {
    const response = await fetch(`${API_URL}/${farmerId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Error deleting farmer');
    }
}

export async function updateFarmerImage(farmerId: number, file: File): Promise<Farmer> {
    const formData = new FormData();
    formData.append('file', file);

    const user = localStorage.getItem('user');
    if (!user) {
        throw new Error('No hay usuario autenticado');
    }
    const { token } = JSON.parse(user);

    const response = await fetch(`${API_URL}/${farmerId}/farmerImage`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData,
    });
    if (!response.ok) {
        throw new Error('Error updating farmer image');
    }
    return response.json();
}

export async function deleteFarmerImage(farmerId: number): Promise<Farmer> {
    const response = await fetch(`${API_URL}/${farmerId}/farmerImage`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Error deleting farmer image');
    }
    return response.json();
}

export async function getAllFarmers(): Promise<Farmer[]> {
    const response = await fetch(API_URL, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Error fetching farmers');
    }
    return response.json();
}

export async function createFarmer(data: CreateFarmerDTO): Promise<Farmer> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Error creating farmer');
    }
    return response.json();
} 