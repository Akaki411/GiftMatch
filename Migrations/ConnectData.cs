using System.Text.Json;
using System.Text.Json.Serialization;

namespace GiftMatch.Migrations
{
    public class ConnectData
    {
        public string Host { get; set; }
        public string Port { get; set; }
        public string Database { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string SecretKey { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int JWTLifeTime { get; set; }
        
    }

    public class Connection
    {
        private ConnectData _data;

        public Connection(string path)
        {
            string json = File.ReadAllText(path);
            _data = JsonSerializer.Deserialize<ConnectData>(json)!;
        }

        public string GetConnectionString()
        {
            return $"Host={_data.Host};Port={_data.Port};Database={_data.Database};Username={_data.Username};Password={_data.Password}";
        }

        public string GetSecretKey()
        {
            return _data.SecretKey;
        }
        
        public string GetIssuer()
        {
            return _data.Issuer;
        }
        
        public string GetAudience()
        {
            return _data.Audience;
        }
        
        public int GetJWTLifeTime()
        {
            return _data.JWTLifeTime;
        }
    }
}