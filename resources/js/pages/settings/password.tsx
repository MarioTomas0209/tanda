import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Shield, Key } from 'lucide-react';
import { colorClasses } from '@/lib/colors';

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Configuración de Contraseña" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            Actualizar Contraseña
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Asegúrate de que tu cuenta use una contraseña larga y segura para mantenerla protegida
                        </p>
                    </div>

                    <form onSubmit={updatePassword} className="space-y-6">
                        <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-700 p-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    Cambio de Contraseña
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Ingresa tu contraseña actual y la nueva contraseña deseada</p>
                            </div>
                            <div className="space-y-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="current_password" className="text-sm font-medium flex items-center gap-2">
                                        <Key className="h-4 w-4" />
                                        Contraseña Actual
                                    </Label>
                                    <Input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        type="password"
                                        className="h-11"
                                        autoComplete="current-password"
                                        placeholder="Tu contraseña actual"
                                    />
                                    <InputError message={errors.current_password} />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Nueva Contraseña
                                    </Label>
                                    <Input
                                        id="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        type="password"
                                        className="h-11"
                                        autoComplete="new-password"
                                        placeholder="Tu nueva contraseña"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="password_confirmation" className="text-sm font-medium flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Confirmar Contraseña
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        type="password"
                                        className="h-11"
                                        autoComplete="new-password"
                                        placeholder="Confirma tu nueva contraseña"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>
                            </div>
                        </div>

                        {/* Consejos de seguridad */}
                        <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-700 p-4">
                            <div className="pt-6">
                                <div className="space-y-3">
                                    <h4 className="font-medium text-emerald-900 dark:text-emerald-100">
                                        Consejos para una contraseña segura:
                                    </h4>
                                    <ul className="text-sm text-emerald-800 dark:text-emerald-200 space-y-1">
                                        <li>• Usa al menos 8 caracteres</li>
                                        <li>• Combina letras mayúsculas y minúsculas</li>
                                        <li>• Incluye números y símbolos</li>
                                        <li>• Evita información personal fácil de adivinar</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className={`w-full sm:w-auto ${colorClasses.button.primary}`}
                            >
                                {processing ? 'Actualizando...' : 'Actualizar Contraseña'}
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                    ¡Contraseña actualizada exitosamente!
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
