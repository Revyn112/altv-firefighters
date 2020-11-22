using AltV.Net;
using AltV.Net.Elements.Entities;
using AltV.Net.EntitySync;
using FireFighters.Models;
using System;
using System.Numerics;

namespace FireFighters.Server.Builders
{
    public class FlameBuilder
    {
        private bool _isGasFire;
        private Vector3 _position;
        private uint _level;

        public FlameBuilder()
        {
            Reset();
        }

        public FlameBuilder Reset()
        {
            _isGasFire = false;
            _position = Vector3.Zero;
            _level = 0;

            return this;
        }

        public FlameBuilder GasFire()
        {
            _isGasFire = true;
            return this;
        }

        public FlameBuilder SetPosition(Vector3 position)
        {
            _position = position;
            return this;
        }

        public FlameBuilder SetLevel(uint level)
        {
            _level = level;
            return this;
        }

        public Flame InitializeFlame()
        {
            if (_position == Vector3.Zero) // multithreading issue: race-condition
            {
                var ex = new InvalidOperationException("Flame needs a position");
                Alt.Log("Exception on FlameBuilder: " + ex.Message);
                throw ex;
            }

            var nearestDistance = float.MaxValue;
            IPlayer nearestPlayer = null;

            foreach (var player in Alt.GetAllPlayers())
            {
                var distance = player.Position.Distance(_position);

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

            var flame = new Flame(_position, _isGasFire)
            {
                Level = _level
            };

            AltEntitySync.AddEntity(flame);

            nearestPlayer.Emit("FireFighters:Flame:DeterminePositionGround", flame.Id, flame.Position);

            return flame;
        }
    }
}
