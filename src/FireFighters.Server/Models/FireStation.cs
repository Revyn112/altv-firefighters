using AltV.Net;
using AltV.Net.Data;
using AltV.Net.EntitySync;
using FireFighters.Server.EntitySync;

namespace FireFighters.Server.Models
{
    public class FireStation
        : Entity, IWritable
    {
        public FireStation(string name, Position position, int dimension = 0, uint range = 100)
             : base((ulong)EntityTypes.Blip, position, dimension, range)
        {
            Name = name;
        }

        public string Name { get; set; }

        public void OnWrite(IMValueWriter writer)
        {
            writer.BeginObject();
            writer.Name("Name");
            writer.Value(Name);
            writer.Name("PositionX");
            writer.Value(Position.X);
            writer.Name("PositionY");
            writer.Value(Position.Y);
            writer.Name("PositionZ");
            writer.Value(Position.Z);
            writer.EndObject();
        }
    }
}
