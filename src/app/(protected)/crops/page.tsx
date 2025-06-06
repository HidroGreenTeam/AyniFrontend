"use client";

import { Plus, Sprout } from "lucide-react";
import { useState, useEffect } from "react";
import { useCrops } from "@/features/crops/hooks/useCrops";
import { useAuth } from "@/features/auth/hooks/useAuth";
import CropForm from "@/features/crops/components/CropForm";
import CropDetail from "@/features/crops/components/CropDetail";
import CropsList from "@/features/crops/components/CropsList";
import CropsFilters from "@/features/crops/components/CropsFilters";
import { Crop, CreateCropDTO, UpdateCropDTO } from "@/features/crops/types/crop";

export default function CropsPage() {
  const { user } = useAuth();  const { 
    crops, 
    loading, 
    error, 
    fetchCropsByFarmerId, 
    createCrop, 
    updateCropData, 
    removeCrop, 
    updateImage, 
    updateIrrigationType 
  } = useCrops();
  
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Load crops for the current farmer
  useEffect(() => {
    if (user?.id) {
      fetchCropsByFarmerId(user.id);
    }
  }, [user?.id, fetchCropsByFarmerId]);

  // Filter crops based on selected filters
  const filteredCrops = crops.filter(crop => {
    const typeMatch = filterType === 'all' || crop.cropName.toLowerCase().includes(filterType.toLowerCase());
    // For now, we'll consider all crops as 'healthy' for the status filter
    const statusMatch = filterStatus === 'all' || filterStatus === 'healthy';
    return typeMatch && statusMatch;
  });

  const handleCreateCrop = async (data: CreateCropDTO, file?: File) => {
    if (!file) {
      throw new Error('Image is required');
    }
    await createCrop(data, file);
    setShowForm(false);
  };

  const handleUpdateCrop = async (data: UpdateCropDTO, file?: File) => {
    if (!editingCrop) return;
    
    await updateCropData(editingCrop.id, data);
    if (file) {
      await updateImage(editingCrop.id, file);
    }
    setEditingCrop(null);
    setShowForm(false);
  };

  const handleDeleteCrop = async (cropId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cultivo?')) {
      await removeCrop(cropId);
    }
  };

  const handleViewCrop = (crop: Crop) => {
    setSelectedCrop(crop);
    setShowDetail(true);
  };

  const handleEditCrop = (crop: Crop) => {
    setEditingCrop(crop);
    setShowForm(true);
  };

  const handleUpdateImage = async (cropId: number, file: File) => {
    await updateImage(cropId, file);
  };

  const handleUpdateIrrigationType = async (cropId: number, data: { irrigationType: 'Manual' | 'Automatic' }) => {
    await updateIrrigationType(cropId, data);
  };

  // Get unique crop types for filter
  const cropTypes = Array.from(new Set(crops.map(crop => crop.cropName)));

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado de página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <Sprout className="mr-2 h-6 w-6 text-green-600" />
            Mis Cultivos
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gestiona y monitorea el estado de tus cultivos activos
          </p>
        </div>

        <button 
          onClick={() => {
            setEditingCrop(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo cultivo
        </button>
      </div>      {/* Filtros */}
      <CropsFilters
        filterType={filterType}
        filterStatus={filterStatus}
        cropTypes={cropTypes}
        onFilterTypeChange={setFilterType}
        onFilterStatusChange={setFilterStatus}
      />

      {/* Listado de cultivos */}
      <CropsList
        crops={filteredCrops}
        loading={loading}
        onEdit={handleEditCrop}
        onDelete={handleDeleteCrop}
        onView={handleViewCrop}
        onUpdateImage={handleUpdateImage}
        onCreateNew={() => {
          setEditingCrop(null);
          setShowForm(true);
        }}
      />

      {/* Formulario de cultivo */}
      <CropForm
        crop={editingCrop}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCrop(null);
        }}
        onSubmit={editingCrop ? handleUpdateCrop : handleCreateCrop}
        title={editingCrop ? 'Editar Cultivo' : 'Nuevo Cultivo'}
      />

      {/* Detalle del cultivo */}
      <CropDetail
        crop={selectedCrop}
        isOpen={showDetail}
        onClose={() => {
          setShowDetail(false);
          setSelectedCrop(null);
        }}
        onEdit={handleEditCrop}
        onDelete={handleDeleteCrop}
        onUpdateImage={handleUpdateImage}
        onUpdateIrrigationType={handleUpdateIrrigationType}
      />
    </div>
  );
}