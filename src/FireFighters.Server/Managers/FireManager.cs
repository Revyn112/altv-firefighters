using AltV.Net;
using AltV.Net.EntitySync;
using FireFighters.Models;
using FireFighters.Server.Builders;
using System;
using System.Threading.Tasks;

namespace FireFighters.Server.Managers
{
    public class FireManager
    {
        private bool _initialized;
        private readonly FlameManager _flameManager;

        public FireManager(Fire fire)
        {
            Fire = fire;
            _flameManager = new FlameManager();
        }

        public Fire Fire { get; }

        public async Task<bool> Initialize()
        {
            if (_initialized)
            {
                return false;
            }

            _initialized = true;

            AltEntitySync.AddEntity(Fire);

            Alt.EmitAllClients("FireFighters:Fire:NewStarted", Fire.Id);

            await Task.Delay(Fire.FlameSpawnDelay);

            Alt.EmitAllClients("FireFighters:Fire:FlamesSpawning", Fire.Id);

            var flameBuilder = new FlameBuilder()
                .SetPosition(Fire.Position)
                .SetLevel(10);

            if (Fire.IsGasFire) flameBuilder.GasFire();

            Fire.MainFlame = flameBuilder.InitializeFlame();

            OnTick(); // no await!

            return _initialized;
        }

        private async void OnTick()
        {
            if (!_initialized)
            {
                return;
            }

            _flameManager.OnTick(Fire.MainFlame);

            if (Fire.MainFlame.Extinguished)
            {
                var id = Fire.Id;
                AltEntitySync.RemoveEntity(Fire);

                Console.WriteLine($"Fire {id} removed");

                return;
            }

            await Task.Delay(50);

            OnTick();
        }
    }
}
