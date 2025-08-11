// Paleta de colores personalizada para la aplicación de Tandas
// Tema: Azul Índigo Profesional + Verde Esmeralda

export const colors = {
    // Color Primario - Azul Índigo
    primary: {
        50: '#EEF2FF',
        100: '#E0E7FF',
        200: '#C7D2FE',
        300: '#A5B4FC',
        400: '#818CF8',
        500: '#6366F1', // Principal
        600: '#4F46E5', // Principal más oscuro
        700: '#4338CA', // Hover
        800: '#3730A3',
        900: '#312E81',
        950: '#1E1B4B',
    },

    // Color Secundario - Verde Esmeralda
    secondary: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        200: '#A7F3D0',
        300: '#6EE7B7',
        400: '#34D399',
        500: '#10B981', // Secundario
        600: '#059669', // Secundario más oscuro
        700: '#047857', // Hover
        800: '#065F46',
        900: '#064E3B',
        950: '#022C22',
    },

    // Color Terciario - Púrpura Vibrante
    accent: {
        50: '#F5F3FF',
        100: '#EDE9FE',
        200: '#DDD6FE',
        300: '#C4B5FD',
        400: '#A78BFA',
        500: '#8B5CF6', // Acento
        600: '#7C3AED', // Acento más oscuro
        700: '#6D28D9', // Hover
        800: '#5B21B6',
        900: '#4C1D95',
        950: '#2E1065',
    },

    // Estados especiales
    status: {
        success: '#10B981', // Verde esmeralda
        warning: '#F59E0B', // Amarillo dorado
        error: '#EF4444',   // Rojo
        info: '#3B82F6',    // Azul cielo
    },

    // Gradientes
    gradients: {
        primary: 'from-indigo-500 to-indigo-600',
        secondary: 'from-emerald-500 to-emerald-600',
        accent: 'from-violet-500 to-violet-600',
        primarySoft: 'from-indigo-50 to-violet-50',
        secondarySoft: 'from-emerald-50 to-teal-50',
    },
} as const;

// Clases de Tailwind predefinidas para usar fácilmente
export const colorClasses = {
    // Botones
    button: {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        secondary: 'bg-emerald-500 hover:bg-emerald-600 text-white',
        accent: 'bg-violet-500 hover:bg-violet-600 text-white',
        outline: 'border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20',
        ghost: 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20',
    },

    // Badges y estados
    badge: {
        active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
        completed: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    },

    // Cards y elementos UI
    card: {
        primary: 'bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20',
        secondary: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20',
        border: 'border-indigo-200 dark:border-indigo-700',
    },

    // Texto
    text: {
        primary: 'text-indigo-600 dark:text-indigo-400',
        secondary: 'text-emerald-600 dark:text-emerald-400',
        accent: 'text-violet-600 dark:text-violet-400',
    },

    // Iconos
    icon: {
        primary: 'text-indigo-600 dark:text-indigo-400',
        secondary: 'text-emerald-600 dark:text-emerald-400',
        accent: 'text-violet-600 dark:text-violet-400',
    },
} as const;
