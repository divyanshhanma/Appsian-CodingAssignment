# Use the official .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src/MiniProjectManager.Api # Working directory inside the container for the project

# Copy the project file and any NuGet config files, then restore as a separate layer
# This optimizes Docker caching: if only source code changes, restore doesn't rerun
COPY MiniProjectManager/Backend/MiniProjectManager.Api/*.csproj .
# COPY MiniProjectManager/Backend/MiniProjectManager.Api/nuget.config . # If you have one - REMOVED, as it does not exist
RUN dotnet restore

# Copy the rest of the backend source code
COPY MiniProjectManager/Backend/MiniProjectManager.Api/. .

# Publish the application
RUN dotnet publish -c Release -o /app/publish

# Use the official .NET ASP.NET runtime image to run the application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy the published output from the build stage
COPY --from=build /app/publish .

# Expose the port your API runs on
EXPOSE 8080

# Set the entry point for the application
ENTRYPOINT ["dotnet", "MiniProjectManager.Api.dll"]
