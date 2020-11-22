using AltV.Net.EntitySync;
using System;
using System.Collections.Generic;
using System.Numerics;

namespace FireFighters.Models
{
    public class Flame
        : Entity
    {
        public Flame(Vector3 position, bool isGasFire)
            : base((ulong)EntityTypes.Flame, position, 0, Constants.EntitySyncRange)
        {
            IsGasFire = isGasFire;
            Level = 0;

            Active = true;

            Children = new List<Flame>();
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

        public bool Extinguished
        {
            get
            {
                if (!TryGetData("extinguished", out bool extinguished))
                    return false;

                return extinguished;
            }
            set
            {
                SetData("extinguished", value);
            }
        }

        public bool IsPositionGroundValidated
        {
            get
            {
                if (!TryGetData("isPositionGroundValidated", out bool isPositionGroundValidated))
                    return false;

                return isPositionGroundValidated;
            }
            set
            {
                SetData("isPositionGroundValidated", value);
            }
        }

        public List<Flame> Children { get; set; }

        public bool Active { get; set; }

        public DateTime LastManagedTick { get; set; }
    }
}