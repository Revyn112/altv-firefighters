using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using FireFighters.ServerStandalone;
using Newtonsoft.Json;
using System.Linq;

namespace FireFighters.Standalone.Server.Modules
{
    public class SpawnModule
        : IScript
    {
        public SpawnModule()
        {
            Alt.OnClient("FireFighters:Debug:SpawnMenu", OnSpawnMenu);
        }

        private void OnSpawnMenu(IPlayer player)
        {
            player.Position = new Position();
            player.Dimension = 100 + player.Id;
            player.Emit("FireFighters:SelectSpawn", JsonConvert.SerializeObject(StandaloneResource.FireStations.Select(e => e.Name)));
        }
    }
}
