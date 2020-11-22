using AltV.Net;
using AltV.Net.Data;
using AltV.Net.EntitySync;
using FireFighters.Models;
using FireFighters.Server.Managers;
using System;
using System.Numerics;
using System.Threading.Tasks;

namespace FireFighters.Server.Builders
{
    public class FireBuilder
    {
        private Random _random;

        private bool _explosionOnStart;
        private int _flameSpawnDelay;
        private bool _isGasFire;
        private Vector3 _position;

        public FireBuilder()
        {
            Reset();
        }

        public FireBuilder Reset()
        {
            _random = new Random();

            _explosionOnStart = false;
            _flameSpawnDelay = 0;
            _isGasFire = false;
            _position = Vector3.Zero;

            return this;
        }

        public FireBuilder ExplodesOnStartup()
        {
            _explosionOnStart = true;
            return this;
        }

        public FireBuilder InstantlySpawnFlames()
        {
            _flameSpawnDelay = 0;
            return this;
        }

        public FireBuilder SetFlameSpawnDelay(int ms)
        {
            _flameSpawnDelay = ms;
            return this;
        }

        public FireBuilder SetFlameSpawnDelay(int randomMin, int randomMax)
        {
            _flameSpawnDelay = _random.Next(randomMin, randomMax);
            return this;
        }

        /*public FireBuilder SetMaxSpreadDistance(int distance)
        {
            _fire.MaxSpreadDistance = distance;
            return this;
        }*/

        public FireBuilder IsGasFire()
        {
            _isGasFire = true;
            return this;
        }

        public FireBuilder SetPosition(Position position)
        {
            _position = position;
            return this;
        }

        public async Task<FireManager> InitializeFire()
        {
            var fire = new Fire(_position)
            {
                ExplosionOnStart = _explosionOnStart,
                FlameSpawnDelay = _flameSpawnDelay,
                IsGasFire = _isGasFire
            };

            var fireManager = new FireManager(fire);
            await fireManager.Initialize();

            Console.WriteLine($"Fire {fire.Id} spawned");

            return fireManager;
        }
    }
}
