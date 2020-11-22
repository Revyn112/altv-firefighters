using AltV.Net.EntitySync;
using System.Numerics;

namespace FireFighters.Models
{
    public class Fire
        : Entity
    {
        public Fire(Vector3 position)
            : base((ulong)EntityTypes.Fire, position, 0, Constants.EntitySyncRange)
        {
        }

        public bool ExplosionOnStart
        {
            get
            {
                if (!TryGetData("explosionOnStart", out bool explosionOnStart))
                    return false;

                return explosionOnStart;
            }
            set
            {
                SetData("explosionOnStart", value);
            }
        }

        /*public int MaxSpreadDistance 
        {
            get
            {
                if (!TryGetData("maxSpreadDistance", out int maxSpreadDistance))
                    return 80;

                return maxSpreadDistance;
            }
            set
            {
                SetData("maxSpreadDistance", value);
            }
        }*/

        public int FlameSpawnDelay
        {
            get
            {
                if (!TryGetData("flameSpawnDelay", out int flameSpawnDelay))
                    return 80;

                return flameSpawnDelay;
            }
            set
            {
                SetData("flameSpawnDelay", value);
            }
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

        public Flame MainFlame { get; set; }
    }
}
