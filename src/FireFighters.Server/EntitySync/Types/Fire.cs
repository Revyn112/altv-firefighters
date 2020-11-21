using AltV.Net.EntitySync;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace FireFighters.Server.EntitySync.Types
{
    public class Fire
        : Entity
    {
        public Fire(Vector3 position, bool explosionOnStart)
            : base((ulong)EntityTypes.Fire, position, 0, 500)
        {

        }

        public bool Initialized
        {
            get
            {
                if (!TryGetData("initialized", out bool initialized))
                    return false;

                return initialized;
            }
            set
            {
                SetData("initialized", value);
            }
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

        public List<Flame> Flames { get; set; }
    }
}
