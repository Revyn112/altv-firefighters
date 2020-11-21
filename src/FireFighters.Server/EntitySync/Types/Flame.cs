using AltV.Net.EntitySync;
using FireFighters.Server.Modules;
using System;
using System.Collections.Generic;
using System.Numerics;
using System.Threading;

namespace FireFighters.Server.EntitySync.Types
{
    public class Flame
        : Entity
    {
        private readonly Flame _parent;
        private readonly Random _random;
        private readonly CancellationToken _cancelToken;

        private DateTime _lastManagedTick;

        public Flame(Flame parent, Vector3 position, bool isGasFire)
            : base((ulong)EntityTypes.Flame, position, 0, FireModule.FireStreamRange)
        {
            IsGasFire = isGasFire;
            Level = 0;

            _parent = parent;
            _random = new Random();
            _cancelToken = parent?._cancelToken ?? new CancellationToken();

            Children = new List<Flame>();
        }

        public bool IsGasFire
        {
            get
            {
                if (!TryGetData("isGasFire", out bool isGasFire))
                    return false;

                return isGasFire;
            }
            set
            {
                SetData("isGasFire", value);
            }
        }

        public uint Level
        {
            get
            {
                if (!TryGetData("level", out uint level))
                    return 0;

                return level;
            }
            set
            {
                SetData("level", value);
            }
        }

        public bool Extinguished
        {
            get
            {
                if (!TryGetData("extinguished", out bool extinguished))
                    return false;

                return extinguished;
            }
            set
            {
                SetData("extinguished", value);
            }
        }

        public bool IsPositionGroundValidated
        {
            get
            {
                if (!TryGetData("isPositionGroundValidated", out bool isPositionGroundValidated))
                    return false;

                return isPositionGroundValidated;
            }
            set
            {
                SetData("isPositionGroundValidated", value);
            }
        }

        public List<Flame> Children { get; set; }

        public void OnTick()
        {
            if (_cancelToken.IsCancellationRequested || !IsPositionGroundValidated)
            {
                return;
            }

            if (Extinguished)
            {
                AltEntitySync.RemoveEntity(this);
                return;
            }

            // manage level up
            if (DateTime.Now < _lastManagedTick + TimeSpan.FromSeconds(10d))
            {
                return;
            }

            _lastManagedTick = DateTime.Now;
            
            if (_random.Next(0, 100) + Math.Max(Level, 20) >= 30)
            {
                Level += 1;
            }

            // create children
            if (Level > 10 && _random.Next(0, 100) < 10)
            {
                var childFlamePos = Position + new Vector3(_random.Next(0, 8), _random.Next(0, 9), 0);

                var childFlame = new FlameBuilder(this).SetPosition(childFlamePos).InitializeFlame();
                Children.Add(childFlame);
            }
        }
    }
}
