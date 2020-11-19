using AltV.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FireFighters.Server.EntitySync.Base
{
    public class MoveData 
        : IWritable
    {
        public float X { get; set; }
        public float Y { get; set; }
        public float Z { get; set; }
        public float Speed { get; set; }
        public void OnWrite(IMValueWriter writer)
        {
            writer.BeginObject();
            writer.Name("X");
            writer.Value(X);
            writer.Name("Y");
            writer.Value("Y");
            writer.Name("Z");
            writer.Value(Z);
            writer.Name("Speed");
            writer.Value(Speed);
            writer.EndObject();
        }
    }
}
