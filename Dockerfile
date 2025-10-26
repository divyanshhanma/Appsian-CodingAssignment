# Use the official .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src/app # Work in a clean directory

# Copy the .csproj file
COPY MiniProjectManager/Backend/MiniProjectManager.Api/*.csproj ./MiniProjectManager.Api/

# Restore dependencies
# Restore directly on the solution/project file.
RUN dotnet restore "./MiniProjectManager.Api/MiniProjectManager.Api.csproj"

# Copy the rest of the backend source code
COPY MiniProjectManager/Backend/MiniProjectManager.Api/. ./MiniProjectManager.Api/

# Publish the application
RUN dotnet publish "./MiniProjectManager.Api/MiniProjectManager.Api.csproj" -c Release -o /app/publish

# Use the official .NET ASP.NET runtime image to run the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app/publish .

# Expose the port your API runs on
EXPOSE 8080

# Set the entry point for the application
ENTRYPOINT ["dotnet", "MiniProjectManager.Api.dll"]
