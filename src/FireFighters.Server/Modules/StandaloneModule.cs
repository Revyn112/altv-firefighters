using AltV.Net;
using AltV.Net.Async;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using Newtonsoft.Json;
using System.Linq;

namespace FireFighters.Server.Modules
{
    internal sealed class StandaloneModule
        : IScript
    {
        public StandaloneModule()
        {
            Alt.OnPlayerConnect += (player, reason) => OnPlayerConnect(player, reason);
            Alt.OnClient<IPlayer, string>("FireFighters:SpawnAtPoint", OnSpawnAtPoint);
        }

        public void OnPlayerConnect(IPlayer player, string reason)
        {
            Alt.Log($"Player {player.Name} connected with IP {player.Ip}");

            player.Position = new Position();
            player.Dimension = 100 + player.Id;

            player.Emit("FireFighters:InitFireStations", FirefighterResource.FireStations);
            player.Emit("FireFighters:SelectSpawn", JsonConvert.SerializeObject(FirefighterResource.FireStations.Select(e => e.Name)));
        }

        private void OnSpawnAtPoint(IPlayer player, string fireStationName)
        {
            var fireStation = FirefighterResource.FireStations.SingleOrDefault(e => e.Name == fireStationName);

            if (fireStation == null)
            {
                player.Kick("Invalid FireStation selected");
                return;
            }

            player.Model = (uint)AltV.Net.Enums.PedModel.Fireman01SMY;

            player.Spawn(fireStation.Position);

            player.Dimension = 0;

            player.Emit("FireFighters:PlayerSpawned");
        }
    }
}
