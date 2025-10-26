# Stage 1: Build the .NET application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the entire repository into /src
COPY . .

# Change to the API project directory for dotnet commands
WORKDIR /src/MiniProjectManager/Backend/MiniProjectManager.Api

# Restore dependencies for the specific project
RUN dotnet restore "MiniProjectManager.Api.csproj"

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
