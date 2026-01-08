---
title: Microsoft Azure Guide
description: >-
  Learn the fundamentals of Microsoft Azure cloud computing platform and how to
  get started with your first Azure resources.
pubDate: 2026-01-08T22:35:00.000Z
author: Jonathan Rodriguez
category: cloud
subcategory: azure
tags:
  - Azure
  - Cloud Computing
  - Infrastructure
  - Beginner
image: /images/blog/cloud/azure/azure.png
video: https://www.youtube.com/watch?v=oPSHs71mTVU
draft: false
---
## Getting Started with Microsoft Azure

Microsoft Azure is one of the leading cloud computing platforms in the world. In this comprehensive guide, we'll explore the fundamentals of Azure and help you get started with your cloud journey.

### What is Microsoft Azure?

<!-- Video section added here! -->

\{\{video}}

Azure is Microsoft's cloud computing platform that provides a wide range of services including:

* **Virtual Machines**: Scalable computing resources
* **Storage Solutions**: Blob, File, Queue, and Table storage
* **Networking**: Virtual networks, load balancers, and VPN gateways
* **Databases**: SQL Database, Cosmos DB, and more
* **AI and Machine Learning**: Cognitive services and ML models

<div class="flex my-6">
  <img 
    src="/images/blog/cloud/azure/azure.png" 
    alt="Azure Cloud Service Models" 
    class="w-full h-auto rounded-lg shadow-md transition-transform duration-300 hover:scale-110 cursor-pointer sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
    loading="lazy"
  />
</div>

### Installing Azure CLI on Windows

The Azure Command-Line Interface (CLI) lets you manage Azure resources from your local machine.

#### Install or Update

The MSI and ZIP distributable are used for installing or updating the Azure CLI on Windows. You don't need to uninstall current versions before using the MSI installer because the MSI updates any existing version.

**Important**: After the installation is complete, you must close and reopen any active terminal window to use the Azure CLI.

#### WinGet (Windows Package Manager)

Use WinGet, Microsoft's Package manager for Windows, to install and manage updates for Azure CLI. By default, WinGet installs the 64-bit Azure CLI on 64-bit operating systems.

**Note**: WinGet is available by default in Windows 11 and modern versions of Windows 10. However, it may not be installed in older versions of Windows. See the [winget documentation](https://learn.microsoft.com/en-us/windows/package-manager/winget/) for installation instructions.

```powershell
winget install --exact --id Microsoft.AzureCLI
```

The `--exact` option is to ensure the official Azure CLI package is installed. This command installs the latest version by default. To specify a version, add a `--version <version>` with your desired version to the command. Here's an example:

```powershell
winget install --exact --id Microsoft.AzureCLI --version 2.67.0
```

### Setting Up Your Azure Account

#### Step 1: Sign In to Azure

```bash
az login
```

This opens your browser for authentication. Once signed in, you'll see your subscription details.

#### Step 2: Verify Your Setup

```bash
# Check your Azure CLI version
az version

# View your active subscription
az account show

# List all your subscriptions
az account list --output table
```

### Creating a Resource Group

Resource groups are containers that organize your Azure resources. Think of them as folders for your cloud resources.

**Using CMD:**

```bash
az group create --name myResourceGroup --location eastus
```

**Using PowerShell:**

```powershell
az group create `
  --name myResourceGroup `
  --location eastus
```

To verify your resource group was created:

```bash
az group list --output table
```

### Next Steps

Now that you have Azure CLI installed and a resource group created, you're ready to start deploying Azure resources!

### Conclusion

Microsoft Azure provides a robust platform for building, deploying, and managing applications in the cloud. With Azure CLI properly installed and configured, you can efficiently manage your cloud resources directly from PowerShell or Command Prompt. Start with the basics and gradually explore more advanced services as you become comfortable with the platform.
