# Use the official .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src/MiniProjectManager.Api # Set WORKDIR to the project directory directly

# Copy the project file and restore dependencies
COPY MiniProjectManager.Api.csproj . # Copy only the project file to the WORKDIR
RUN dotnet restore

# Copy the entire backend source code
COPY . . # Copy all files from the build context root to the WORKDIR

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
