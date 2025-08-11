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
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Información Personal</CardTitle>
                                <CardDescription>
                                    Mantén tu información personal actualizada
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                            </CardContent>
                        </Card>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
                                <CardContent className="pt-6">
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
                                            <div className="text-sm font-medium text-green-600 dark:text-green-400">
                                                Se ha enviado un nuevo enlace de verificación a tu correo electrónico.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="w-full sm:w-auto"
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
                                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
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
