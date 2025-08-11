import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Palette, Monitor, Smartphone } from 'lucide-react';

export default function Appearance() {
    return (
        <AppLayout>
            <Head title="Configuración de Apariencia" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Palette className="h-6 w-6 text-purple-600" />
                            Configuración de Apariencia
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Personaliza el tema y la apariencia de la aplicación según tus preferencias
                        </p>
                    </div>

                    {/* Información sobre temas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <Monitor className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">Tema Claro</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Ideal para uso diurno</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <Smartphone className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">Tema Oscuro</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Perfecto para uso nocturno</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <Palette className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">Automático</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Se adapta a tu sistema</p>
                        </div>
                    </div>

                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
