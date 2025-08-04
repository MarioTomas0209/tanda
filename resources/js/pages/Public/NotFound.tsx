import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface Props {
    message?: string;
}

export default function NotFound({ message = 'Enlace no válido o expirado' }: Props) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Head title="Enlace no válido" />
            
            <div className="max-w-md w-full mx-auto px-4">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <CardTitle className="text-xl">Enlace no válido</CardTitle>
                        <CardDescription>
                            {message}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-gray-600">
                            El enlace que intentaste acceder no es válido o ha expirado. 
                            Contacta al organizador de la tanda para obtener un nuevo enlace.
                        </p>
                        
                        <div className="flex space-x-2 justify-center">
                            <Button
                                onClick={() => window.location.href = '/'}
                                variant="outline"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Ir al inicio
                            </Button>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reintentar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 