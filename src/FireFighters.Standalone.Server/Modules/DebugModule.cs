using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using AltV.Net.EntitySync;
using FireFighters.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FireFighters.Standalone.Server.Modules
{
    public class DebugModule
        : IScript
    {
        public DebugModule()
        {
            Alt.OnConsoleCommand += OnServerConsoleCommand;

            Alt.OnClient("FireFighters:Debug:SpawnFire", OnSpawnFire);
            Alt.OnClient<ulong>("FireFighters:Debug:StopFire", OnStopFire);
            Alt.OnClient<string>("FireFighters:Debug:SpawnVehicle", OnSpawnVehicleCommand);
            Alt.OnClient("FireFighters:Debug:LogCarPosRot", OnLogCarPosRot);
            Alt.OnClient<ulong, uint>("FireFighters:Debug:SetFlameLevel", OnSetFlameLevel);
            Alt.OnClient<ulong>("FireFighters:Debug:GetFlameLevel", OnGetFlameLevel);
        }

        private void OnServerConsoleCommand(string command, string[] args)
        {
            Alt.Log($"Command: {command}, args: {string.Join(',', args)}");
        }

        private void OnSpawnFire(IPlayer player)
        {
            Alt.Emit("FireFighters:Fire:Create", player.Position);
        }

        private void OnStopFire(IPlayer player, ulong fireId)
        {
            Alt.Emit("FireFighters:Fire:Remove", fireId);
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

        private void OnLogCarPosRot(IPlayer player)
        {
            if (player.Vehicle == null)
            {
                return;
            }

            player.Emit("FireFighters:Debug:Log", JsonConvert.SerializeObject(player.Vehicle.Position));
            player.Emit("FireFighters:Debug:Log", JsonConvert.SerializeObject(player.Vehicle.Rotation));
        }

        private void OnSetFlameLevel(IPlayer player, ulong flameId, uint level)
        {
            if (!AltEntitySync.TryGetEntity(flameId, 992_002, out AltV.Net.EntitySync.IEntity entity))
            {
                return;
            }

            if (entity is not Flame flame)
            {
                return;
            }

            flame.Level = level;
        }

        private void OnGetFlameLevel(IPlayer player, ulong flameId)
        {
            if (!AltEntitySync.TryGetEntity(flameId, 992_002, out AltV.Net.EntitySync.IEntity entity))
            {
                return;
            }

            if (entity is not Flame flame)
            {
                return;
            }

            player.Emit("FireFighters:Debug:Log", $"Flame {flame.Id} has level {flame.Level}");
        }
    }
}
