using AltV.Net;
using AltV.Net.EntitySync;
using FireFighters.Server.Modules;
using System.Numerics;
using System.Threading.Tasks;

namespace FireFighters.Server.EntitySync.Types
{
    public class Fire
        : Entity
    {
        private bool _initialized;

        public Fire(Vector3 position)
            : base((ulong)EntityTypes.Fire, position, 0, FireModule.FireStreamRange)
        {
        }

        public async Task<bool> Initialize()
        {
            if (_initialized)
            {
                return false;
            }

            _initialized = true;

            Alt.EmitAllClients("FireFighters:Fire:NewStarted", Id);

            await Task.Delay(FlameSpawnDelay);

            Alt.EmitAllClients("FireFighters:Fire:FlamesSpawning", Id);

            // todo: add flames
            var flameBuilder = new FlameBuilder();
            if (IsGasFire) flameBuilder.GasFire();
            flameBuilder.SetPosition(Position);

            MainFlame = flameBuilder.InitializeFlame();

            OnTick(); // no await!

            return _initialized;
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

        public Flame MainFlame { get; set; }
        public bool IsGasFire { get; internal set; }

        public async void OnTick()
        {
            if (!_initialized)
            {
                return;
            }

            if (MainFlame.Extinguished)
            {
                AltEntitySync.RemoveEntity(this);
                return;
            }

            MainFlame.OnTick();

            await Task.Delay(50);

            OnTick();
        }
    }
}
