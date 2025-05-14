"use client";

import {
    AlertTriangle,
    Briefcase,
    Calendar,
    Camera,
    Check,
    Edit,
    Mail,
    MapPin,
    Phone,
    Save,
    User,
    X
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    
    // Estado original del perfil
    const [perfilOriginal, setPerfilOriginal] = useState({
        nombre: "",
        email: "",
        telefono: "",
        ubicacion: "",
        ocupacion: "",
        fechaRegistro: "",
        bio: "",
        avatar: "/placeholder.svg"
    });
    
    // Estado actual del perfil (para edición)
    const [perfil, setPerfil] = useState({
        nombre: "",
        email: "",
        telefono: "",
        ubicacion: "",
        ocupacion: "",
        fechaRegistro: "",
        bio: "",
        avatar: "/placeholder.svg"
    });

    // Datos del formulario con validación
    const [formErrors, setFormErrors] = useState({
        nombre: "",
        email: "",
        telefono: "",
        ubicacion: "",
        ocupacion: "",
        bio: ""
    });

    // Estado para notificaciones
    const [notificationPrefs, setNotificationPrefs] = useState({
        alertasEnfermedades: true,
        recordatoriosTratamientos: true,
        consejosRecomendaciones: false
    });

    // Simular carga de datos del usuario
    useEffect(() => {
        // En un caso real, aquí cargarías los datos del usuario desde la API
        const userData = {
            nombre: "Carlos Mendoza",
            email: "carlos.mendoza@ejemplo.com",
            telefono: "+51 987 654 321",
            ubicacion: "Lima, Perú",
            ocupacion: "Agricultor",
            fechaRegistro: "Enero 2025",
            bio: "Agricultor experimentado con más de 15 años cultivando diversas hortalizas y frutas en la región de Lima. Especializado en agricultura sostenible y control de plagas mediante métodos naturales.",
            avatar: "/placeholder.svg"
        };
        
        setPerfil(userData);
        setPerfilOriginal(userData);
    }, []);

    const validateForm = () => {
        let isValid = true;
        const errors = {
            nombre: "",
            email: "",
            telefono: "",
            ubicacion: "",
            ocupacion: "",
            bio: ""
        };
        
        // Validación del nombre
        if (!perfil.nombre.trim()) {
            errors.nombre = "El nombre es obligatorio";
            isValid = false;
        }
        
        // Validación del email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!perfil.email.trim()) {
            errors.email = "El email es obligatorio";
            isValid = false;
        } else if (!emailRegex.test(perfil.email)) {
            errors.email = "Formato de email inválido";
            isValid = false;
        }
        
        // Validación del teléfono (opcional)
        if (perfil.telefono.trim() && !/^[+]?[\d\s()-]{7,}$/.test(perfil.telefono)) {
            errors.telefono = "Formato de teléfono inválido";
            isValid = false;
        }
        
        setFormErrors(errors);
        return isValid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            // Si estamos cancelando la edición, restauramos el estado original
            setPerfil(perfilOriginal);
            setFormErrors({
                nombre: "",
                email: "",
                telefono: "",
                ubicacion: "",
                ocupacion: "",
                bio: ""
            });
        }
        setIsEditing(!isEditing);
    };
    
    const handleSaveProfile = () => {
        if (!validateForm()) {
            setErrorMessage("Por favor, corrige los errores antes de guardar.");
            setTimeout(() => setErrorMessage(""), 5000);
            return;
        }
        
        // Aquí enviarías los datos a tu API
        console.log("Guardando perfil:", perfil);
        
        // Actualizar el perfil original con los nuevos datos
        setPerfilOriginal({...perfil});
        setIsEditing(false);
        
        // Mostrar mensaje de éxito
        setSuccessMessage("¡Perfil actualizado correctamente!");
        setTimeout(() => setSuccessMessage(""), 5000);
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // En un caso real, aquí subirías la imagen a tu servidor
            // Por ahora solo simulamos el cambio con URL.createObjectURL
            const imageUrl = URL.createObjectURL(file);
            setPerfil(prev => ({
                ...prev,
                avatar: imageUrl
            }));
        }
    };

    return (
        <div className="space-y-6">
            {/* Encabezado de página */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                    <User className="mr-2 h-6 w-6 text-green-600" />
                    Mi Perfil
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

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Encabezado de perfil con banner */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-32 relative">
                    <div className="absolute top-4 right-4 flex space-x-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSaveProfile}
                                    className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
                                    title="Guardar cambios"
                                >
                                    <Save className="h-5 w-5 text-green-600" />
                                </button>
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
                                <Image
                                    src={perfil.avatar}
                                    alt="Foto de perfil"
                                    className="h-full w-full object-cover"
                                    width={128}
                                    height={128}
                                />
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
                                        name="nombre"
                                        value={perfil.nombre}
                                        onChange={handleInputChange}
                                        className={`text-2xl font-bold text-gray-800 dark:text-white bg-transparent border-b ${
                                            formErrors.nombre ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } focus:outline-none focus:border-green-500 w-full`}
                                        placeholder="Tu nombre completo"
                                    />
                                    {formErrors.nombre && (
                                        <p className="text-red-500 text-xs mt-1">{formErrors.nombre}</p>
                                    )}
                                </div>
                            ) : (
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{perfil.nombre}</h2>
                            )}
                            <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>Miembro desde {perfil.fechaRegistro}</span>
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
                                        <Mail className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                                        {isEditing ? (
                                            <div className="flex-1">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={perfil.email}
                                                    onChange={handleInputChange}
                                                    className={`bg-transparent border-b ${
                                                        formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    } focus:outline-none focus:border-green-500 w-full`}
                                                    placeholder="tu.email@ejemplo.com"
                                                />
                                                {formErrors.email && (
                                                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <span>{perfil.email}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Phone className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                                        {isEditing ? (
                                            <div className="flex-1">
                                                <input
                                                    type="tel"
                                                    name="telefono"
                                                    value={perfil.telefono}
                                                    onChange={handleInputChange}
                                                    className={`bg-transparent border-b ${
                                                        formErrors.telefono ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    } focus:outline-none focus:border-green-500 w-full`}
                                                    placeholder="+00 000 000 000"
                                                />
                                                {formErrors.telefono && (
                                                    <p className="text-red-500 text-xs mt-1">{formErrors.telefono}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <span>{perfil.telefono}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <MapPin className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                                        {isEditing ? (
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    name="ubicacion"
                                                    value={perfil.ubicacion}
                                                    onChange={handleInputChange}
                                                    className={`bg-transparent border-b ${
                                                        formErrors.ubicacion ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    } focus:outline-none focus:border-green-500 w-full`}
                                                    placeholder="Ciudad, País"
                                                />
                                                {formErrors.ubicacion && (
                                                    <p className="text-red-500 text-xs mt-1">{formErrors.ubicacion}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <span>{perfil.ubicacion}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Briefcase className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                                        {isEditing ? (
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    name="ocupacion"
                                                    value={perfil.ocupacion}
                                                    onChange={handleInputChange}
                                                    className={`bg-transparent border-b ${
                                                        formErrors.ocupacion ? 'border-red-500' : 'border-gray-300 dark:border-gray-600' 
                                                    } focus:outline-none focus:border-green-500 w-full`}
                                                    placeholder="Tu ocupación"
                                                />
                                                {formErrors.ocupacion && (
                                                    <p className="text-red-500 text-xs mt-1">{formErrors.ocupacion}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <span>{perfil.ocupacion}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                         
                    </div>

                    {/* Estadísticas */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gray-800 dark:text-white">8</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Cultivos activos</div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gray-800 dark:text-white">24</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Diagnósticos realizados</div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gray-800 dark:text-white">5</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Tratamientos activos</div>
                        </div>
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
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
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
                    >
                        Guardar cambios
                    </button>
                </div>
            )}
        </div>
    );
}