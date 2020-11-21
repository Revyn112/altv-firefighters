using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace FireFighters.Server
{
    public class Debug
        : IScript
    {
        public Debug()
        {
            Alt.OnConsoleCommand += OnServerConsoleCommand;
            Alt.OnClient<string>("FireFighters:Debug:SpawnVehicle", OnSpawnVehicleCommand);
            Alt.OnClient("FireFighters:Debug:LogCarPosRot", OnLogCarPosRot);
            Alt.OnClient("FireFighters:Debug:SpawnMenu", OnSpawnMenu);
            Alt.OnClient("FireFighters:Debug:SpawnFire", OnSpawnFire);
        }

        private void OnLogCarPosRot(IPlayer player)
        {
            if (player.Vehicle == null) return;

            player.Emit("FireFighters:Debug:Log", JsonConvert.SerializeObject(player.Vehicle.Position));
            player.Emit("FireFighters:Debug:Log", JsonConvert.SerializeObject(player.Vehicle.Rotation));
        }

        private void OnSpawnMenu(IPlayer player)
        {
            player.Position = new Position();
            player.Dimension = 100 + player.Id;
            player.Emit("FireFighters:SelectSpawn", JsonConvert.SerializeObject(FirefighterResource.FireStations.Select(e => e.Name)));
        }

        private void OnSpawnFire(IPlayer player)
        {
            var pos = new Position(player.Position.X, player.Position.Z, player.Position.Z);

            var _ = new FireBuilder()
                .SetPosition(player.Position)
                .SetFlameSpawnDelay(3000)
                .InitializeFire();

            // or:
            //Alt.Emit("FireFighters:Fire:Create", player.Position);
        }

        private void OnSpawnVehicleCommand(IPlayer player, string vehicleModel)
        {
            var spawnPosition = new Position(player.Position.X, player.Position.Y + 5, player.Position.Z);

            try
            {
                if (uint.TryParse(vehicleModel, out uint modelHash))
                {
                    _ = new Vehicle(modelHash, spawnPosition, player.Rotation);
                    return;
                }

                _ = new Vehicle(Alt.Hash(vehicleModel), spawnPosition, player.Rotation);
            }
            catch (Exception ex)
            {
                Alt.Log(ex.Message);
            }
        }

        private void OnServerConsoleCommand(string command, string[] args)
        {
            Alt.Log($"Command: {command}, args: {string.Join(',', args)}");
        }
    }
}
