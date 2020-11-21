using AltV.Net;
using AltV.Net.Elements.Entities;
using AltV.Net.EntitySync;
using FireFighters.Server.EntitySync.Types;
using System;
using System.Numerics;

namespace FireFighters.Server
{
    public class FlameBuilder
    {
        private Flame _flame;

        public FlameBuilder(Flame parent = null)
        {
            Reset(parent);
        }

        public FlameBuilder Reset(Flame parent)
        {
            _flame = new Flame(parent, parent?.Position ?? Vector3.Zero, false);
            return this;
        }

        public FlameBuilder GasFire()
        {
            _flame.IsGasFire = true;
            return this;
        }

        public FlameBuilder SetPosition(Vector3 position)
        {
            _flame.Position = position;
            return this;
        }

        public FlameBuilder SetLevel(ushort level)
        {
            _flame.Level = level;
            return this;
        }

        public Flame InitializeFlame()
        {
            if (_flame.Position == Vector3.Zero) // multithreading issue: race-condition
            {
                var ex = new InvalidOperationException("Flame needs a position");
                Alt.Log("Exception on FlameBuilder: " + ex.Message);
                throw ex;
            }

            var nearestDistance = float.MaxValue;
            IPlayer nearestPlayer = null;

            foreach (var player in Alt.GetAllPlayers())
            {
                var distance = player.Position.Distance(_flame.Position);

                if (distance < nearestDistance)
                {
                    nearestDistance = distance;
                    nearestPlayer = player;
                }
            }

            if (nearestPlayer == null)
            {
                var ex = new InvalidOperationException("Flame could not be created, because no nearest player found");
                Alt.Log("Exception on FlameBuilder: " + ex.Message);
                throw ex;
            }

            AltEntitySync.AddEntity(_flame);

            nearestPlayer.Emit("FireFighters:Flame:DeterminePositionGround", _flame.Id, _flame.Position);

            return _flame;
        }
    }
}
