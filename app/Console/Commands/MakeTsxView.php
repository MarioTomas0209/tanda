<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeTsxView extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:tsx {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crea una vista TSX con una plantilla base';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $inputName = $this->argument('name');

        $pathParts = explode('/', $inputName);
        $componentName = Str::studly(array_pop($pathParts));
        $subPath = implode('/', $pathParts);

        // Construir ruta completa
        $directory = resource_path('js/pages' . ($subPath ? '/' . $subPath : ''));
        $filePath = $directory . '/' . $componentName . '.tsx';

        if (File::exists($filePath)) {
            $this->error("Component {$componentName} already exists at {$filePath}!");
            return 1;
        }


        $template = <<<EOT
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props { }

export default function {$componentName}({ }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="{$componentName}" />

        </AppLayout>
    );
}
EOT;

        File::ensureDirectoryExists($directory);
        File::put($filePath, $template);

        $this->info("Component {$componentName}.tsx created successfully at {$filePath}!");
        return 0;
    }
}
