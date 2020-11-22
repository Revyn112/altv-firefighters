using AltV.Net;
using AltV.Net.Elements.Entities;
using System.Collections.Generic;
using System.Numerics;

namespace FireFighters.Models
{
    public class FireStation
        : IWritable
    {
        public FireStation(string name, Vector3 position, List<Vehicle> vehicles)
        {
            Name = name;
            Position = position;
            Vehicles = vehicles;
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

        public List<Vehicle> Vehicles { get; set; }
    }
}
