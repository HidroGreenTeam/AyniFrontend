"use client";

import {
    AlertTriangle,
    Camera,
    Check,
    Edit,
    Mail,
    Phone,
    User,
    X,
    Coffee,
    Activity,
    Shield,
    Target
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFarmerProfile } from "@/features/farmers/hooks/useFarmerProfile";
import { useDiagnosisStats } from "@/features/diagnosis/hooks/useDiagnosisStats";
import { UpdateFarmerDTO } from "@/features/farmers/types/farmer";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCrops } from "@/features/crops/hooks/useCrops";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [imageMessage, setImageMessage] = useState("");
    const [imageError, setImageError] = useState("");
    
    // Usar el hook de perfil del agricultor
    const { farmer, loading, error, fetchFarmer, updateProfile, updateImage } = useFarmerProfile();
    
    // Usar el hook de cultivos y diagnósticos
    const { user } = useAuth();
    const { crops } = useCrops(user as { id: number; [key: string]: unknown } | null);
    const { stats: diagnosisStats, isLoading: statsLoading } = useDiagnosisStats();

    // Estado actual del perfil (para edición)
    const [perfil, setPerfil] = useState<UpdateFarmerDTO>({
        username: "",
        phoneNumber: ""
    });
    const [originalPerfil, setOriginalPerfil] = useState<UpdateFarmerDTO>({ username: "", phoneNumber: "" });

    // Datos del formulario con validación
    const [formErrors, setFormErrors] = useState({
        username: "",
        phoneNumber: ""
    });

    // Estado para notificaciones
    const [notificationPrefs, setNotificationPrefs] = useState({
        alertasEnfermedades: true,
        recordatoriosTratamientos: true,
        consejosRecomendaciones: false
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Cargar datos del perfil solo una vez al montar el componente
    useEffect(() => {
        fetchFarmer();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Actualizar estado local cuando cambian los datos del agricultor
    useEffect(() => {
        if (farmer) {
            setPerfil({
                username: farmer.username,
                phoneNumber: farmer.phoneNumber || ""
            });
            setOriginalPerfil({
                username: farmer.username,
                phoneNumber: farmer.phoneNumber || ""
            });
        }
    }, [farmer]);

    const validateForm = () => {
        let isValid = true;
        const errors = {
            username: "",
            phoneNumber: ""
        };
        
        // Validación del nombre de usuario
        if (!perfil.username.trim()) {
            errors.username = "El nombre de usuario es obligatorio";
            isValid = false;
        }
        
        // Validación del teléfono
        if (perfil.phoneNumber.trim() && !/^[+]?[\d\s()-]{7,}$/.test(perfil.phoneNumber)) {
            errors.phoneNumber = "Formato de teléfono inválido";
            isValid = false;
        }
        
        setFormErrors(errors);
        return isValid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPerfil(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar error cuando el usuario está escribiendo
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setNotificationPrefs(prev => ({
            ...prev,
            [name]: checked
        }));
    };
    
    const handleEditToggle = () => {
        if (isEditing) {
            // Si estamos cancelando la edición, restauramos los datos del agricultor
            if (farmer) {
                setPerfil({
                    username: farmer.username,
                    phoneNumber: farmer.phoneNumber || ""
                });
            }
            setFormErrors({
                username: "",
                phoneNumber: ""
            });
        }
        setIsEditing(!isEditing);
    };
    
    const handleSaveProfile = async () => {
        if (!validateForm()) {
            setErrorMessage("Por favor, corrige los errores antes de guardar.");
            setTimeout(() => setErrorMessage(""), 5000);
            return;
        }
        
        try {
            await updateProfile(perfil);
            setIsEditing(false);
            setSuccessMessage("¡Perfil actualizado correctamente!");
            setTimeout(() => setSuccessMessage(""), 5000);        } catch {
            setErrorMessage("Error al actualizar el perfil. Por favor, intenta de nuevo.");
            setTimeout(() => setErrorMessage(""), 5000);
        }
    };
    
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file)); // preview inmediato
            try {
                await updateImage(file);
                setImageMessage("¡Imagen de perfil actualizada!");
                setTimeout(() => setImageMessage(""), 5000);
            } catch {
                setImageError("Error al actualizar la imagen. Por favor, intenta de nuevo.");
                setTimeout(() => setImageError(""), 5000);
            }
        }
    };

    const handleRemoveImage = async () => {
        try {
            // For now, we'll just update the preview. In a real app, you'd call a removeImage function
            setImagePreview(null);
            setImageMessage("Imagen de perfil eliminada");
            setTimeout(() => setImageMessage(""), 5000);
        } catch {
            setImageError("Error al eliminar la imagen. Por favor, intenta de nuevo.");
            setTimeout(() => setImageError(""), 5000);
        }
    };

    // Limpiar el preview cuando la imagen del farmer cambie (después de guardar)
    useEffect(() => {
        setImagePreview(null);
    }, [farmer?.imageUrl]);

    const isPerfilChanged = perfil.username !== originalPerfil.username || perfil.phoneNumber !== originalPerfil.phoneNumber;

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!farmer) {
        return <div>No se encontró el perfil</div>;
    }

    return (
        <div className="space-y-6">
            {/* Encabezado de página */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                    <User className="mr-2 h-6 w-6 text-green-600" />
                    {farmer ? `Perfil de ${farmer.username}` : 'Mi Perfil'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Gestiona tu información personal y preferencias
                </p>
            </div>
            
            {/* Mensajes de notificación */}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center" role="alert">
                    <Check className="h-5 w-5 mr-2" />
                    <span>{successMessage}</span>
                    <button 
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        onClick={() => setSuccessMessage("")}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}
            
            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center" role="alert">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span>{errorMessage}</span>
                    <button 
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        onClick={() => setErrorMessage("")}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}
            {imageMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center" role="alert">
                    <Check className="h-5 w-5 mr-2" />
                    <span>{imageMessage}</span>
                    <button 
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        onClick={() => setImageMessage("")}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}
            {imageError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center" role="alert">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span>{imageError}</span>
                    <button 
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        onClick={() => setImageError("")}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Encabezado de perfil con banner */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-32 relative">
                    <div className="absolute top-4 right-4 flex space-x-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleEditToggle}
                                    className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
                                    title="Cancelar"
                                >
                                    <X className="h-5 w-5 text-red-600" />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleEditToggle}
                                className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
                                title="Editar perfil"
                            >
                                <Edit className="h-5 w-5 text-green-600" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="px-6 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-4 sm:space-x-5">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700">
                                {farmer?.imageUrl ? (
                                    <Image
                                        src={imagePreview || farmer.imageUrl}
                                        alt={`Foto de perfil de ${farmer.username}`}
                                        className="h-full w-full object-cover"
                                        width={128}
                                        height={128}
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                        <User className="h-16 w-16 text-gray-400" />
                                    </div>
                                )}
                                {isEditing && (farmer?.imageUrl || imagePreview) && (
                                    <button
                                        type="button"
                                        className="absolute top-0 left-0 bg-red-600 text-white p-2 rounded-full shadow-sm hover:bg-red-700 transition-colors"
                                        title="Eliminar imagen"
                                        onClick={handleRemoveImage}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer shadow-sm hover:bg-green-700 transition-colors">
                                    <Camera className="h-4 w-4" />
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>

                        <div className="mt-4 sm:mt-0 flex-1">
                            {isEditing ? (
                                <div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={perfil.username}
                                        onChange={handleInputChange}
                                        className={`text-2xl font-bold text-gray-800 dark:text-white bg-transparent border-b ${
                                            formErrors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } focus:outline-none focus:border-green-500 w-full`}
                                        placeholder="Tu nombre de usuario"
                                    />
                                    {formErrors.username && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
                                    )}
                                </div>
                            ) : (
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{farmer?.username}</h2>
                            )}
                            <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                                <Mail className="h-4 w-4 mr-1" />
                                <span>{farmer?.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Información de contacto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Información de contacto</h3>

                            <div className="space-y-3">
                                <div className="flex flex-col">
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Phone className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                                        {isEditing ? (
                                            <div className="flex-1">
                                                <input
                                                    type="tel"
                                                    name="phoneNumber"
                                                    value={perfil.phoneNumber}
                                                    onChange={handleInputChange}
                                                    className={`bg-transparent border-b ${
                                                        formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    } focus:outline-none focus:border-green-500 w-full`}
                                                    placeholder="+00 000 000 000"
                                                />
                                                {formErrors.phoneNumber && (
                                                    <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <span>{farmer?.phoneNumber}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                            Estadísticas de actividad
                        </h3>
                        
                        {statsLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 animate-pulse">
                                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                                        <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 mb-2">
                                        <Coffee className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {crops.length}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        Cultivos activos
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 mb-2">
                                        <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {diagnosisStats.total}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        Diagnósticos totales
                                    </div>
                                </div>

                                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 text-center">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-800 mb-2">
                                        <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {diagnosisStats.thisMonth}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        Este mes
                                    </div>
                                </div>

                                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 text-center">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-800 mb-2">
                                        <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {diagnosisStats.healthyCrops}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        Cultivos saludables
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Estadísticas adicionales si hay diagnósticos */}
                        {!statsLoading && diagnosisStats.total > 0 && (
                            <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                            {diagnosisStats.thisWeek}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            Esta semana
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                                            {diagnosisStats.diseaseDetected}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            Enfermedades detectadas
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                                            {diagnosisStats.requiresTreatment}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            Requieren tratamiento
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Configuraciones adicionales */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Preferencias de notificaciones</h3>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-gray-700 dark:text-gray-200">Alertas de enfermedades</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Recibe notificaciones cuando se detecten enfermedades en tus cultivos</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                name="alertasEnfermedades"
                                checked={notificationPrefs.alertasEnfermedades} 
                                onChange={handleCheckboxChange}
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-gray-700 dark:text-gray-200">Recordatorios de tratamientos</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Recibe notificaciones sobre tratamientos programados</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                name="recordatoriosTratamientos"
                                checked={notificationPrefs.recordatoriosTratamientos} 
                                onChange={handleCheckboxChange}
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-gray-700 dark:text-gray-200">Consejos y recomendaciones</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Recibe consejos personalizados para mejorar tus cultivos</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                name="consejosRecomendaciones"
                                checked={notificationPrefs.consejosRecomendaciones} 
                                onChange={handleCheckboxChange}
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Botón guardar para mejor UX móvil */}
            {isEditing && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4 md:hidden">
                    <button
                        onClick={handleEditToggle}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        disabled={!isPerfilChanged}
                    >
                        Guardar cambios
                    </button>
                </div>
            )}
        </div>
    );
}