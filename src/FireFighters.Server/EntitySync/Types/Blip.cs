using AltV.Net.EntitySync;
using System.Numerics;

namespace FireFighters.Server.EntitySync.Types
{
    public class Blip
        : Entity
    {
        public Blip(Vector3 position, int dimension, uint range)
            : base((ulong)EntityTypes.Blip, position, dimension, range)
        {

        }

        public string Name
        {
            get
            {
                if (!TryGetData("name", out string name))
                    return string.Empty;

                return name;
            }
            set
            {
                SetData("name", value);
            }
        }


        public int Sprite
        {
            get
            {
                if (!TryGetData("sprite", out int spriteId))
                    return 0;

                return spriteId;
            }
            set
            {
                SetData("sprite", value);
            }
        }

        public int Color
        {
            get
            {
                if (!TryGetData("color", out int color))
                    return 0;

                return color;
            }
            set
            {
                SetData("color", value);
            }
        }

        public float Scale
        {
            get
            {
                if (!TryGetData("scale", out float scale))
                    return 1;

                return scale;
            }
            set
            {
                SetData("scale", value);
            }
        }
    }
}
