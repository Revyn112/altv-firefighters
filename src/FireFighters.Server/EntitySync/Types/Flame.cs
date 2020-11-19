using AltV.Net.EntitySync;
using FireFighters.Server.Models;
using System.Numerics;

namespace FireFighters.Server.EntitySync.Types
{
    public class Flame
        : Entity
    {
        public Flame(Fire parent, Vector3 position, bool isGasFire)
            : base((ulong)EntityTypes.Flame, position, 0, 100)
        {
            IsGasFire = isGasFire;
            Level = 0;
        }

        public bool IsGasFire
        {
            get
            {
                if (!TryGetData("isGasFire", out bool isGasFire))
                    return false;

                return isGasFire;
            }
            set
            {
                SetData("isGasFire", value);
            }
        }

        public uint Level
        {
            get
            {
                if (!TryGetData("level", out uint level))
                    return 0;

                return level;
            }
            set
            {
                SetData("level", value);
            }
        }
    }
}
