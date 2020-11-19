using AltV.Net;
using System.Numerics;

namespace FireFighters.Server.Models
{
    public class FireStation
        : IWritable
    {
        public FireStation(string name, Vector3 position)
        {
            Name = name;
            Position = position;
        }

        public string Name { get; set; }

        public Vector3 Position { get; set; }

        public void OnWrite(IMValueWriter writer)
        {
            writer.BeginObject();
            writer.Name("name");
            writer.Value(Name);
            writer.Name("posX");
            writer.Value(Position.X);
            writer.Name("posY");
            writer.Value(Position.Y);
            writer.Name("posZ");
            writer.Value(Position.Z);
            writer.EndObject();
        }
    }
}
