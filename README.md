# Coding Assignment Projects

This repository contains two projects: the Mini Project Manager and the Basic Task Manager, developed as part of a coding assignment.

## 🚀 Getting Started

Follow the instructions below to set up and run each project.

### 📋 Prerequisites

*   [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) installed.
*   [Node.js and npm](https://nodejs.org/en/download/) installed.
*   Ensure you are using **PowerShell** for running the commands, as specified.

---

## 2. Mini Project Manager

A full-stack application with user authentication, project management, task tracking, and a smart scheduler.

### ⚙️ How to Run

#### Frontend (React + TypeScript)

Open a **new PowerShell terminal** and run the following commands:

```powershell
# Navigate to the frontend directory
PS C:\Users\gokub\Downloads\Coding Assignment> Set-Location -Path "C:\Users\gokub\Downloads\Coding Assignment\MiniProjectManager\Frontend\mini-project-manager-frontend"

# In case of script execution errors (e.g., npm issues), you might need to run this once:
PS C:\Users\gokub\Downloads\Coding Assignment\MiniProjectManager\Frontend\mini-project-manager-frontend> Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned

# Start the frontend development server
PS C:\Users\gokub\Downloads\Coding Assignment\MiniProjectManager\Frontend\mini-project-manager-frontend> npm run dev
```

The frontend should start at `http://localhost:5173` (or another port if 5173 is in use).

#### Backend (C# .NET 8 API)

Open a **separate PowerShell terminal** and run the following commands:

```powershell
# Navigate to the backend API directory
PS C:\Users\gokub\Downloads\Coding Assignment> Set-Location -Path "C:\Users\gokub\Downloads\Coding Assignment\MiniProjectManager\Backend\MiniProjectManager.Api"

# Run the backend API
PS C:\Users\gokub\Downloads\Coding Assignment\MiniProjectManager\Backend\MiniProjectManager.Api> dotnet run
```

The backend API should start at `http://localhost:5208` (or another port).

---

## 1. Basic Task Manager

A simple task management application demonstrating fundamental full-stack development skills.

### ⚙️ How to Run

#### Frontend (React + TypeScript)

Open a **new PowerShell terminal** and run the following commands:

```powershell
# Navigate to the frontend directory
PS C:\Users\gokub\Downloads\Coding Assignment> Set-Location -Path "C:\Users\gokub\Downloads\Coding Assignment\BasicTaskManager\Frontend\basic-task-manager-frontend"

# Start the frontend development server
PS C:\Users\gokub\Downloads\Coding Assignment\BasicTaskManager\Frontend\basic-task-manager-frontend> npm run dev
```

In case of a script execution error like:
`npm : File C:\Users\gokub\Downloads\npm.ps1 cannot be loaded because running scripts is disabled on this system.`
Run this command once in the same PowerShell terminal:

```powershell
PS C:\Users\gokub\Downloads\Coding Assignment\BasicTaskManager\Frontend\basic-task-manager-frontend> Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
```

Then, try `npm run dev` again.

#### Backend (C# .NET 8 API)

Open a **separate PowerShell terminal** and run the following commands:

```powershell
# Navigate to the backend API directory
PS C:\Users\gokub\Downloads\Coding Assignment\BasicTaskManager\Backend\BasicTaskManager.Api"

# Run the backend API
PS C:\Users\gokub\Downloads\Coding Assignment\BasicTaskManager\Backend\BasicTaskManager.Api> dotnet run
```
