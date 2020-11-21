using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using AltV.Net.EntitySync;
using FireFighters.Server.EntitySync;
using FireFighters.Server.EntitySync.Types;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace FireFighters.Server.Modules
{
    public class FireModule
        : IScript
    {
        public const int FireStreamRange = 500;

        public FireModule()
        {
            Alt.OnServer<Position>("FireFighters:Fire:Create", OnServerFireCreate);
            
            Alt.OnClient("FireFighters:Fire:Create", OnClientFireCreate);
            Alt.OnClient<ulong>("FireFighters:Flame:ScriptFireExtinguished", OnClientFlameScriptFireExtinguished);
            Alt.OnClient<ulong, Position>("FireFighters:Flame:FoundPositionGround", OnClientFlameFoundPositionGround);
        }

        private void OnClientFlameFoundPositionGround(ulong entityId, Position position)
        {
            if (!AltEntitySync.TryGetEntity(entityId, (ulong)EntityTypes.Flame, out AltV.Net.EntitySync.IEntity entity))
            {
                return;
            }

            if (entity is not Flame flame)
            {
                return;
            }

            flame.Position = position;
            flame.IsPositionGroundValidated = true;
        }

        private void OnServerFireCreate(Position position)
        {
            var _ = new FireBuilder()
                .SetPosition(position)
                .InitializeFire();
        }

        private void OnClientFireCreate(IPlayer player)
        {
            var _ = new FireBuilder()
                .SetPosition(player.Position)
                .InitializeFire();
        }

        private void OnClientFlameScriptFireExtinguished(IPlayer player, ulong entityId)
        {
            if (!AltEntitySync.TryGetEntity(entityId, (ulong)EntityTypes.Flame, out AltV.Net.EntitySync.IEntity entity))
            {
                return;
            }

            if (entity is not Flame flame)
            {
                return;
            }

            if (flame.Children.Any())
            {
                player.Emit("FireFighters:Flame:RespawnScriptFire", entityId);
                return;
            }

            flame.Extinguished = true;
            AltEntitySync.RemoveEntity(flame);
        }
    }
}
