import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { colorClasses } from '@/lib/colors';

type ProfileForm = {
    name: string;
    email: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Configuración de Perfil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            Información del Perfil
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Actualiza tu nombre y dirección de correo electrónico
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-200 dark:border-indigo-700 p-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Información Personal</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Mantén tu información personal actualizada
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name" className="text-sm font-medium">
                                        Nombre Completo
                                    </Label>
                                    <Input
                                        id="name"
                                        className="h-11"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                        placeholder="Tu nombre completo"
                                    />
                                    <InputError className="mt-1" message={errors.name} />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Correo Electrónico
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="h-11"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="username"
                                        placeholder="tu@email.com"
                                    />
                                    <InputError className="mt-1" message={errors.email} />
                                </div>
                            </div>
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border border-yellow-200 dark:border-yellow-700 p-4">
                                <div className="pt-6">
                                    <div className="space-y-3">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            Tu dirección de correo electrónico no está verificada.
                                        </p>
                                        <Link
                                            href={route('verification.send')}
                                            method="post"
                                            as="button"
                                            className="text-sm text-yellow-700 dark:text-yellow-300 underline hover:text-yellow-800 dark:hover:text-yellow-200"
                                        >
                                            Haz clic aquí para reenviar el correo de verificación.
                                        </Link>

                                        {status === 'verification-link-sent' && (
                                            <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                Se ha enviado un nuevo enlace de verificación a tu correo electrónico.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className={`w-full sm:w-auto ${colorClasses.button.primary}`}
                            >
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                    ¡Cambios guardados exitosamente!
                                </p>
                            </Transition>
                        </div>
                    </form>

                    <Separator />

                    <DeleteUser />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
