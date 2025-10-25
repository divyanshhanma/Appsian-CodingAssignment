# Use the official .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY MiniProjectManager/Backend/MiniProjectManager.Api/*.csproj MiniProjectManager.Api/
RUN dotnet restore MiniProjectManager.Api/MiniProjectManager.Api.csproj

# Copy the entire backend source code
COPY MiniProjectManager/Backend/MiniProjectManager.Api/. MiniProjectManager.Api/
WORKDIR /src/MiniProjectManager.Api

# Publish the application
RUN dotnet publish -c Release -o /app

# Use the official .NET ASP.NET runtime image to run the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app .

# Expose the port your API runs on
EXPOSE 8080

# Set the entry point for the application
ENTRYPOINT ["dotnet", "MiniProjectManager.Api.dll"]
