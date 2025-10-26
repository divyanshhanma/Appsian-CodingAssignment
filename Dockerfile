# Stage 1: Build the .NET application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the API project file first (for dotnet restore caching)
COPY MiniProjectManager/Backend/MiniProjectManager.Api/MiniProjectManager.Api.csproj ./MiniProjectManager/Backend/MiniProjectManager.Api/

# Copy the rest of the MiniProjectManager backend source code
COPY MiniProjectManager/Backend/MiniProjectManager.Api/. ./MiniProjectManager/Backend/MiniProjectManager.Api/

# Change directory to the API project
WORKDIR /src/MiniProjectManager/Backend/MiniProjectManager.Api

# Restore dependencies for the specific project
RUN dotnet restore "MiniProjectManager.Api.csproj"

# Explicitly add Npgsql package (as a failsafe, given persistent errors)
RUN dotnet add "MiniProjectManager.Api.csproj" package Npgsql.EntityFrameworkCore.PostgreSQL --version 8.0.0

# Publish the application to an absolute path /publish at the root of the build stage container
RUN dotnet publish "MiniProjectManager.Api.csproj" -c Release -o /publish

# Stage 2: Create the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy the published output from the build stage's absolute path /publish
COPY --from=build /publish .

# Expose the port your API runs on
EXPOSE 8080

# Set the entry point for the application
ENTRYPOINT ["dotnet", "MiniProjectManager.Api.dll"]
