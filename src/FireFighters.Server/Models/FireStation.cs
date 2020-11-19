using FireFighters.Server.EntitySync.Types;
using System.Numerics;

namespace FireFighters.Server.Models
{
    public class FireStation
        : Blip
    {
        public FireStation(string name, Vector3 position, int dimension = 0, uint range = 100)
             : base(position, dimension, range)
        {
            Name = name;
            Sprite = 321; // firetruck
        }
    }
}
