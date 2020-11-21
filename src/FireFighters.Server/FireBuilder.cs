using AltV.Net.Data;
using AltV.Net.EntitySync;
using FireFighters.Server.EntitySync.Types;
using System;
using System.Threading.Tasks;

namespace FireFighters.Server
{
    public class FireBuilder
    {
        private Fire _fire;
        private Random _random;

        public FireBuilder()
        {
            Reset();
        }

        public FireBuilder Reset()
        {
            _fire = new Fire(Position.Zero);
            _random = new Random();
            return this;
        }

        public FireBuilder ExplodesOnStartup()
        {
            _fire.ExplosionOnStart = true;
            return this;
        }

        public FireBuilder InstantlySpawnFlames()
        {
            _fire.FlameSpawnDelay = 0;
            return this;
        }

        public FireBuilder SetFlameSpawnDelay(int ms)
        {
            _fire.FlameSpawnDelay = ms;
            return this;
        }

        public FireBuilder SetFlameSpawnDelay(int randomMin, int randomMax)
        {
            _fire.FlameSpawnDelay = _random.Next(randomMin, randomMax);
            return this;
        }

        /*public FireBuilder SetMaxSpreadDistance(int distance)
        {
            _fire.MaxSpreadDistance = distance;
            return this;
        }*/

        public FireBuilder IsGasFire()
        {
            _fire.IsGasFire = true;
            return this;
        }

        public FireBuilder SetPosition(Position position)
        {
            _fire.Position = position;
            return this;
        }

        public async Task<Fire> InitializeFire()
        {
            AltEntitySync.AddEntity(_fire);
            await _fire.Initialize();

            return _fire;
        }
    }
}
