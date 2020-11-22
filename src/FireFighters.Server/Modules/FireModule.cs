using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using AltV.Net.EntitySync;
using FireFighters.Models;
using FireFighters.Server.Builders;
using System.Linq;
using System.Numerics;

namespace FireFighters.Server.Modules
{
    public class FireModule
        : IScript
    {
        public const int FireStreamRange = 500;

        public FireModule()
        {
            Alt.OnServer<Position>("FireFighters:Fire:Create", OnServerFireCreate);
            Alt.OnServer<ulong>("FireFighters:Fire:Remove", OnServerFireRemove);

            Alt.OnClient<ulong>("FireFighters:Flame:ScriptFireExtinguished", OnClientFlameScriptFireExtinguished);
            Alt.OnClient<ulong, float>("FireFighters:Flame:FoundPositionGround", OnClientFlameFoundPositionGround);
        }

        private void OnServerFireCreate(Position position)
        {
            var _ = new FireBuilder()
                .SetPosition(position)
                .SetFlameSpawnDelay(3000)
                .InitializeFire();
        }

        private void OnServerFireRemove(ulong fireId)
        {
            // Console.WriteLine($"Try to stop fire {fireId}");

            if (!AltEntitySync.TryGetEntity(fireId, (ulong)EntityTypes.Fire, out AltV.Net.EntitySync.IEntity entity))
            {
                return;
            }

            if (entity is not Fire fire)
            {
                return;
            }

            fire.MainFlame.Extinguished = true;

            // Console.WriteLine($"Fire {fireId} stopped");
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
        }

        private void OnClientFlameFoundPositionGround(IPlayer player, ulong entityId, float ground)
        {
            if (!AltEntitySync.TryGetEntity(entityId, (ulong)EntityTypes.Flame, out AltV.Net.EntitySync.IEntity entity))
            {
                return;
            }

            if (entity is not Flame flame)
            {
                return;
            }

            flame.Position = new Vector3(flame.Position.X, flame.Position.Y, ground);
            flame.IsPositionGroundValidated = true;
        }
    }
}
