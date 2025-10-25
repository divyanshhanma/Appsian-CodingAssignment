# Use the official .NET SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy the entire backend project from the root of the cloned repository
# Assuming the repo is cloned to /opt/render/project/src and then root directory is relative to that
# We explicitly copy the entire Backend project into the WORKDIR of the Docker image
COPY MiniProjectManager/Backend/MiniProjectManager.Api/ . 

# Restore dependencies
RUN dotnet restore "MiniProjectManager.Api.csproj"

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
