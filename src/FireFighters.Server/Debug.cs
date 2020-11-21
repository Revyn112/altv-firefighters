using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using Newtonsoft.Json;
using System;
using System.Linq;

namespace FireFighters.Server
{
    public class Debug
        : IScript
    {
        public Debug()
        {
            Alt.OnConsoleCommand += OnServerConsoleCommand;
            Alt.OnClient<string>("Debug:SpawnVehicle", OnSpawnVehicleCommand);
            Alt.OnClient("Debug:LogCarPosRot", OnLogCarPosRot);
            Alt.OnClient("Debug:SpawnMenu", OnSpawnMenu);
        }

        private void OnLogCarPosRot(IPlayer player)
        {
            if (player.Vehicle == null) return;

            player.Emit("Debug:Log", JsonConvert.SerializeObject(player.Vehicle.Position));
            player.Emit("Debug:Log", JsonConvert.SerializeObject(player.Vehicle.Rotation));
        }

        private void OnSpawnMenu(IPlayer player)
        {
            player.Position = new Position();
            player.Dimension = 100 + player.Id;
            player.Emit("FireFighters:SelectSpawn", JsonConvert.SerializeObject(FirefighterResource.FireStations.Select(e => e.Name)));
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
