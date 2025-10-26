# Stage 1: Build the .NET application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app/MiniProjectManager/Backend/MiniProjectManager.Api # Set WORKDIR directly to the project folder inside the container

# Copy only the .csproj file first to leverage Docker cache
COPY MiniProjectManager/Backend/MiniProjectManager.Api/MiniProjectManager.Api.csproj .

# Restore dependencies
RUN dotnet restore

# Copy the rest of the backend source code
COPY MiniProjectManager/Backend/MiniProjectManager.Api/. .

# Publish the application
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Create the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app/publish .

# Expose the port your API runs on
EXPOSE 8080

# Set the entry point for the application
ENTRYPOINT ["dotnet", "MiniProjectManager.Api.dll"]
