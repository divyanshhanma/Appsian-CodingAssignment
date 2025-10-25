using System.Security.Cryptography;
using System.Text;
using MiniProjectManager.Api.DTOs.Auth;
using MiniProjectManager.Api.Models;
using MiniProjectManager.Api.Repositories;
using MiniProjectManager.Api.Helpers;

namespace MiniProjectManager.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtService _jwtService;

        public AuthService(IUserRepository userRepository, JwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
        {
            if (await _userRepository.GetByUsernameAsync(request.Username) != null)
            {
                return null; // Username already exists
            }

            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] salt);

            var user = new User
            {
                Username = request.Username,
                PasswordHash = Convert.ToBase64String(passwordHash),
                Salt = Convert.ToBase64String(salt)
            };

            await _userRepository.AddAsync(user);

            var token = _jwtService.GenerateToken(user.Id, user.Username);
            return new AuthResponse { Token = token, Username = user.Username };
        }

        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetByUsernameAsync(request.Username);
            if (user == null)
            {
                return null; // User not found
            }

            if (!VerifyPasswordHash(request.Password, Convert.FromBase64String(user.PasswordHash), Convert.FromBase64String(user.Salt)))
            {
                return null; // Incorrect password
            }

            var token = _jwtService.GenerateToken(user.Id, user.Username);
            return new AuthResponse { Token = token, Username = user.Username };
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] salt)
        {
            using (var hmac = new HMACSHA512())
            {
                salt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            using (var hmac = new HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }
            return true;
        }
    }
}


