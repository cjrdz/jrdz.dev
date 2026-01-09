---
title: Guía de Microsoft Azure
description: >-
  Aprende los fundamentos de la plataforma de computación en la nube de Microsoft Azure y cómo
  comenzar con tus primeros recursos de Azure.
pubDate: 2026-01-08T22:35:00.000Z
author: Jonathan Rodriguez
category: cloud
subcategory: azure
tags:
  - Azure
  - Computación en la Nube
  - Infraestructura
  - Principiante
image: /images/blog/cloud/azure/azure.png
video: https://www.youtube.com/watch?v=oPSHs71mTVU
locale: "es"
draft: false
---
## Introducción a Microsoft Azure

Microsoft Azure es una de las principales plataformas de computación en la nube del mundo. En esta guía completa, exploraremos los fundamentos de Azure y te ayudaremos a comenzar tu viaje en la nube.

### ¿Qué es Microsoft Azure?

<!-- Video section added here! -->

\{\{video}}

Azure es la plataforma de computación en la nube de Microsoft que proporciona una amplia gama de servicios que incluyen:

* **Máquinas Virtuales**: Recursos informáticos escalables
* **Soluciones de Almacenamiento**: Almacenamiento Blob, File, Queue y Table
* **Redes**: Redes virtuales, equilibradores de carga y puertas de enlace VPN
* **Bases de Datos**: SQL Database, Cosmos DB y más
* **IA y Aprendizaje Automático**: Servicios cognitivos y modelos de ML

<div class="flex my-6">
  <img 
    src="/images/blog/cloud/azure/azure.png" 
    alt="Modelos de Servicio en la Nube de Azure" 
    class="w-full h-auto rounded-lg shadow-md transition-transform duration-300 hover:scale-110 cursor-pointer sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
    loading="lazy"
  />
</div>

### Instalación de Azure CLI en Windows

La Interfaz de Línea de Comandos (CLI) de Azure te permite gestionar recursos de Azure desde tu máquina local.

#### Instalar o Actualizar

El distributivo MSI y ZIP se utiliza para instalar o actualizar Azure CLI en Windows. No necesitas desinstalar las versiones actuales antes de usar el instalador MSI porque el MSI actualiza cualquier versión existente.

**Importante**: Después de que la instalación se complete, debes cerrar y volver a abrir cualquier ventana de terminal activa para usar Azure CLI.

#### WinGet (Administrador de Paquetes de Windows)

Usa WinGet, el administrador de paquetes de Microsoft para Windows, para instalar y gestionar actualizaciones de Azure CLI. Por defecto, WinGet instala Azure CLI de 64 bits en sistemas operativos de 64 bits.

**Nota**: WinGet está disponible por defecto en Windows 11 y versiones modernas de Windows 10. Sin embargo, puede que no esté instalado en versiones anteriores de Windows. Consulta la [documentación de winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) para instrucciones de instalación.

```powershell
winget install --exact --id Microsoft.AzureCLI
```

La opción `--exact` es para asegurar que se instale el paquete oficial de Azure CLI. Este comando instala la última versión por defecto. Para especificar una versión, agrega `--version <version>` con tu versión deseada al comando. Aquí tienes un ejemplo:

```powershell
winget install --exact --id Microsoft.AzureCLI --version 2.67.0
```

### Configuración de tu Cuenta de Azure

#### Paso 1: Iniciar Sesión en Azure

```bash
az login
```

Esto abre tu navegador para autenticación. Una vez que hayas iniciado sesión, verás los detalles de tu suscripción.

#### Paso 2: Verificar tu Configuración

```bash
# Verifica tu versión de Azure CLI
az version

# Ver tu suscripción activa
az account show

# Listar todas tus suscripciones
az account list --output table
```

### Creación de un Grupo de Recursos

Los grupos de recursos son contenedores que organizan tus recursos de Azure. Piensa en ellos como carpetas para tus recursos en la nube.

**Usando CMD:**

```bash
az group create --name myResourceGroup --location eastus
```

**Usando PowerShell:**

```powershell
az group create `
  --name myResourceGroup `
  --location eastus
```

Para verificar que tu grupo de recursos fue creado:

```bash
az group list --output table
```

### Próximos Pasos

Ahora que tienes Azure CLI instalado y un grupo de recursos creado, ¡estás listo para comenzar a desplegar recursos de Azure!

### Conclusión

Microsoft Azure proporciona una plataforma robusta para construir, desplegar y gestionar aplicaciones en la nube. Con Azure CLI correctamente instalado y configurado, puedes gestionar eficientemente tus recursos en la nube directamente desde PowerShell o Símbolo del Sistema. Comienza con lo básico y explora gradualmente servicios más avanzados a medida que te sientas cómodo con la plataforma.
